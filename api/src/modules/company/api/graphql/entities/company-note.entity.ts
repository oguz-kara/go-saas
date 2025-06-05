import { ObjectType, Field, ID } from '@nestjs/graphql'

@ObjectType('CompanyNote')
export class CompanyNoteEntity {
  @Field(() => ID)
  id: string

  @Field()
  content: string

  @Field({ nullable: true })
  type?: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field(() => ID)
  companyId: string

  @Field(() => ID)
  userId: string

  @Field(() => ID)
  channelToken: string
}
