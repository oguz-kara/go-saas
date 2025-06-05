// src/modules/company-note/domain/exceptions/company-note-not-found.exception.ts
import { NotFoundException } from '@nestjs/common'
import { exceptionCodes } from 'src/common'

export class CompanyNoteNotFoundError extends NotFoundException {
  constructor(noteId: string) {
    super(`Company note with ID "${noteId}" not found.`)
    this.name = exceptionCodes.COMPANY_NOTE_NOT_FOUND_EXCEPTION
  }
}
