// src/modules/attribute/api/graphql/dto/attribute-type-connection.object-type.ts
import { ObjectType, Field, Int } from '@nestjs/graphql'
import { AttributeGroupEntity } from '../entities/attribute-group.entity'

@ObjectType('AttributeGroupConnection')
export class AttributeGroupConnection {
  @Field(() => [AttributeGroupEntity])
  items: AttributeGroupEntity[]

  @Field(() => Int)
  totalCount: number
}
