import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcryptjs'

import { PrismaService } from 'src/common/services/prisma/prisma.service'

import { RegisterUserInput } from 'src/modules/auth/api/graphql/dto/register-user.input'
import { LoginUserInput } from 'src/modules/auth/api/graphql/dto/login-user.input'
import { AuthenticationPayloadObject } from 'src/modules/auth/api/graphql/dto/authetication-payload.object-type'

import { InvalidCredentialsError } from 'src/modules/auth/domain/exceptions/invalid-credentials.exception'
import { RequestContext } from 'src/common/request-context/request-context'
import { UserEntity } from '../../api/graphql/entities/user.entity'
import { LogoutOutput } from '../../api/graphql/dto/logout.output'
import { MissingTokenClaimException } from '../../domain/exceptions/missing-token-claim.exception'
import { CacheService } from 'src/common/services/cache/cache.service'
import { RegisterNewTenantInput } from '../../api/graphql/dto/register-new-tenant.input'
import { ChannelService } from 'src/modules/channel/application/services/channel.service'
import {
  EntityNotFoundException,
  UniqueConstraintViolationException,
} from 'src/common/exceptions'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly cacheService: CacheService,
    private readonly channelService: ChannelService,
  ) {}

  async registerNewTenant(
    ctx: RequestContext,
    registerNewTenantInput: RegisterNewTenantInput,
    channelToken?: string,
  ): Promise<AuthenticationPayloadObject> {
    const { email, password, userName, tenantName, tenantDescription } =
      registerNewTenantInput

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new UniqueConstraintViolationException('email')
    }

    return this.prisma.$transaction(async (tx) => {
      const newChannel = await this.channelService.createChannel(
        ctx,
        {
          name: tenantName,
          description: tenantDescription,
          token: channelToken,
        },
        { tx },
      )

      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(password, saltRounds)

      const newUser = await tx.user.create({
        data: {
          email,
          name: userName,
          password: hashedPassword,
          channelToken: newChannel.token,
        },
      })

      const jwtPayload = {
        sub: newUser.id,
        email: newUser.email,
        name: newUser.name,
        jti: newUser.id,
        channelToken: newChannel.token,
      }

      const token = await this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('JWT_SECRET') || 'test-secret',
        expiresIn:
          this.configService.get<string>('JWT_EXPIRATION_TIME') || '1h',
      })

      const userObject: UserEntity = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name || undefined,
      }

      return {
        token,
        user: userObject,
      }
    })
  }

  async registerUser(
    ctx: RequestContext,
    registerUserInput: RegisterUserInput,
    channelToken: string,
  ): Promise<AuthenticationPayloadObject> {
    const { email, password, name } = registerUserInput

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new UniqueConstraintViolationException('email')
    }

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const newUser = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        channelToken,
      },
    })

    const jwtPayload = {
      sub: newUser.id,
      email: newUser.email,
      name: newUser.name,
      jti: newUser.id,
      channelToken: newUser.channelToken,
    }

    const token = await this.jwtService.signAsync(jwtPayload, {
      secret: this.configService.get<string>('JWT_SECRET') || 'test-secret',
      expiresIn: this.configService.get<string>('JWT_EXPIRATION_TIME') || '1h',
    })

    const userObject: UserEntity = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name || undefined,
    }

    return {
      token,
      user: userObject,
    }
  }
  async login(
    ctx: RequestContext,
    loginUserInput: LoginUserInput,
  ): Promise<AuthenticationPayloadObject> {
    const { email, password } = loginUserInput

    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user) throw new EntityNotFoundException('User', email)

    const isPasswordMatching = await bcrypt.compare(password, user.password)

    if (!isPasswordMatching) {
      throw new InvalidCredentialsError()
    }

    const jwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      jti: user.id,
      channelToken: user.channelToken,
    }
    const token = await this.jwtService.signAsync(jwtPayload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRATION_TIME') || '1h',
    })

    const userObject: UserEntity = {
      id: user.id,
      email: user.email,
      name: user.name || undefined,
    }

    return {
      token,
      user: userObject,
    }
  }

  async logout(ctx: RequestContext): Promise<LogoutOutput> {
    const { jwtPayload } = ctx

    if (!jwtPayload || !jwtPayload.jti || !jwtPayload.exp) {
      this.logger.warn(
        `Logout attempt with missing JTI or EXP in token payload.`,
      )

      return { success: false }
    }

    const jti = jwtPayload.jti
    const exp = jwtPayload.exp

    const currentTimeSeconds = Math.floor(Date.now() / 1000)
    let ttl = exp - currentTimeSeconds

    if (ttl <= 0) {
      ttl = 1
      this.logger.log(
        `Token with JTI ${jti} is already expired or near expiry. Setting minimal TTL for denylist.`,
      )
    }

    const denylistKey = `denylist:jti:${jti}`
    const denylistValue = 'true'

    try {
      await this.cacheService.set(denylistKey, denylistValue, ttl)
      this.logger.log(
        `Token with JTI ${jti} successfully denylisted for ${ttl} seconds.`,
      )
      return { success: true }
    } catch (error) {
      this.logger.error(
        `Failed to denylist token with JTI ${jti}. Error: ${error.message}.`,
        error.stack,
      )
      return { success: true }
    }
  }

  async me(ctx: RequestContext): Promise<UserEntity | null> {
    const { jwtPayload } = ctx

    if (!jwtPayload) {
      this.logger.warn(`Attempt to access 'me' endpoint without JWT payload. `)
      throw new UnauthorizedException(
        'Authentication token not found or invalid.',
      )
    }

    const userId = jwtPayload.sub // 'sub' typically holds the user ID

    if (!userId) {
      this.logger.warn(`User ID (sub) missing from JWT payload. `)
      throw new MissingTokenClaimException('sub')
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      this.logger.warn(`User not found for ID: ${userId} from token.`)
      throw new EntityNotFoundException('User', userId)
    }

    const userObject: UserEntity = {
      id: user.id,
      email: user.email,
      name: user.name || undefined,
    }

    return userObject
  }
}
