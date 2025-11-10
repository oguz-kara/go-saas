// src/modules/auth/guards/identity.guard.ts
import { Injectable, ExecutionContext, Logger } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AccessDeniedException } from '../exceptions/access-denied.exception'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'

@Injectable()
export class IdentityGuard extends AuthGuard(['jwt', 'api-key']) {
  private readonly logger = new Logger(IdentityGuard.name)

  constructor(private reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext) {
    // Check if the route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    return super.canActivate(context)
  }

  getRequest(context: ExecutionContext) {
    const gqlCtx = GqlExecutionContext.create(context)
    return gqlCtx.getContext().req
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      this.logger.warn(
        `IdentityGuard: Authentication failed. Info: ${info?.message || info || 'No user object'}. Error: ${err?.message || err}`,
      )
      throw err || new AccessDeniedException()
    }
    return user
  }
}
