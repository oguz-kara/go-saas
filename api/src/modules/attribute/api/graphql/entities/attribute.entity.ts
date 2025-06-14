// src/modules/attribute-value/api/graphql/entities/attribute-value.entity.ts
import { ObjectType, Field, ID } from '@nestjs/graphql'
import { AttributeTypeEntity } from './attribute-type.entity'

@ObjectType('AttributeValue')
export class AttributeValueEntity {
  @Field(() => ID)
  id: string

  @Field()
  value: string

  @Field(() => AttributeTypeEntity, { nullable: true })
  type?: AttributeTypeEntity

  @Field(() => ID)
  attributeTypeId: string
}
