import { ObjectType, Field, ID } from '@nestjs/graphql'
import { CompanyNoteType } from '../enums/company-note-type.enum'

@ObjectType('CompanyNote')
export class CompanyNoteEntity {
  @Field(() => ID)
  id: string

  @Field()
  content: string

  @Field(() => CompanyNoteType, { nullable: true })
  type?: CompanyNoteType

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
