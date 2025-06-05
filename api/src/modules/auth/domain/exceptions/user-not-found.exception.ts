// src/modules/user/exceptions/user-not-found.exception.ts
import { NotFoundException } from '@nestjs/common'
import { exceptionCodes } from 'src/common'

export class UserNotFoundError extends NotFoundException {
  constructor(identifier?: string) {
    super(
      identifier
        ? `User with identifier "${identifier}" not found.`
        : 'User not found.',
    )
    this.name = exceptionCodes.USER_NOT_FOUND_EXCEPTION
  }
}
