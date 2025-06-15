// src/modules/attribute-group/application/services/attribute-group.service.ts
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
import { CreateAttributeGroupInput } from '../../api/graphql/dto/create-attribute-group.input'
import { UpdateAttributeGroupInput } from '../../api/graphql/dto/update-attribute-group.input'
import { Prisma } from '@prisma/client'

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
          channelToken: userChannelToken,
        },
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `Group with name "${input.name}" already exists.`,
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
        orderBy: { name: 'asc' },
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
      throw new NotFoundException(`Attribute group with ID "${id}" not found.`)
    }

    try {
      return await this.prisma.attributeGroup.update({
        where: { id },
        data: { name: input.name },
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `Another group with name "${input.name}" already exists.`,
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
      throw new NotFoundException(`Attribute group with ID "${id}" not found.`)
    }
    if (existingGroup.isSystemDefined) {
      throw new ConflictException(
        `System-defined group "${existingGroup.name}" cannot be deleted.`,
      )
    }
    if (existingGroup._count.attributeTypes > 0) {
      throw new ConflictException(
        `Cannot delete group "${existingGroup.name}" because it contains attribute types.`,
      )
    }

    await this.prisma.attributeGroup.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return { success: true }
  }
}
