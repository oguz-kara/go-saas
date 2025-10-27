// src/modules/attribute-value/api/graphql/entities/attribute-value.entity.ts
import { ObjectType, Field, ID } from '@nestjs/graphql'
import { AttributeTypeEntity } from './attribute-type.entity'
import GraphQLJSON from 'graphql-type-json'

@ObjectType('AttributeValue')
export class AttributeValueEntity {
  // Primary Fields
  @Field(() => ID)
  id: string

  @Field()
  value: string

  @Field()
  code: string

  // Relations
  @Field(() => AttributeTypeEntity, { nullable: true })
  type?: AttributeTypeEntity

  @Field(() => ID)
  attributeTypeId: string

  @Field(() => ID, { nullable: true })
  parentId?: string | null

  // Metadata
  @Field(() => GraphQLJSON, { nullable: true })
  meta?: Record<string, any> | null
}
