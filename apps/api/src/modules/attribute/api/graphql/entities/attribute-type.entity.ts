// src/modules/attribute-type/api/graphql/entities/attribute-type.entity.ts
import { ObjectType, Field, ID, Int } from '@nestjs/graphql'
import { AttributableType } from '../enums/attributable-type.enum'
import { AttributeDataType } from '../enums/attribute-data-type.enum'
import { AttributeTypeKind } from '../enums/attribute-type-kind.enum'
import { AttributeGroupEntity } from './attribute-group.entity'

@ObjectType('AttributeType')
export class AttributeTypeEntity {
  // Primary Fields
  @Field(() => ID)
  id: string

  @Field()
  name: string

  @Field()
  code: string

  @Field(() => Int)
  order: number

  @Field()
  channelToken: string

  @Field(() => String, { nullable: true })
  groupId?: string | null

  // Type Configuration
  @Field(() => AttributeTypeKind)
  kind: AttributeTypeKind

  @Field(() => AttributeDataType)
  dataType: AttributeDataType

  @Field(() => Boolean)
  isSystemDefined: boolean

  // Relations
  @Field(() => AttributeGroupEntity, { nullable: true })
  group?: AttributeGroupEntity | null

  @Field(() => [AttributableType])
  availableFor: AttributableType[]

  // Timestamps
  @Field({ nullable: true })
  createdAt: Date

  @Field({ nullable: true })
  updatedAt: Date
}
