import { UnauthorizedException } from '@nestjs/common'
import { exceptionCodes } from 'src/common'

export class MissingTokenClaimException extends UnauthorizedException {
  constructor(claimName: string) {
    super(`Required claim "${claimName}" is missing from token.`)
    this.name = exceptionCodes.MISSING_TOKEN_CLAIM_EXCEPTION
  }
}
