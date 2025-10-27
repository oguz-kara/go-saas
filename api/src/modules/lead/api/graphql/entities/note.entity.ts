import { ObjectType, Field, ID } from '@nestjs/graphql'

@ObjectType('LeadNote')
export class NoteEntity {
  @Field(() => ID)
  id: string

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date

  @Field(() => String)
  content: string

  @Field(() => String)
  leadId: string

  @Field(() => String)
  userId: string
}
