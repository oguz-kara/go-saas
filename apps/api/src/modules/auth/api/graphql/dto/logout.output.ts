import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType()
export class LogoutOutput {
  @Field()
  success: boolean
}
