import { ObjectType, Field, Int } from '@nestjs/graphql'
import { ChannelEntity } from '../entities/channel.entity'

@ObjectType('ChannelConnection')
export class ChannelConnectionObject {
  @Field(() => [ChannelEntity])
  items: ChannelEntity[]

  @Field(() => Int)
  totalCount: number
}
