// src/modules/attribute-group/application/services/attribute-group.service.ts
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { RequestContext } from 'src/common/request-context/request-context'
import { CreateAttributeGroupInput } from '../../api/graphql/dto/create-attribute-group.input'
import { UpdateAttributeGroupInput } from '../../api/graphql/dto/update-attribute-group.input'
import { Prisma } from '@prisma/client'
import slugify from 'slugify'
import {
  EntityNotFoundException,
  UniqueConstraintViolationException,
  CannotDeleteParentEntityException,
  SystemDefinedEntityException,
} from 'src/common/exceptions'

@Injectable()
export class AttributeGroupService {
  private readonly logger = new Logger(AttributeGroupService.name)

  constructor(private readonly prisma: PrismaService) {}

  async create(ctx: RequestContext, input: CreateAttributeGroupInput) {
    const userChannelToken = ctx.channel.token
    if (!userChannelToken) {
      throw new UnauthorizedException('Channel could not be identified.')
    }

    try {
      return await this.prisma.attributeGroup.create({
        data: {
          name: input.name,
          code: slugify(input.name, { lower: true, strict: true }),
          channelToken: userChannelToken,
        },
      })
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
        `Failed to create attribute group: ${error.message}`,
        error.stack,
      )
      throw new InternalServerErrorException(
        'Could not create attribute group.',
      )
    }
  }

  async findAll(
    ctx: RequestContext,
    args: { skip?: number; take?: number; cursor?: { id: string } },
  ) {
    const userChannelToken = ctx.channel.token
    if (!userChannelToken) {
      throw new UnauthorizedException('Channel could not be identified.')
    }

    const [items, totalCount] = await Promise.all([
      this.prisma.attributeGroup.findMany({
        where: { channelToken: userChannelToken, deletedAt: null },
        orderBy: { order: 'asc' },
        skip: args.skip,
        take: args.take,
        cursor: args.cursor,
      }),
      this.prisma.attributeGroup.count({
        where: { channelToken: userChannelToken, deletedAt: null },
      }),
    ])

    return {
      items,
      totalCount,
    }
  }

  async update(
    ctx: RequestContext,
    id: string,
    input: UpdateAttributeGroupInput,
  ) {
    const userChannelToken = ctx.channel.token
    if (!userChannelToken) {
      throw new UnauthorizedException('Channel could not be identified.')
    }

    const existingGroup = await this.prisma.attributeGroup.findFirst({
      where: { id, channelToken: userChannelToken, deletedAt: null },
    })

    if (!existingGroup) {
      throw new EntityNotFoundException('AttributeGroup', id)
    }

    if (existingGroup.isSystemDefined) {
      throw new SystemDefinedEntityException('group', 'modify')
    }

    try {
      return await this.prisma.attributeGroup.update({
        where: { id },
        data: {
          name: input.name,
        },
      })
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
        `Failed to update attribute group ${id}: ${error.message}`,
        error.stack,
      )
      throw new InternalServerErrorException(
        'Could not update attribute group.',
      )
    }
  }

  async delete(ctx: RequestContext, id: string): Promise<{ success: boolean }> {
    const userChannelToken = ctx.channel.token
    if (!userChannelToken) {
      throw new UnauthorizedException('Channel could not be identified.')
    }

    const existingGroup = await this.prisma.attributeGroup.findFirst({
      where: { id, channelToken: userChannelToken, deletedAt: null },
      include: { _count: { select: { attributeTypes: true } } },
    })

    if (!existingGroup) {
      throw new EntityNotFoundException('AttributeGroup', id)
    }
    if (existingGroup.isSystemDefined) {
      throw new SystemDefinedEntityException('group', 'delete')
    }
    if (existingGroup._count.attributeTypes > 0) {
      throw new CannotDeleteParentEntityException('group', 'attribute types')
    }

    await this.prisma.attributeGroup.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return { success: true }
  }
}
