import { AsyncLocalStorage } from 'async_hooks'

export interface CtxChannel {
  token?: string
}

export interface CtxUser {
  id: string
  name: string
  email: string
}

export interface CtxJWTPayload {
  sub?: string
  email?: string
  jti?: string
  exp?: number
  channelToken?: string
}

export interface RequestContextProps {
  channel: CtxChannel
  user?: CtxUser
  jwtPayload?: CtxJWTPayload
}

export class RequestContext {
  private static asyncLocalStorage = new AsyncLocalStorage<RequestContext>()

  private _channel: CtxChannel
  private readonly _user?: CtxUser
  private readonly _jwtPayload?: CtxJWTPayload

  constructor(props: RequestContextProps) {
    this._channel = props.channel
    this._user = props.user
    this._jwtPayload = props.jwtPayload
  }

  static createInstance(props: RequestContextProps): RequestContext {
    return new RequestContext(props)
  }

  static getCurrentContext(): RequestContext {
    const context = RequestContext.asyncLocalStorage.getStore()
    if (!context) {
      throw new Error('Request context is not set')
    }
    return context
  }

  static setCurrentContext(context: RequestContext): void {
    RequestContext.asyncLocalStorage.enterWith(context)
  }

  get channel(): CtxChannel {
    return this._channel
  }

  get user(): CtxUser | undefined {
    return this._user
  }

  get jwtPayload(): CtxJWTPayload | undefined {
    return this._jwtPayload
  }
}
