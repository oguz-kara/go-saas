// src/modules/user/api/graphql/dto/user-connection.object-type.ts
import { ObjectType, Field, Int } from '@nestjs/graphql'
import { UserEntity } from '../entities/user.entity'

@ObjectType('UserConnection')
export class UserConnectionObject {
  @Field(() => [UserEntity])
  items: UserEntity[]

  @Field(() => Int)
  totalCount: number
}
