// src/modules/attribute-value/application/services/attribute-value.service.ts
import {
  Injectable,
  Logger,
  UnauthorizedException,
  InternalServerErrorException,
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
import slugify from 'slugify'
import { AttributeTypeEntity } from '../../api/graphql/entities/attribute-type.entity'
import { GetAttributeValuesByCodeArgs } from '../../api/graphql/args/get-attribute-values-by-code.args'
import {
  CannotDeleteParentEntityException,
  EntityNotFoundException,
  UniqueConstraintViolationException,
} from 'src/common/exceptions'

@Injectable()
export class AttributeService {
  private readonly logger = new Logger(AttributeService.name)

  constructor(private readonly prisma: PrismaService) {}

  async getValues(ctx: RequestContext, args: GetAttributeValuesArgs) {
    console.log({ attribute: 'values' })
    const { channel } = ctx
    if (!channel.token) {
      throw new UnauthorizedException('Channel could not be identified.')
    }

    const {
      skip = DEFAULT_PAGE,
      take = DEFAULT_PAGE_SIZE,
      searchQuery,
      attributeTypeId,
      parentId,
    } = args

    const whereClause: Prisma.AttributeValueWhereInput = {
      channelToken: channel.token,
      attributeTypeId,
      deletedAt: null,
    }

    if (parentId !== undefined) {
      whereClause.parent = {
        code: parentId as string,
      }
    }

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

    console.log({ whereClause: JSON.stringify(whereClause) })

    try {
      const [totalCount, items] = await this.prisma.$transaction([
        this.prisma.attributeValue.count({ where: whereClause }),
        this.prisma.attributeValue.findMany({
          where: whereClause,
          skip,
          take,
          orderBy: { value: 'asc' },
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

  async getValuesByCode(
    ctx: RequestContext,
    args: GetAttributeValuesByCodeArgs,
  ) {
    console.log({ attribute: 'values by code' })
    const { channel } = ctx
    if (!channel.token) {
      throw new UnauthorizedException('Channel could not be identified.')
    }

    const {
      skip = DEFAULT_PAGE,
      take = DEFAULT_PAGE_SIZE,
      searchQuery,
      attributeTypeCode,
      parentCode,
    } = args

    const whereClause: Prisma.AttributeValueWhereInput = {
      channelToken: channel.token,
      type: {
        code: attributeTypeCode,
      },
      deletedAt: null,
    }

    if (parentCode) {
      whereClause.parent = {
        code: parentCode,
      }
    } else {
      whereClause.parentId = null
    }

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

    console.log({ whereClause: JSON.stringify(whereClause) })

    try {
      const [totalCount, items] = await this.prisma.$transaction([
        this.prisma.attributeValue.count({ where: whereClause }),
        this.prisma.attributeValue.findMany({
          where: whereClause,
          skip,
          take,
          orderBy: { value: 'asc' },
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

  async create(
    ctx: RequestContext,
    input: CreateAttributeInput,
  ): Promise<AttributeValueEntity> {
    const { channel } = ctx
    if (!channel.token) {
      throw new UnauthorizedException('Channel could not be identified.')
    }

    const { value, attributeTypeId, parentId, meta } = input

    const attributeTypeExists = await this.prisma.attributeType.findFirst({
      where: {
        id: attributeTypeId,
        channelToken: channel.token,
        deletedAt: null,
      },
    })
    if (!attributeTypeExists) {
      throw new EntityNotFoundException('AttributeType', attributeTypeId)
    }

    if (parentId) {
      const parentExists = await this.prisma.attributeValue.findFirst({
        where: {
          id: parentId,
          channelToken: channel.token,
          attributeTypeId: attributeTypeId,
          deletedAt: null,
        },
      })
      if (!parentExists) {
        throw new EntityNotFoundException('AttributeValue', parentId)
      }
    }

    // Check for a soft-deleted attribute value with the same value, attributeTypeId, and channelToken
    const softDeleted = await this.prisma.attributeValue.findFirst({
      where: {
        value,
        attributeTypeId,
        channelToken: channel.token,
        deletedAt: { not: null },
      },
    })

    if (softDeleted) {
      const revived = await this.prisma.attributeValue.update({
        where: { id: softDeleted.id },
        data: {
          deletedAt: null,
          value,
          code: slugify(value, { lower: true, strict: true }),
          parentId: parentId || undefined,
          meta: meta || Prisma.JsonNull,
        },
        include: { type: true },
      })
      return {
        ...revived,
        meta: revived.meta as Record<string, any>,
        type: revived.type as unknown as AttributeTypeEntity,
      }
    }

    this.logger.log(
      `User creating attribute value "${value}" for type ${attributeTypeId}`,
    )

    try {
      const newValue = await this.prisma.attributeValue.create({
        data: {
          value,
          code: slugify(value, { lower: true, strict: true }),
          meta: meta || Prisma.JsonNull,
          type: { connect: { id: attributeTypeId } },
          channel: { connect: { token: channel.token } },
          ...(parentId && { parent: { connect: { id: parentId } } }),
        },
        include: { type: true },
      })

      return {
        ...newValue,
        meta: newValue.meta as Record<string, any>,
        type: newValue.type as unknown as AttributeTypeEntity,
      }
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new UniqueConstraintViolationException(
          error.meta?.target as string[],
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

    const existingValue = await this.prisma.attributeValue.findFirst({
      where: { id, channelToken: channel.token, deletedAt: null },
    })
    if (!existingValue) {
      throw new EntityNotFoundException('AttributeValue', id)
    }

    const { value, parentId, meta } = input

    this.logger.log(`User updating attribute value ${id}`, 'update')

    try {
      const updatedValue = await this.prisma.attributeValue.update({
        where: { id },
        data: {
          value,
          ...(value && { code: slugify(value, { lower: true, strict: true }) }),
          parentId,
          meta: meta ? meta : undefined,
        },
        include: { type: true },
      })
      return {
        ...updatedValue,
        meta: updatedValue.meta as Record<string, any>,
        type: updatedValue.type as unknown as AttributeTypeEntity,
      }
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new UniqueConstraintViolationException(
          error.meta?.target as string[],
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
      throw new EntityNotFoundException('AttributeValue', id)
    }

    const assignmentCount = await this.prisma.attributeAssignment.count({
      where: { attributeValueId: id },
    })
    if (assignmentCount > 0) {
      throw new CannotDeleteParentEntityException('value', 'assignments')
    }

    await this.prisma.attributeValue.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return { success: true }
  }
}
