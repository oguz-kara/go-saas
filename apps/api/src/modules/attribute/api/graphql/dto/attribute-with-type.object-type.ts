// src/modules/attribute-value/api/graphql/entities/attribute-value.entity.ts
import { ObjectType, Field, ID } from '@nestjs/graphql'

@ObjectType('AttributeWithType')
export class AttributeWithTypeEntity {
  @Field(() => ID)
  id: string

  @Field(() => ID)
  attributeTypeId: string

  @Field(() => String)
  name: string

  @Field(() => String)
  value: string
}
