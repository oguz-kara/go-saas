import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { CompanyEntity } from '../../api/graphql/entities/company.entity'
import { RequestContext } from 'src/common/request-context/request-context'
import { CreateCompanyInput } from '../../api/graphql/dto/create-company.input'
import { AttributableType, AttributeAssignment, Prisma } from '@prisma/client'
import { UpdateCompanyInput } from '../../api/graphql/dto/update-company.input'
import { AttributeFilterInput } from '../../api/graphql/dto/attribute-filter.input'
import { AttributeWithTypeEntity } from '../../api/graphql/dto/attribute-with-type.object-type'
import { AttributeTypeEntity } from 'src/modules/attribute/api/graphql/entities/attribute-type.entity'
import { EntityNotFoundException } from 'src/common/exceptions'

@Injectable()
export class CompanyService {
  private readonly logger = new Logger(CompanyService.name)

  constructor(private readonly prisma: PrismaService) {}

  async createCompany(
    ctx: RequestContext,
    createCompanyInput: CreateCompanyInput,
    channelToken?: string,
  ): Promise<CompanyEntity> {
    const { channel, user } = ctx

    const {
      name,
      website,
      linkedinUrl,
      address,
      description,
      email,
      phoneNumber,
      socialProfiles,
      taxId,
      attributeIds,
      addressAttributeCodes,
    } = createCompanyInput

    const ct = channelToken ? channelToken : channel.token

    if (!ct) {
      this.logger.error('Channel token is missing from request context.')
      throw new InternalServerErrorException(
        'Channel token is required to create a company.',
      )
    }

    this.logger.log(`User ${user?.id} creating company via channel ${ct}`)

    try {
      return await this.prisma.$transaction(async (tx) => {
        let resolvedAddressValueIds: string[] = []
        let resolvedAttributeValueIds: string[] = []

        if (addressAttributeCodes && addressAttributeCodes.length > 0) {
          const foundValues = await tx.attributeValue.findMany({
            where: {
              code: { in: addressAttributeCodes },
              channelToken: ct,
              deletedAt: null,
            },
            select: { id: true, code: true },
          })

          if (foundValues.length !== addressAttributeCodes.length) {
            const notFoundCodes = addressAttributeCodes.filter(
              (code) => !foundValues.find((v) => v.code === code),
            )
            throw new ConflictException(
              `The following address codes are invalid: ${notFoundCodes.join(', ')}`,
            )
          }
          resolvedAddressValueIds = foundValues.map((v) => v.id)
        }

        if (attributeIds && attributeIds.length > 0) {
          const foundAttributes = await tx.attributeValue.findMany({
            where: {
              id: { in: attributeIds },
              channelToken: ct,
              deletedAt: null,
            },
            select: { id: true },
          })
          const foundIds = foundAttributes.map((v) => v.id)
          if (foundIds.length !== attributeIds.length) {
            const notFoundIds = attributeIds.filter(
              (id) => !foundIds.includes(id),
            )
            throw new ConflictException(
              `The following attribute value IDs are invalid: ${notFoundIds.join(', ')}`,
            )
          }
          resolvedAttributeValueIds = foundIds
        }

        const allAttributeValueIds = [
          ...resolvedAttributeValueIds,
          ...resolvedAddressValueIds,
        ]
        const uniqueAttributeValueIds = [...new Set(allAttributeValueIds)]

        // 1. Create the company first (without attributeAssignments)
        const company = await tx.company.create({
          data: {
            name,
            website,
            linkedinUrl,
            address: address ? (address as Prisma.JsonObject) : Prisma.JsonNull,
            socialProfiles: socialProfiles
              ? (socialProfiles as Prisma.JsonObject)
              : Prisma.JsonNull,
            description,
            email,
            phoneNumber,
            taxId,
            channelToken: ct,
          },
        })

        // 2. Create attribute assignments if any
        if (uniqueAttributeValueIds.length > 0) {
          await tx.attributeAssignment.createMany({
            data: uniqueAttributeValueIds.map((valueId) => ({
              attributeValueId: valueId,
              attributableType: AttributableType.COMPANY,
              attributableId: company.id,
              channelToken: ct,
              companyId: company.id,
              assignedById: ctx.user?.id || null,
            })),
          })
        }

        return company as CompanyEntity
      })
    } catch (error) {
      this.logger.error(
        `Failed to create company via channel ${channelToken}: ${error.message}`,
        error.stack,
      )
      throw new InternalServerErrorException('Could not create company.')
    }
  }

  async getCompanies(
    ctx: RequestContext,
    args: {
      skip?: number
      take?: number
      searchQuery?: string
      channelToken?: string
      filters?: AttributeFilterInput[]
      address?: string
    },
  ): Promise<{ items: CompanyEntity[]; totalCount: number }> {
    const { user, channel } = ctx
    const {
      skip = 0,
      take = 10,
      searchQuery,
      channelToken,
      filters,
      address,
    } = args
    const ct = channelToken ? channelToken : channel.token

    this.logger.log(
      `User ${user?.id} fetching companies with args: ${JSON.stringify(args)}`,
    )

    const whereClause: Prisma.CompanyWhereInput = {
      deletedAt: null,
    }

    if (ct) {
      whereClause.channelToken = ct
    }

    if (searchQuery) {
      whereClause.OR = [
        { name: { contains: searchQuery, mode: 'insensitive' } },
        { description: { contains: searchQuery, mode: 'insensitive' } },
      ]
    }

    if (filters && filters.length > 0) {
      const groupedFilters = filters.reduce(
        (acc, filter) => {
          if (!acc[filter.attributeTypeId]) {
            acc[filter.attributeTypeId] = new Set()
          }
          filter.valueIds.forEach((id) => acc[filter.attributeTypeId].add(id))
          return acc
        },
        {} as Record<string, Set<string>>,
      )

      whereClause.AND = Object.entries(groupedFilters).map(
        ([attributeTypeId, valueIdSet]) => ({
          attributeAssignments: {
            some: {
              attributeValue: {
                OR: [
                  {
                    code: { in: Array.from(valueIdSet) },
                  },
                  {
                    attributeTypeId,
                  },
                ],
              },
            },
          },
        }),
      )
    }

    if (address) {
      const addressParts = address.split('-')

      // Build an array of address filters, one for each part
      const addressFilters = addressParts.map((part) => ({
        attributeAssignments: {
          some: { attributeValue: { code: part } },
        },
      }))

      // Merge with any existing AND conditions
      if (whereClause.AND && Array.isArray(whereClause.AND)) {
        whereClause.AND = [...whereClause.AND, ...addressFilters]
      } else {
        whereClause.AND = addressFilters
      }
    }

    console.log({ whereClause: JSON.stringify(whereClause, null, 4) })

    try {
      const companies = await this.prisma.company.findMany({
        where: whereClause,
        skip,
        take,
        orderBy: {
          createdAt: 'desc',
        },
      })

      const totalCount = await this.prisma.company.count({
        where: whereClause,
      })

      return { items: companies as CompanyEntity[], totalCount }
    } catch (error) {
      this.logger.error(
        `Failed to fetch companies for user ${user?.id} with args ${JSON.stringify(args)}: ${error.message}`,
        error.stack,
      )
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle specific Prisma errors if needed, e.g., P2021 (Table does not exist)
        throw new InternalServerErrorException(
          'Database error occurred while fetching companies.',
        )
      }
      throw new InternalServerErrorException('Could not fetch companies.')
    }
  }

  async getCompanyById(
    ctx: RequestContext,
    id: string,
    args?: {
      channelToken?: string
    },
  ): Promise<CompanyEntity> {
    const { user, channel } = ctx
    const { channelToken = undefined } = args || {}

    this.logger.log(
      `User ${user?.id} fetching company with ID: ${id}`,
      'getCompanyById',
    )

    const ct = channelToken ? channelToken : channel.token

    try {
      const company = await this.prisma.company.findFirst({
        where: { id, channelToken: ct, deletedAt: null },
        include: {
          attributeAssignments: {
            include: {
              attributeValue: {
                include: {
                  type: true,
                },
              },
            },
          },
        },
      })

      if (!company) {
        throw new EntityNotFoundException('Company', id)
      }
      return company as CompanyEntity
    } catch (error) {
      if (error instanceof EntityNotFoundException) {
        this.logger.warn(
          `Company not found for ID: ${id}, requested by user ${user?.id}.`,
          'getCompanyById',
        )
        throw error // Re-throw the specific not found error
      }
      this.logger.error(
        `Failed to fetch company with ID ${id} for user ${user?.id}: ${error.message}`,
        error.stack,
        'getCompanyById',
      )
      throw new InternalServerErrorException('Could not fetch company.')
    }
  }

  async updateCompany(
    ctx: RequestContext,
    id: string,
    input: UpdateCompanyInput,
  ): Promise<CompanyEntity> {
    const { channel, jwtPayload } = ctx
    if (!channel.token || !jwtPayload?.sub) {
      throw new UnauthorizedException(
        'User or Channel could not be identified.',
      )
    }

    this.logger.log(`User ${jwtPayload.sub} updating company with ID: ${id}`)

    const existingCompany = await this.prisma.company.findFirst({
      where: { id, channelToken: channel.token, deletedAt: null },
    })
    if (!existingCompany) {
      throw new EntityNotFoundException('Company', id)
    }

    const { attributeIds, addressAttributeCodes, ...companyData } = input

    try {
      return await this.prisma.$transaction(async (tx) => {
        // --- createCompany'deki ile aynı ID çözümleme mantığı ---
        let resolvedAddressValueIds: string[] = []
        if (addressAttributeCodes && addressAttributeCodes.length > 0) {
          const foundValues = await tx.attributeValue.findMany({
            where: {
              code: { in: addressAttributeCodes },
              channelToken: channel.token,
              deletedAt: null,
            },
            select: { id: true, code: true },
          })

          if (foundValues.length !== addressAttributeCodes.length) {
            const notFoundCodes = addressAttributeCodes.filter(
              (code) => !foundValues.find((v) => v.code === code),
            )
            throw new ConflictException(
              `Invalid address codes: ${notFoundCodes.join(', ')}`,
            )
          }
          resolvedAddressValueIds = foundValues.map((v) => v.id)
        }

        let resolvedAttributeValueIds: string[] = []
        if (attributeIds && attributeIds.length > 0) {
          const foundAttributes = await tx.attributeValue.findMany({
            where: {
              id: { in: attributeIds },
              channelToken: channel.token,
              deletedAt: null,
            },
            select: { id: true },
          })
          const foundIds = foundAttributes.map((v) => v.id)
          if (foundIds.length !== attributeIds.length) {
            const notFoundIds = attributeIds.filter(
              (id) => !foundIds.includes(id),
            )
            throw new ConflictException(
              `Invalid attribute value IDs: ${notFoundIds.join(', ')}`,
            )
          }
          resolvedAttributeValueIds = foundIds
        }

        const allAttributeValueIds = [
          ...resolvedAttributeValueIds,
          ...resolvedAddressValueIds,
        ]
        const uniqueAttributeValueIds = [...new Set(allAttributeValueIds)]
        // --- Bitiş: ID Çözümleme ---

        // 2. Önce şirketin mevcut tüm attribute atamalarını sil
        await tx.attributeAssignment.deleteMany({
          where: {
            attributableId: id,
            attributableType: AttributableType.COMPANY,
          },
        })

        // 3. Şirketin temel bilgilerini güncelle
        const updatedCompany = await tx.company.update({
          where: { id },
          data: {
            ...companyData,
            address: companyData.address
              ? (companyData.address as Prisma.JsonObject)
              : undefined,
            socialProfiles: companyData.socialProfiles
              ? (companyData.socialProfiles as Prisma.JsonObject)
              : undefined,
            // Yeni attribute atamalarını `create` ile ekliyoruz
            attributeAssignments: {
              create: uniqueAttributeValueIds.map((valueId) => ({
                attributeValue: { connect: { id: valueId } },
                attributableType: AttributableType.COMPANY,
                channel: { connect: { token: channel.token } },
                assignedBy: { connect: { id: jwtPayload.sub } },
                attributableId: id,
              })),
            },
          },
        })

        return updatedCompany as CompanyEntity
      })
    } catch (error) {
      // Servis içinde fırlattığımız bilinen hataları olduğu gibi geri döndür
      if (
        error instanceof EntityNotFoundException ||
        error instanceof ConflictException
      ) {
        throw error
      }
      this.logger.error(
        `Failed to update company ${id}: ${error.message}`,
        error.stack,
      )
      throw new InternalServerErrorException('Could not update company.')
    }
  }

  async deleteCompany(
    ctx: RequestContext,
    id: string,
    args?: {
      channelToken?: string
    },
  ): Promise<CompanyEntity> {
    const { user, channel } = ctx
    const { channelToken = undefined } = args || {}

    const ct = channelToken ? channelToken : channel.token

    this.logger.log(
      `User ${user?.id} attempting to soft delete company with ID: ${id}`,
      'deleteCompany',
    )

    const deleteTimestamp = new Date()

    try {
      const companyToUpdate = await this.prisma.company.findFirst({
        where: {
          id,
          deletedAt: null,
          channelToken: ct,
        },
      })

      if (!companyToUpdate) {
        this.logger.warn(
          `Failed to soft delete company. Company not found or already deleted with ID: ${id}, for user ${user?.id}.`,
          'deleteCompany',
        )
        throw new EntityNotFoundException('Company', id)
      }

      const softDeletedCompany = await this.prisma.company.update({
        where: { id, channelToken: ct },
        data: {
          deletedAt: deleteTimestamp,
        },
      })
      return softDeletedCompany as CompanyEntity
    } catch (error) {
      // If the findFirst check passes but update still fails with P2025 (e.g. race condition, though unlikely here)
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        this.logger.warn(
          `Failed to soft delete company during update. Company not found with ID: ${id}, for user ${user?.id}.`,
          'deleteCompany',
        )
        throw new EntityNotFoundException('Company', id)
      } else if (error instanceof EntityNotFoundException) {
        throw error
      }
      this.logger.error(
        `Failed to soft delete company with ID ${id} for user ${user?.id}: ${error.message}`,
        error.stack,
        'deleteCompany',
      )
      throw new InternalServerErrorException('Could not delete company.')
    }
  }

  async getCompanyAttributes(
    ctx: RequestContext,
    companyId: string,
  ): Promise<AttributeWithTypeEntity[]> {
    const { channel } = ctx
    if (!channel.token) {
      throw new UnauthorizedException('Channel could not be identified.')
    }

    const attributes = await this.prisma.attributeValue.findMany({
      where: {
        channelToken: channel.token,
        deletedAt: null,
        assignments: {
          some: {
            companyId,
          },
        },
      },
      include: { type: true },
    })

    return attributes.map((attribute) => ({
      id: attribute.id,
      name: attribute.type.name,
      value: attribute.value,
      type: attribute.type as unknown as AttributeTypeEntity,
      attributeTypeId: attribute.attributeTypeId,
    }))
  }

  async getAssignmentsForCompany(
    ctx: RequestContext,
    companyId: string,
  ): Promise<AttributeAssignment[]> {
    const { channel } = ctx
    if (!channel.token) {
      throw new UnauthorizedException('Channel could not be identified.')
    }

    return await this.prisma.attributeAssignment.findMany({
      where: {
        attributableId: companyId,
        attributableType: 'COMPANY',
        channelToken: channel.token,
      },
      include: {
        attributeValue: {
          include: {
            type: true,
          },
        },
      },
    })
  }
}
