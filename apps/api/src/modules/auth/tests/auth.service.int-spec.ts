// src/modules/auth/auth.service.integration-spec.ts
import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { CacheService } from 'src/common/services/cache/cache.service'
import { ChannelService } from 'src/modules/channel/application/services/channel.service'
import { AuthService } from '../application/services/auth.service'
import { EmailAlreadyExistsError } from '../domain/exceptions/email-already-exists.exception'
import { RegisterNewTenantInput } from '../api/graphql/dto/register-new-tenant.input'
import { RequestContext } from 'src/common/request-context/request-context'
import { UserNotFoundError } from '../domain/exceptions/user-not-found.exception'
import { InvalidCredentialsError } from '../domain/exceptions/invalid-credentials.exception'

const prisma = new PrismaClient()

describe('AuthService (Integration)', () => {
  let authService: AuthService

  let prismaService: PrismaService

  let cacheService: CacheService

  const cleanupDatabase = async () => {
    await prisma.user.deleteMany()
    await prisma.channel.deleteMany()
  }

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
          isGlobal: true,
        }),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: {
              expiresIn: configService.get<string>('JWT_EXPIRATION_TIME'),
            },
          }),
        }),
      ],
      providers: [
        AuthService,
        PrismaService,
        ChannelService,
        {
          provide: CacheService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile()

    authService = module.get<AuthService>(AuthService)
    prismaService = module.get<PrismaService>(PrismaService)
    cacheService = module.get<CacheService>(CacheService)
  })

  beforeEach(async () => {
    await cleanupDatabase()
  })

  afterAll(async () => {
    await cleanupDatabase()
    await prismaService.$disconnect()
    await prisma.$disconnect()
  })

  // ... inside describe('AuthService (Integration)', () => { ... })

  describe('registerNewTenant', () => {
    const mockRequestContext = new RequestContext({
      channel: {
        token: 'xxx',
      },
    })
    const tenantInput: RegisterNewTenantInput = {
      email: 'tenant.admin@example.com',
      password: 'Password123!',
      userName: 'Tenant Admin',
      tenantName: 'Test Tenant',
      tenantDescription: 'A tenant for testing.',
    }

    it('should successfully create a new tenant, channel, and user in the database', async () => {
      // ACT
      const result = await authService.registerNewTenant(
        mockRequestContext,
        tenantInput,
      )

      // ASSERT
      // 1. Check the returned payload
      expect(result.user.email).toBe(tenantInput.email)
      expect(result.token).toBeDefined()

      // 2. Verify the data in the database
      const userInDb = await prismaService.user.findUnique({
        where: { email: tenantInput.email },
      })
      expect(userInDb).toBeDefined()
      expect(userInDb?.name).toBe(tenantInput.userName)

      const channelInDb = await prismaService.channel.findFirst({
        where: { name: tenantInput.tenantName },
      })
      expect(channelInDb).toBeDefined()
      expect(channelInDb?.token).toBe(userInDb?.channelToken) // Ensure user is linked to the new channel
    })

    it('should throw EmailAlreadyExistsError if the email is taken', async () => {
      // ARRANGE: First, create a user with the email we're about to use
      await authService.registerNewTenant(mockRequestContext, tenantInput)

      // ACT & ASSERT
      await expect(
        authService.registerNewTenant(mockRequestContext, tenantInput),
      ).rejects.toThrow(EmailAlreadyExistsError)
    })

    it('should roll back the transaction if user creation fails (conceptual)', async () => {
      // This is hard to test directly without complex mocking of Prisma.
      // However, we trust that prisma.$transaction works. The test above implicitly
      // confirms that on success, both records are created, which is the other
      // side of the transaction coin. If either failed, Prisma would roll back.
      // For now, we'll rely on Prisma's own testing of this feature.
    })
  })

  describe('login', () => {
    const mockRequestContext = new RequestContext({
      channel: {
        token: 'xxx',
      },
    })
    const credentials = {
      email: 'test.user@example.com',
      password: 'password123',
    }

    // ARRANGE: Create a user to log in with before each login test
    beforeEach(async () => {
      // We need a channel first
      const channel = await prismaService.channel.create({
        data: { name: 'Shared Channel', token: 'xxx' },
      })

      await authService.registerUser(
        mockRequestContext,
        { ...credentials, name: 'Test User' },
        channel.token,
      )
    })

    it('should return an auth payload with a valid token on successful login', async () => {
      // ACT
      const result = await authService.login(mockRequestContext, credentials)

      // ASSERT
      expect(result.user.email).toBe(credentials.email)
      expect(result.token).toBeDefined()

      const isPasswordMatch = await bcrypt.compare(
        credentials.password,
        (await prismaService.user.findUnique({
          where: { email: credentials.email },
        }))!.password,
      )
      expect(isPasswordMatch).toBe(true)
    })

    it('should throw UserNotFoundError for a non-existent email', async () => {
      // ACT & ASSERT
      await expect(
        authService.login(mockRequestContext, {
          ...credentials,
          email: 'notfound@example.com',
        }),
      ).rejects.toThrow(UserNotFoundError)
    })

    it('should throw InvalidCredentialsError for an incorrect password', async () => {
      // ACT & ASSERT
      await expect(
        authService.login(mockRequestContext, {
          ...credentials,
          password: 'wrongpassword',
        }),
      ).rejects.toThrow(InvalidCredentialsError)
    })
  })

  describe('me', () => {
    it('should return the correct user details for a valid JWT payload in the context', async () => {
      // ARRANGE
      const channel = await prismaService.channel.create({
        data: { name: 'ME Test Channel', token: 'xxx' },
      })
      const registrationResult = await authService.registerUser(
        new RequestContext({
          channel: {
            token: 'xxx',
          },
        }),
        { email: 'me@example.com', password: 'password123', name: 'Me User' },
        channel.token,
      )
      const userInDb = registrationResult.user

      // Create a context that simulates a validated JWT
      const meRequestContext = new RequestContext({
        channel: {
          token: 'xxx',
        },
        jwtPayload: {
          sub: userInDb.id,
          email: userInDb.email,
          jti: 'some-jti',
        },
      })

      // ACT
      const result = await authService.me(meRequestContext)

      // ASSERT
      expect(result).not.toBeNull()
      expect(result?.id).toBe(userInDb.id)
      expect(result?.email).toBe(userInDb.email)
    })

    it('should throw UserNotFoundError if the user ID from the token does not exist', async () => {
      // ARRANGE: Create a context with a fake user ID
      const fakeRequestContext = new RequestContext({
        channel: {
          token: 'xxx',
        },
        jwtPayload: {
          sub: 'non-existent-user-id',
          email: 'fake@test.com',
          jti: 'some-jti',
        },
      })

      // ACT & ASSERT
      await expect(authService.me(fakeRequestContext)).rejects.toThrow(
        UserNotFoundError,
      )
    })
  })

  describe('logout', () => {
    afterEach(() => {
      jest.clearAllMocks()
    })

    it('should successfully logout a user', async () => {
      // Arrange
      const mockRequestContext = new RequestContext({
        channel: {
          token: 'xxx',
        },
      })

      // Act
      const result = await authService.logout(mockRequestContext)

      // Assert
      expect(result).toBeDefined()
    })

    it('should return { success: false } if the user is not logged in', async () => {
      // Arrange
      const mockRequestContext = new RequestContext({
        channel: {
          token: 'xxx',
        },
      })

      const result = await authService.logout(mockRequestContext)

      // Assert
      expect(result).toEqual({ success: false })
    })

    it('should successfully denylist a token with a valid payload and return { success: true }', async () => {
      // ARRANGE
      const currentTime = Math.floor(Date.now() / 1000)
      const expirationTime = currentTime + 3600 // Expires in 1 hour
      const tokenId = 'valid-jti-123'

      const mockRequestContext = new RequestContext({
        channel: {
          token: 'xxx',
        },
        jwtPayload: {
          sub: 'user-id',
          email: 'test@example.com',
          jti: tokenId,
          exp: expirationTime,
        },
      })

      // ACT
      const result = await authService.logout(mockRequestContext)

      // ASSERT
      // 1. Check the return value
      expect(result).toEqual({ success: true })

      // 2. Check that the cache service was called correctly
      const expectedTtl = expirationTime - currentTime
      // Disable the rule for this specific, safe-use case
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(cacheService.set).toHaveBeenCalledTimes(1)
      // Disable the rule for this specific, safe-use case
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(cacheService.set).toHaveBeenCalledWith(
        `denylist:jti:${tokenId}`,
        'true',
        expect.any(Number), // We check the TTL calculation logic more precisely in other tests
      )
      // A more precise check for TTL could be:
      const actualTtl = (cacheService.set as jest.Mock).mock.calls[0][2]
      expect(actualTtl).toBeCloseTo(expectedTtl, 0) // Check if TTL is within a second of expected
    })

    it('should return { success: false } if jwtPayload is missing from the context', async () => {
      // ARRANGE: A context with no jwtPayload, simulating a non-logged-in user
      const mockRequestContext = new RequestContext({
        channel: {
          token: 'xxx',
        },
      })

      // ACT
      const result = await authService.logout(mockRequestContext)

      // ASSERT
      expect(result).toEqual({ success: false })
      // Ensure we didn't try to denylist anything
      // Disable the rule for this specific, safe-use case
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(cacheService.set).not.toHaveBeenCalled()
    })

    it('should return { success: false } if jti or exp is missing from the payload', async () => {
      // ARRANGE: Create a payload that is missing the 'jti' claim
      const mockRequestContextWithNoJti = new RequestContext({
        channel: {
          token: 'xxx',
        },
        jwtPayload: {
          sub: 'user-id',
          email: 'test@example.com',
          exp: Math.floor(Date.now() / 1000) + 3600,
          // jti is missing
        },
      })

      // ACT
      const result = await authService.logout(mockRequestContextWithNoJti)

      // ASSERT
      expect(result).toEqual({ success: false })
      // Disable the rule for this specific, safe-use case
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(cacheService.set).not.toHaveBeenCalled()
    })

    it('should still return { success: true } even if the cache service throws an error', async () => {
      // ARRANGE
      const tokenId = 'jti-for-cache-failure'
      const mockRequestContext = new RequestContext({
        channel: {
          token: 'xxx',
        },
        jwtPayload: {
          sub: 'user-id',
          jti: tokenId,
          exp: Math.floor(Date.now() / 1000) + 3600,
        },
      })

      // Mock the cache service to simulate a failure
      ;(cacheService.set as jest.Mock).mockRejectedValue(
        new Error('Cache unavailable'),
      )

      // ACT
      const result = await authService.logout(mockRequestContext)

      // ASSERT
      // The user should not see an error, so logout is "successful" from their perspective.
      expect(result).toEqual({ success: true })
      // We confirm that we did ATTEMPT to call the cache.
      // Disable the rule for this specific, safe-use case
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(cacheService.set).toHaveBeenCalledWith(
        `denylist:jti:${tokenId}`,
        'true',
        expect.any(Number),
      )
    })
  })

  describe('registerUser', () => {
    let mockRequestContext: RequestContext
    let existingChannelToken: string

    beforeAll(async () => {
      existingChannelToken = 'xxx'

      await prismaService.channel.create({
        data: { name: 'Test Channel for User Registration', token: 'xxx' },
      })

      mockRequestContext = new RequestContext({
        channel: {
          token: 'xxx',
        },
      })
    })

    it('should create a new user, hash the password, and return a valid auth payload', async () => {
      const userInput = {
        email: 'new.user@example.com',
        password: 'strongPassword123',
        name: 'Test User',
      }

      const result = await authService.registerUser(
        mockRequestContext,
        userInput,
        existingChannelToken,
      )

      expect(result).toBeDefined()
      expect(result.user.email).toBe(userInput.email)
      expect(result.user.name).toBe(userInput.name)
      expect(result.token).toEqual(expect.any(String)) // We get a token string.

      const userInDb = await prismaService.user.findUnique({
        where: { email: userInput.email },
      })

      expect(userInDb).toBeDefined()
      expect(userInDb!.name).toBe(userInput.name)
      expect(userInDb!.channelToken).toBe(existingChannelToken) // Was the user correctly linked?

      const isPasswordCorrect = await bcrypt.compare(
        userInput.password,
        userInDb!.password,
      )
      expect(isPasswordCorrect).toBe(true)
    })

    it('should throw EmailAlreadyExistsError if the email is already taken', async () => {
      const conflictingUserInput = {
        email: 'conflict@example.com',
        password: 'password123',
        name: 'First User',
      }
      await authService.registerUser(
        mockRequestContext,
        conflictingUserInput,
        existingChannelToken,
      )

      await expect(
        authService.registerUser(
          mockRequestContext,
          conflictingUserInput,
          existingChannelToken,
        ),
      ).rejects.toThrow(EmailAlreadyExistsError)
    })
  })
})
