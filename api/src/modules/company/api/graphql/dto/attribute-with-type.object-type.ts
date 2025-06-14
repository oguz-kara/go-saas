import { ObjectType } from '@nestjs/graphql'
import { ID } from '@nestjs/graphql'
import { Field } from '@nestjs/graphql'

@ObjectType('AttributeWithType')
export class AttributeWithTypeEntity {
  @Field(() => ID)
  id: string

  @Field(() => String)
  name: string

  @Field(() => String)
  value: string
}
