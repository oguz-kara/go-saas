import { ObjectType, Field, ID } from '@nestjs/graphql'

@ObjectType('User')
export class UserEntity {
  @Field(() => ID)
  id: string

  @Field()
  email: string

  @Field({ nullable: true })
  name?: string

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field(() => Date, { nullable: true })
  createdAt?: Date
}
