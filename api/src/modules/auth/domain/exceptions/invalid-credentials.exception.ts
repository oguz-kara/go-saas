// src/modules/auth/exceptions/invalid-credentials.exception.ts
import { UnauthorizedException } from '@nestjs/common'
import { exceptionCodes } from 'src/common'

export class InvalidCredentialsError extends UnauthorizedException {
  constructor(message: string = 'Invalid email or password.') {
    super(message)
    this.name = exceptionCodes.INVALID_CREDENTIALS_EXCEPTION
  }
}
