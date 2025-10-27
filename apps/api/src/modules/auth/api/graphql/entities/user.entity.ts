import { ObjectType, Field, ID } from '@nestjs/graphql'

@ObjectType('User')
export class UserEntity {
  @Field(() => ID)
  id: string

  @Field()
  email: string

  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field(() => Date, { nullable: true })
  createdAt?: Date
}
