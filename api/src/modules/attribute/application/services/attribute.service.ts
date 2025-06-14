// src/modules/attribute-value/application/services/attribute-value.service.ts
import {
  Injectable,
  Logger,
  UnauthorizedException,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { RequestContext } from 'src/common/request-context/request-context'
import { Prisma } from '@prisma/client'
import { GetAttributeValuesArgs } from 'src/modules/attribute/api/graphql/args/get-attribute-values.args'
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from 'src/common/constants/default-pagination-values'
import { AttributeValueEntity } from 'src/modules/attribute/api/graphql/entities/attribute.entity'
import { CreateAttributeInput } from 'src/modules/attribute/api/graphql/dto/create-attribute.input'
import { UpdateAttributeInput } from 'src/modules/attribute/api/graphql/dto/update-attribute.input'
import { AttributeWithTypeEntity } from 'src/modules/attribute/api/graphql/dto/attribute-with-type.object-type'

@Injectable()
export class AttributeService {
  private readonly logger = new Logger(AttributeService.name)

  constructor(private readonly prisma: PrismaService) {}

  async getValues(ctx: RequestContext, args: GetAttributeValuesArgs) {
    const { channel } = ctx
    if (!channel.token) {
      throw new UnauthorizedException('Channel could not be identified.')
    }

    const {
      skip = DEFAULT_PAGE,
      take = DEFAULT_PAGE_SIZE,
      searchQuery,
      attributeTypeId,
    } = args

    // Ana filtreleme koşulu: Belirtilen tipe ve tenanta ait olmalı
    const whereClause: Prisma.AttributeValueWhereInput = {
      channelToken: channel.token,
      attributeTypeId: attributeTypeId,
      deletedAt: null,
    }

    // Eğer bir arama metni varsa, 'value' alanında `contains` araması yap
    if (searchQuery) {
      whereClause.value = {
        contains: searchQuery,
        mode: 'insensitive',
      }
    }

    this.logger.log(
      `Fetching attribute values with args: ${JSON.stringify(args)}`,
      'getValues',
    )

    try {
      // Hem listeyi hem de toplam sayıyı tek bir veritabanı işleminde alıyoruz
      const [totalCount, items] = await this.prisma.$transaction([
        this.prisma.attributeValue.count({ where: whereClause }),
        this.prisma.attributeValue.findMany({
          where: whereClause,
          skip,
          take,
          orderBy: { value: 'asc' }, // Değerleri alfabetik sırala
          include: { type: true }, // Üst tipi de getir
        }),
      ])

      return { items, totalCount }
    } catch (error) {
      this.logger.error(
        `Failed to fetch attribute values: ${error.message}`,
        error.stack,
      )
      throw new InternalServerErrorException(
        'Could not fetch attribute values.',
      )
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
        companies: {
          some: {
            id: companyId,
          },
        },
      },
      include: { type: true },
    })

    return attributes.map((attribute) => ({
      id: attribute.id,
      name: attribute.type.name,
      value: attribute.value,
      type: attribute.type,
      attributeTypeId: attribute.attributeTypeId,
    }))
  }

  async create(
    ctx: RequestContext,
    input: CreateAttributeInput,
  ): Promise<AttributeValueEntity> {
    const { channel } = ctx
    if (!channel.token) {
      throw new UnauthorizedException('Channel could not be identified.')
    }

    const { value, attributeTypeId } = input

    // Önce AttributeType'ın bu tenanta ait olup olmadığını kontrol et
    const attributeTypeExists = await this.prisma.attributeType.findFirst({
      where: {
        id: attributeTypeId,
        channelToken: channel.token,
        deletedAt: null,
      },
    })
    if (!attributeTypeExists) {
      throw new NotFoundException(
        `Attribute type with ID "${attributeTypeId}" not found in this channel.`,
      )
    }

    this.logger.log(
      `User creating attribute value "${value}" for type ${attributeTypeId}`,
      'create',
    )

    try {
      const newValue = await this.prisma.attributeValue.create({
        data: {
          value,
          attributeTypeId,
          channelToken: channel.token,
        },
        include: { type: true },
      })
      return newValue as AttributeValueEntity
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `Value "${value}" already exists for this attribute type.`,
        )
      }
      this.logger.error(
        `Failed to create attribute value: ${error.message}`,
        error.stack,
      )
      throw new InternalServerErrorException(
        'Could not create attribute value.',
      )
    }
  }

  async update(
    ctx: RequestContext,
    id: string,
    input: UpdateAttributeInput,
  ): Promise<AttributeValueEntity> {
    const { channel } = ctx
    if (!channel.token) {
      throw new UnauthorizedException('Channel could not be identified.')
    }

    // Güncellenecek kaydın bu tenanta ait olduğunu doğrula
    const existingValue = await this.prisma.attributeValue.findFirst({
      where: { id, channelToken: channel.token, deletedAt: null },
    })
    if (!existingValue) {
      throw new NotFoundException(`Attribute value with ID "${id}" not found.`)
    }

    this.logger.log(`User updating attribute value ${id}`, 'update')

    try {
      const updatedValue = await this.prisma.attributeValue.update({
        where: { id },
        data: { value: input.value },
        include: { type: true },
      })
      return updatedValue as AttributeValueEntity
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `Another value with name "${input.value}" already exists for this attribute type.`,
        )
      }
      this.logger.error(
        `Failed to update attribute value ${id}: ${error.message}`,
        error.stack,
      )
      throw new InternalServerErrorException(
        'Could not update attribute value.',
      )
    }
  }

  async delete(ctx: RequestContext, id: string): Promise<{ success: boolean }> {
    const { channel } = ctx
    if (!channel.token) {
      throw new UnauthorizedException('Channel could not be identified.')
    }

    const existingValue = await this.prisma.attributeValue.findFirst({
      where: { id, channelToken: channel.token, deletedAt: null },
    })
    if (!existingValue) {
      throw new NotFoundException(`Attribute value with ID "${id}" not found.`)
    }

    const assignedCompaniesCount = await this.prisma.company.count({
      where: { attributes: { some: { id, deletedAt: null } } },
    })
    if (assignedCompaniesCount > 0) {
      throw new ConflictException(
        `Cannot delete value because it is assigned to ${assignedCompaniesCount} company/companies.`,
      )
    }

    await this.prisma.attributeValue.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return { success: true }
  }
}
