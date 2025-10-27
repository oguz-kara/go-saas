import { ObjectType, Field, Int } from '@nestjs/graphql'

@ObjectType()
export class PageInfoObject {
  @Field(() => Int)
  totalCount: number
}
