// src/modules/attribute/api/graphql/dto/attribute-type-connection.object-type.ts
import { ObjectType, Field, Int } from '@nestjs/graphql'
import { AttributeTypeEntity } from '../entities/attribute-type.entity'

@ObjectType('AttributeTypeConnection')
export class AttributeTypeConnection {
  @Field(() => [AttributeTypeEntity])
  items: AttributeTypeEntity[]

  @Field(() => Int)
  totalCount: number
}
