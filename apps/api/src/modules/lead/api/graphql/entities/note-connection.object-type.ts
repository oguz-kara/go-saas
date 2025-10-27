import { ObjectType, Field, Int } from '@nestjs/graphql'
import { NoteEntity } from './note.entity'

@ObjectType('NoteConnection')
export class NoteConnectionObject {
  @Field(() => [NoteEntity])
  items: NoteEntity[]

  @Field(() => Int)
  totalCount: number
}
