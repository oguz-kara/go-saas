import { InputType, Field, ID } from '@nestjs/graphql'

@InputType()
export class AttributeFilterInput {
  @Field(() => ID)
  attributeTypeId: string

  @Field(() => [ID])
  valueIds: string[]
}
