// src/modules/channel/application/services/channel.service.ts
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  ConflictException, // For duplicate token/name
} from '@nestjs/common'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { RequestContext } from 'src/common/request-context/request-context'
import { ChannelEntity } from 'src/modules/channel/api/graphql/entities/channel.entity' // Your GQL Type
import { CreateChannelInput } from 'src/modules/channel/api/graphql/dto/create-channel.input'
import { Prisma } from '@prisma/client'
import { generateChannelToken } from '../../domain/utils/token'
import { PaginationArgs } from 'src/common'

@Injectable()
export class ChannelService {
  private readonly logger = new Logger(ChannelService.name)

  constructor(private readonly prisma: PrismaService) {}

  async createChannel(
    ctx: RequestContext,
    input: CreateChannelInput,
    args?: {
      tx?: Prisma.TransactionClient
    },
  ): Promise<ChannelEntity> {
    const dbClient = args?.tx || this.prisma
    const { user } = ctx
    const { name, description } = input

    const token = generateChannelToken()

    this.logger.log(
      `User ${user?.id || 'System'} creating channel: ${name} (Token: ${token})`,
      'createChannel',
    )

    try {
      const newChannel = await dbClient.channel.create({
        data: {
          name,
          token,
          description,
        },
      })
      return newChannel as ChannelEntity
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // Unique constraint violation
          const target = (error.meta?.target as string[]) || []
          if (target.includes('token')) {
            this.logger.warn(
              `Failed to create channel. Token "${token}" already exists.`,
              'createChannel',
            )
            throw new ConflictException(
              `Channel token "${token}" already exists.`,
            )
          }
          if (target.includes('name')) {
            this.logger.warn(
              `Failed to create channel. Name "${name}" already exists.`,
              'createChannel',
            )
            throw new ConflictException(
              `Channel name "${name}" already exists.`,
            )
          }
        }
      }
      this.logger.error(
        `Failed to create channel "${name}": ${error.message}`,
        error.stack,
        'createChannel',
      )
      throw new InternalServerErrorException('Could not create channel.')
    }
  }

  async getChannels(
    ctx: RequestContext,
    args: PaginationArgs,
  ): Promise<{ items: ChannelEntity[]; totalCount: number }> {
    const { user } = ctx
    const { skip = 0, take = 10 } = args

    this.logger.log(
      `User ${user?.id || 'System'} fetching channels with skip: ${skip}, take: ${take}`,
      'getChannels',
    )

    try {
      const channels = await this.prisma.channel.findMany({
        skip,
        take,
        orderBy: {
          createdAt: 'desc', // Default ordering
        },
      })

      const totalCount = await this.prisma.channel.count() // Add where clause if filtering is introduced

      return { items: channels as ChannelEntity[], totalCount }
    } catch (error) {
      this.logger.error(
        `Failed to fetch channels: ${error.message}`,
        error.stack,
        'getChannels',
      )
      throw new InternalServerErrorException('Could not fetch channels.')
    }
  }

  async findChannelByToken(
    ctx: RequestContext,
    token: string,
  ): Promise<ChannelEntity | null> {
    this.logger.log(`Finding channel by token: ${token}`, 'findChannelByToken')
    try {
      const channel = await this.prisma.channel.findUnique({
        where: { token },
      })
      return channel as ChannelEntity | null
    } catch (error) {
      this.logger.error(
        `Failed to find channel by token ${token}: ${error.message}`,
        error.stack,
        'findChannelByToken',
      )
      // Depending on expected behavior, you might throw or just return null
      // For a simple lookup, returning null is fine. If non-existence is an error condition, throw.
      throw new InternalServerErrorException('Error finding channel.')
    }
  }
}
