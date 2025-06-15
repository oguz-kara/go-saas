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
import slugify from 'slugify'
import { AttributeTypeEntity } from '../../api/graphql/entities/attribute-type.entity'

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

    const whereClause: Prisma.AttributeValueWhereInput = {
      channelToken: channel.token,
      attributeTypeId: attributeTypeId,
      deletedAt: null,
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

    // Önce AttributeType'ın bu tenanta ait olup olmadığını kontrol et
    const attributeTypeExists = await this.prisma.attributeType.findFirst({
      where: {
        id: attributeTypeId,
        channelToken: channel.token,
      },
    })
    if (!attributeTypeExists) {
      throw new NotFoundException(
        `Attribute type with ID "${attributeTypeId}" not found in this channel.`,
      )
    }

    if (parentId) {
      const parentExists = await this.prisma.attributeValue.findFirst({
        where: {
          id: parentId,
          channelToken: channel.token,
          attributeTypeId: attributeTypeId,
        },
      })
      if (!parentExists) {
        throw new NotFoundException(
          `Parent attribute value with ID "${parentId}" is not valid.`,
        )
      }
    }

    this.logger.log(
      `User creating attribute value "${value}" for type ${attributeTypeId}`,
    )

    const isAttributeExists = await this.prisma.attributeValue.findFirst({
      where: {
        value,
        attributeTypeId,
        channelToken: channel.token,
      },
    })

    this.logger.log('isAttributeExists', isAttributeExists)

    if (isAttributeExists) {
      this.logger.log(
        `Attribute value "${value}" already exists for this attribute type.`,
      )
    }

    this.logger.log(
      `User creating attribute value "${value}" for type ${attributeTypeId}`,
      'create',
    )

    try {
      if (isAttributeExists) {
        const newValue = await this.prisma.attributeValue.update({
          where: {
            id: isAttributeExists.id,
            value: value,
          },
          data: {
            value,
            deletedAt: null,
            attributeTypeId,
            channelToken: channel.token,
          },
        })

        return { ...newValue, meta: newValue.meta as Record<string, any> }
      } else {
        const newValue = await this.prisma.attributeValue.create({
          data: {
            value,
            code: slugify(value, { lower: true }),
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
      }
    } catch (error) {
      this.logger.error('error', error)
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

    const { value, parentId, meta } = input

    this.logger.log(`User updating attribute value ${id}`, 'update')

    try {
      const updatedValue = await this.prisma.attributeValue.update({
        where: { id },
        data: {
          value,
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

    const assignmentCount = await this.prisma.attributeAssignment.count({
      where: { attributeValueId: id },
    })
    if (assignmentCount > 0) {
      throw new ConflictException(
        `Cannot delete value because it is assigned to ${assignmentCount} record(s).`,
      )
    }

    await this.prisma.attributeValue.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return { success: true }
  }
}
