import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { RequestContext } from './request-context'
import { JwtPayload } from 'src/modules/auth/strategies/jwt.strategy'

interface GraphQLContext {
  requestContext: RequestContext
  req: Request & {
    user: Omit<JwtPayload, 'sub'> & { id: string; channelToken: string }
  }
}

export const Ctx = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const gqlContext = GqlExecutionContext.create(context)
    const ctx = gqlContext.getContext<GraphQLContext>()
    const req = ctx.req
    const user = req.user
    let jwtPayload: JwtPayload | undefined = undefined

    if (user)
      jwtPayload = {
        sub: user.id,
        email: user.email,
        name: user.name,
        jti: user.jti,
        exp: user.exp,
      }

    return RequestContext.createInstance({
      jwtPayload,
      channel: {
        token: user?.channelToken || undefined,
      },
      user: {
        id: user?.id,
        email: user?.email,
        name: user?.name,
      },
    })
  },
)
