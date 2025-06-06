import { ObjectType, Field, ID } from '@nestjs/graphql'

@ObjectType('Channel')
export class ChannelEntity {
  @Field(() => ID)
  id: string

  @Field()
  name: string

  @Field()
  token: string

  @Field({ nullable: true })
  description?: string

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date
}
