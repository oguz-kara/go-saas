import { ObjectType, Field, ID, Int } from '@nestjs/graphql'

@ObjectType('AttributeGroup')
export class AttributeGroupEntity {
  @Field(() => ID)
  id: string

  @Field()
  name: string

  @Field()
  code: string

  @Field(() => Int, { nullable: true })
  order: number | null

  @Field()
  isSystemDefined: boolean
}
