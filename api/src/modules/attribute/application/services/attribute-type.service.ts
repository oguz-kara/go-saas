// src/modules/attribute-type/application/services/attribute-type.service.ts
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { RequestContext } from 'src/common/request-context/request-context'
import { CreateAttributeTypeInput } from '../../api/graphql/dto/create-attribute-type.input'
import { UpdateAttributeTypeInput } from '../../api/graphql/dto/update-attribute-type.input'
import { AttributeTypeKind, Prisma } from '@prisma/client'
import { ListQueryArgs } from 'src/common/graphql/dto/list-query.args'
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'src/common'
import { AttributeTypeEntity } from '../../api/graphql/entities/attribute-type.entity'
import slugify from 'slugify'
import { AttributeTypeHasValuesError } from '../../domain/exceptions'
import { SystemDefinedAttributeTypeError } from '../../domain/exceptions/system-defined-attribute-type.exception'

@Injectable()
export class AttributeTypeService {
  private readonly logger = new Logger(AttributeTypeService.name)

  constructor(private readonly prisma: PrismaService) {}

  async create(
    ctx: RequestContext,
    input: CreateAttributeTypeInput,
  ): Promise<AttributeTypeEntity> {
    const channelToken = ctx.channel?.token
    if (!channelToken) {
      throw new UnauthorizedException('Channel could not be identified.')
    }

    const { name, kind, dataType, groupId, availableFor, config } = input

    this.logger.log(
      `User creating attribute type "${name}" for channel ${channelToken}`,
    )

    if (groupId) {
      const groupExists = await this.prisma.attributeGroup.findFirst({
        where: { id: groupId, channelToken: channelToken },
      })
      if (!groupExists) {
        throw new NotFoundException(
          `AttributeGroup with ID "${groupId}" not found in this channel.`,
        )
      }
    }

    try {
      const attributeTypeData: Prisma.AttributeTypeCreateInput = {
        name,
        kind: kind as AttributeTypeKind,
        code: slugify(name, { lower: true }),
        dataType,
        config: config || Prisma.JsonNull,
        channel: { connect: { token: channelToken } },
        ...(groupId && { group: { connect: { id: groupId } } }),
        availableFor: {
          create: availableFor.map((entityType) => ({
            entityType: entityType,
          })),
        },
      }

      const newType = await this.prisma.attributeType.create({
        data: attributeTypeData,
        include: { group: true, availableFor: true },
      })

      return {
        ...newType,
        availableFor: newType.availableFor.map((item) => item.entityType),
      } as unknown as AttributeTypeEntity
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `Attribute type with name "${name}" already exists.`,
        )
      }
      this.logger.error(
        `Failed to create attribute type: ${error.message}`,
        error.stack,
      )
      throw new InternalServerErrorException('Could not create attribute type.')
    }
  }

  async findAll(
    ctx: RequestContext,
    args: ListQueryArgs & { includeSystemDefined?: boolean },
  ): Promise<{ items: AttributeTypeEntity[]; totalCount: number }> {
    const channelToken = ctx.channel?.token
    if (!channelToken) {
      throw new UnauthorizedException('Channel could not be identified.')
    }

    const {
      skip = DEFAULT_PAGE,
      take = DEFAULT_PAGE_SIZE,
      searchQuery,
      includeSystemDefined = false,
    } = args

    const whereClause: Prisma.AttributeTypeWhereInput = {
      channelToken: channelToken,
      deletedAt: null,
      isSystemDefined: includeSystemDefined,
    }

    if (searchQuery) {
      whereClause.name = { contains: searchQuery, mode: 'insensitive' }
    }

    try {
      const [totalCount, types] = await this.prisma.$transaction([
        this.prisma.attributeType.count({ where: whereClause }),
        this.prisma.attributeType.findMany({
          where: whereClause,
          skip,
          take,
          orderBy: { name: 'asc' },
          include: { group: true, availableFor: true },
        }),
      ])

      const items = types.map((type) => ({
        ...type,
        availableFor: type.availableFor.map((item) => item.entityType),
      }))

      return { items: items as unknown as AttributeTypeEntity[], totalCount }
    } catch (error) {
      this.logger.error(
        `Failed to fetch attribute types: ${error.message}`,
        error.stack,
      )
      throw new InternalServerErrorException('Could not fetch attribute types.')
    }
  }

  async update(
    ctx: RequestContext,
    id: string,
    input: UpdateAttributeTypeInput,
  ): Promise<AttributeTypeEntity> {
    const channelToken = ctx.channel?.token
    if (!channelToken) {
      throw new UnauthorizedException('Channel could not be identified.')
    }

    const { name, kind, dataType, groupId, availableFor, config } = input

    const existingType = await this.prisma.attributeType.findFirst({
      where: { id, channelToken: channelToken, deletedAt: null },
    })
    if (!existingType) {
      throw new NotFoundException(`Attribute type with ID "${id}" not found.`)
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        if (availableFor) {
          await tx.attributeTypeToEntityType.deleteMany({
            where: { attributeTypeId: id },
          })
        }

        const updatedType = await tx.attributeType.update({
          where: { id },
          data: {
            name,
            kind: kind as AttributeTypeKind,
            dataType,
            config: config ? (config as Prisma.JsonObject) : undefined,
            groupId,
            ...(availableFor && {
              availableFor: {
                create: availableFor.map((entityType) => ({
                  entityType: entityType,
                })),
              },
            }),
          },
          include: { group: true, availableFor: true },
        })

        return {
          ...updatedType,
          availableFor: updatedType.availableFor.map((item) => item.entityType),
        } as unknown as AttributeTypeEntity
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `Another attribute type with name "${input.name}" already exists.`,
        )
      }
      this.logger.error(
        `Failed to update attribute type ${id}: ${error.message}`,
        error.stack,
      )
      throw new InternalServerErrorException('Could not update attribute type.')
    }
  }

  async delete(ctx: RequestContext, id: string): Promise<{ success: boolean }> {
    const channelToken = ctx.channel?.token
    if (!channelToken) {
      throw new UnauthorizedException('Channel could not be identified.')
    }

    const existingType = await this.prisma.attributeType.findFirst({
      where: { id, channelToken: channelToken, deletedAt: null },
      include: { _count: { select: { values: true } } },
    })

    if (!existingType) {
      throw new NotFoundException(`Attribute type with ID "${id}" not found.`)
    }

    if (existingType.isSystemDefined) {
      throw new SystemDefinedAttributeTypeError(existingType.name)
    }

    if (existingType._count.values > 0) {
      throw new AttributeTypeHasValuesError(existingType.name)
    }

    await this.prisma.attributeType.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return { success: true }
  }
}
