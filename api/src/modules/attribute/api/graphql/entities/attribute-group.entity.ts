import { ObjectType, Field, ID } from '@nestjs/graphql'

@ObjectType('AttributeGroup')
export class AttributeGroupEntity {
  @Field(() => ID)
  id: string

  @Field()
  name: string

  @Field()
  isSystemDefined: boolean
}
