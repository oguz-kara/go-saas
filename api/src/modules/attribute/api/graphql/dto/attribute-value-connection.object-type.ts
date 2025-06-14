// src/modules/attribute-value/api/graphql/dto/attribute-value-connection.object-type.ts
import { ObjectType, Field, Int } from '@nestjs/graphql'
import { AttributeValueEntity } from '../entities/attribute.entity'

@ObjectType('AttributeValueConnection')
export class AttributeValueConnection {
  @Field(() => [AttributeValueEntity])
  items: AttributeValueEntity[]

  @Field(() => Int)
  totalCount: number
}
