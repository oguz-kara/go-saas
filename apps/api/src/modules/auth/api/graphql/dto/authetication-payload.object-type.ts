import { ObjectType, Field } from '@nestjs/graphql'
import { UserEntity } from '../entities/user.entity'

@ObjectType('AuthenticationPayload')
export class AuthenticationPayloadObject {
  @Field()
  token: string

  @Field(() => UserEntity)
  user: UserEntity
}
