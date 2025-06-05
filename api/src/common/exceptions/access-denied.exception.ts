import { UnauthorizedException } from '@nestjs/common'
import { exceptionCodes } from 'src/common'

export class AccessDeniedException extends UnauthorizedException {
  constructor(message?: string) {
    super(message || 'Access denied')
    this.name = exceptionCodes.ACCESS_DENIED_EXCEPTION
  }
}
