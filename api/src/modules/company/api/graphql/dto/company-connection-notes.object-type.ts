import { ObjectType, Field, Int } from '@nestjs/graphql'
import { CompanyNoteEntity } from '../entities/company-note.entity'

@ObjectType('CompanyConnectionNotes')
export class CompanyConnectionNotesObject {
  @Field(() => [CompanyNoteEntity])
  items: CompanyNoteEntity[]

  @Field(() => Int)
  totalCount: number
}
