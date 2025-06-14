// src/modules/channel/api/graphql/resolvers/channel.resolver.ts
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'

import { ChannelService } from 'src/modules/channel/application/services/channel.service'
import { ChannelEntity } from 'src/modules/channel/api/graphql/entities/channel.entity'
import { CreateChannelInput } from 'src/modules/channel/api/graphql/dto/create-channel.input'
import { ChannelConnectionObject as ChannelConnection } from 'src/modules/channel/api/graphql/dto/channel-connection.object-type'

import { RequestContext } from 'src/common/request-context/request-context'
import { Ctx } from 'src/common/request-context/request-context.decorator'
import { ListQueryArgs } from 'src/common'

@Resolver(() => ChannelEntity)
export class ChannelResolver {
  constructor(private readonly channelService: ChannelService) {}

  @Mutation(() => ChannelEntity, { name: 'createChannel' })
  async createChannel(
    @Ctx() ctx: RequestContext,
    @Args('createChannelInput') createChannelInput: CreateChannelInput,
  ): Promise<ChannelEntity> {
    return this.channelService.createChannel(ctx, createChannelInput)
  }

  @Query(() => ChannelConnection, { name: 'channels' })
  async getChannels(
    @Ctx() ctx: RequestContext,
    @Args() paginationArgs: ListQueryArgs,
  ): Promise<ChannelConnection> {
    return this.channelService.getChannels(ctx, paginationArgs)
  }

  @Query(() => ChannelEntity, { name: 'channelByToken', nullable: true })
  async getChannelByToken(
    @Ctx() ctx: RequestContext,
    @Args('token', { type: () => String }) token: string,
  ): Promise<ChannelEntity | null> {
    return this.channelService.findChannelByToken(ctx, token)
  }
}
