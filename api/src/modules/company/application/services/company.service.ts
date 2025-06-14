import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { CompanyEntity } from '../../api/graphql/entities/company.entity'
import { RequestContext } from 'src/common/request-context/request-context'
import { CreateCompanyInput } from '../../api/graphql/dto/create-company.input'
import { Prisma } from '@prisma/client'
import { CompanyNotFoundError } from '../../domain/exceptions/company-not-found.exception'
import { UpdateCompanyInput } from '../../api/graphql/dto/update-company.input'

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
      industry,
      linkedinUrl,
      address,
      description,
      attributeIds,
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
      const company = await this.prisma.company.create({
        data: {
          name,
          website,
          industry,
          linkedinUrl,
          address,
          description,
          channelToken: ct,
          attributes: {
            connect: attributeIds?.map((id) => ({ id })) || undefined,
          },
        },
      })
      return company as CompanyEntity
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
    },
  ): Promise<{ items: CompanyEntity[]; totalCount: number }> {
    const { user, channel } = ctx
    const { skip = 0, take = 10, searchQuery, channelToken } = args
    const ct = channelToken ? channelToken : channel.token

    this.logger.log(
      `User ${user?.id} fetching companies with args: ${JSON.stringify(args)}`,
    )

    const whereClause: any = {}

    if (ct) {
      whereClause.channelToken = ct
    }

    if (searchQuery) {
      whereClause.OR = [
        { name: { contains: searchQuery, mode: 'insensitive' } },
        { description: { contains: searchQuery, mode: 'insensitive' } },
      ]
    }

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
      const company = await this.prisma.company.findUnique({
        where: { id, channelToken: ct, deletedAt: null },
      })

      if (!company) {
        throw new CompanyNotFoundError(id)
      }
      return company as CompanyEntity
    } catch (error) {
      if (error instanceof CompanyNotFoundError) {
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
    updateData: UpdateCompanyInput,
    channelToken?: string,
  ): Promise<CompanyEntity> {
    const { user, channel } = ctx

    this.logger.log(
      `User ${user?.id} updating company with ID: ${id}. Data: ${JSON.stringify(updateData)}`,
      'updateCompany',
    )

    const { address, attributeIds, ...rest } = updateData

    const ct = channelToken ? channelToken : channel.token

    const prismaUpdateData: Prisma.CompanyUpdateInput = {
      ...rest,
      attributes: {
        set: attributeIds?.map((id) => ({ id })) || undefined,
      },
    }

    if (address) {
      prismaUpdateData.address = {
        toJSON() {
          return address
        },
      }
    }

    try {
      const updatedCompany = await this.prisma.company.update({
        where: {
          id,
          deletedAt: null,
          channelToken: ct,
        },
        data: prismaUpdateData,
      })
      return updatedCompany as CompanyEntity
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        // "An operation failed because it depends on one or more records that were required but not found. {cause}"
        this.logger.warn(
          `Failed to update company. Company not found with ID: ${id}, for user ${user?.id}.`,
          'updateCompany',
        )
        throw new CompanyNotFoundError(id)
      }
      this.logger.error(
        `Failed to update company with ID ${id} for user ${user?.id}: ${error.message}`,
        error.stack,
        'updateCompany',
      )
      throw new InternalServerErrorException('Could not update company.')
    }
  }

  // New deleteCompany method (Soft Delete)
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
        throw new CompanyNotFoundError(id)
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
        throw new CompanyNotFoundError(id)
      } else if (error instanceof CompanyNotFoundError) {
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
}
