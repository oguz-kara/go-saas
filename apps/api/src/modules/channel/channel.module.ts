import { Module } from '@nestjs/common'
import { ChannelService } from './application/services/channel.service'
import { ChannelResolver } from './api/graphql/resolvers/channel.resolver'
import { PrismaService } from 'src/common'

@Module({
  providers: [ChannelService, ChannelResolver, PrismaService],
  exports: [ChannelService],
})
export class ChannelModule {}
