import { applyDecorators, UseGuards } from '@nestjs/common'
import { IdentityGuard } from '../guards/identity.guard'

export function ProtectResource() {
  return applyDecorators(UseGuards(IdentityGuard))
}
