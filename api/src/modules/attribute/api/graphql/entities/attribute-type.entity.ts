// src/modules/attribute-type/api/graphql/entities/attribute-type.entity.ts
import { ObjectType, Field, ID } from '@nestjs/graphql'

@ObjectType('AttributeType')
export class AttributeTypeEntity {
  @Field(() => ID)
  id: string

  @Field()
  name: string

  @Field()
  channelToken: string

  @Field({ nullable: true })
  createdAt: Date
}
