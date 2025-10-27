import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType()
export class ChangePasswordOutput {
  @Field()
  success: boolean

  @Field({ nullable: true })
  message?: string
}

