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
import { Prisma } from '@prisma/client'
import { ListQueryArgs } from 'src/common/graphql/dto/list-query.args'

@Injectable()
export class AttributeTypeService {
  private readonly logger = new Logger(AttributeTypeService.name)

  constructor(private readonly prisma: PrismaService) {}

  async create(ctx: RequestContext, input: CreateAttributeTypeInput) {
    const { channel } = ctx
    if (!channel.token) {
      throw new UnauthorizedException('Channel could not be identified.')
    }

    try {
      return await this.prisma.attributeType.create({
        data: {
          name: input.name,
          channelToken: channel.token,
        },
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `Attribute type with name "${input.name}" already exists in this channel.`,
        )
      }
      this.logger.error(
        `Failed to create attribute type: ${error.message}`,
        error.stack,
      )
      throw new InternalServerErrorException('Could not create attribute type.')
    }
  }

  async findAll(ctx: RequestContext, args: ListQueryArgs) {
    // Artık ListQueryArgs alıyor
    const { channel } = ctx
    if (!channel.token) {
      throw new UnauthorizedException('Channel could not be identified.')
    }

    const { skip = 0, take = 10, searchQuery } = args

    const whereClause: Prisma.AttributeTypeWhereInput = {
      channelToken: channel.token,
    }

    if (searchQuery) {
      whereClause.name = {
        contains: searchQuery,
        mode: 'insensitive',
      }
    }

    const [totalCount, items] = await this.prisma.$transaction([
      this.prisma.attributeType.count({ where: whereClause }),
      this.prisma.attributeType.findMany({
        where: whereClause,
        skip,
        take,
        orderBy: { name: 'asc' },
      }),
    ])

    return { items, totalCount }
  }

  async update(
    ctx: RequestContext,
    id: string,
    input: UpdateAttributeTypeInput,
  ) {
    const { channel } = ctx
    if (!channel.token) {
      throw new UnauthorizedException('Channel could not be identified.')
    }

    const existingType = await this.prisma.attributeType.findFirst({
      where: { id, channelToken: channel.token, deletedAt: null },
    })
    if (!existingType) {
      throw new NotFoundException(`Attribute type with ID "${id}" not found.`)
    }

    try {
      return await this.prisma.attributeType.update({
        where: { id }, // id'ye göre güncelle
        data: { name: input.name },
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
    const { channel } = ctx
    if (!channel.token) {
      throw new UnauthorizedException('Channel could not be identified.')
    }

    const existingType = await this.prisma.attributeType.findFirst({
      where: { id, channelToken: channel.token, deletedAt: null },
      include: { _count: { select: { values: true } } }, // İlişkili değer var mı diye kontrol et
    })

    if (!existingType) {
      throw new NotFoundException(`Attribute type with ID "${id}" not found.`)
    }

    if (existingType._count.values > 0) {
      throw new ConflictException(
        `Cannot delete attribute type "${existingType.name}" because it has associated values.`,
      )
    }

    await this.prisma.attributeType.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return { success: true }
  }
}
