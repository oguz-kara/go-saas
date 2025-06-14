// src/modules/attribute-type/application/services/attribute-type.service.ts
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { RequestContext } from 'src/common/request-context/request-context'
import { CreateAttributeTypeInput } from '../../api/graphql/dto/create-attribute-type.input'
import { UpdateAttributeTypeInput } from '../../api/graphql/dto/update-attribute-type.input'
import { Prisma } from '@prisma/client'
import { ListQueryArgs } from 'src/common/graphql/dto/list-query.args'
import {
  AttributeTypeNotFoundError,
  AttributeTypeHasValuesError,
  AttributeTypeAlreadyExistsError,
} from 'src/modules/attribute/domain/exceptions'
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from 'src/common/constants/default-pagination-values'

@Injectable()
export class AttributeTypeService {
  private readonly logger = new Logger(AttributeTypeService.name)

  constructor(private readonly prisma: PrismaService) {}

  async create(ctx: RequestContext, input: CreateAttributeTypeInput) {
    const { channel } = ctx
    if (!channel.token) {
      throw new UnauthorizedException('Channel could not be identified.')
    }

    const isAttributeTypeWasDeleted = await this.prisma.attributeType.findFirst(
      {
        where: {
          name: input.name,
          channelToken: channel.token,
          deletedAt: { not: null },
        },
      },
    )

    if (isAttributeTypeWasDeleted) {
      await this.prisma.attributeType.update({
        where: { id: isAttributeTypeWasDeleted.id },
        data: { deletedAt: null, name: input.name },
      })
      return isAttributeTypeWasDeleted
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
        throw new AttributeTypeAlreadyExistsError(input.name)
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

    console.log({ args })

    const {
      skip = DEFAULT_PAGE,
      take = DEFAULT_PAGE_SIZE,
      searchQuery,
    } = args || {}

    const whereClause: Prisma.AttributeTypeWhereInput = {
      channelToken: channel.token,
      deletedAt: null,
    }

    if (searchQuery) {
      whereClause.name = {
        contains: searchQuery,
        mode: 'insensitive',
      }
    }

    console.log({ whereClause })

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
      throw new AttributeTypeNotFoundError(id)
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
        throw new AttributeTypeAlreadyExistsError(input.name)
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
      throw new AttributeTypeNotFoundError(id)
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
