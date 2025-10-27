import { ConflictException } from '@nestjs/common'
import { exceptionCodes } from 'src/common'

export class EmailAlreadyExistsError extends ConflictException {
  constructor(email: string) {
    super(`User with email "${email}" already exists`)
    this.name = exceptionCodes.EMAIL_ALREADY_EXISTS_EXCEPTION
  }
}
