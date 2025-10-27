import { registerEnumType } from '@nestjs/graphql'

export enum CompanyNoteType {
  GENERAL = 'GENERAL',
  MEETING = 'MEETING',
  CALL = 'CALL',
  FOLLOW_UP = 'FOLLOW_UP',
}

registerEnumType(CompanyNoteType, {
  name: 'CompanyNoteType',
})
