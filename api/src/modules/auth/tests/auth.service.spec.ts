import { Test, TestingModule } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { ConfigService } from '@nestjs/config'
import { AuthService } from '../application/services/auth.service'
import { PrismaService } from 'src/common'
import { RegisterUserInput } from '../api/graphql/dto/register-user.input'

import { User } from '@prisma/client'
import { EmailAlreadyExistsError } from '../domain/exceptions/email-already-exists.exception'
import {
  CtxUser,
  RequestContext,
} from 'src/common/request-context/request-context'
import { LoginUserInput } from '../api/graphql/dto/login-user.input'
import { UserEntity } from '../api/graphql/entities/user.entity'
import { UserNotFoundError } from '../domain/exceptions/user-not-found.exception'
import { InvalidCredentialsError } from '../domain/exceptions/invalid-credentials.exception'
import { LogoutOutput } from '../api/graphql/dto/logout.output'
import { CacheService } from 'src/common/services/cache/cache.service'

import { MissingTokenClaimException } from 'src/modules/auth/domain/exceptions/missing-token-claim.exception'
import { UnauthorizedException } from '@nestjs/common'
import { DeepMocked } from 'src/common/test/types/deep-mocked.type'
import { ChannelService } from 'src/modules/channel/application/services/channel.service'
import { RegisterNewTenantInput } from '../api/graphql/dto/register-new-tenant.input'

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}))

describe('AuthService', () => {
  let authService: AuthService
  let prismaService: DeepMocked<PrismaService>
  let jwtService: DeepMocked<JwtService>
  let channelService: DeepMocked<ChannelService>

  const mockAdminUser: CtxUser = {
    id: 'xxx',
    email: 'admin@example.com',
    name: 'admin user',
  }

  const mockRequestContext = new RequestContext({
    user: mockAdminUser,
    channel: {
      token: 'mock_channel_token',
    },
  })

  const mockCacheService = {
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
  }

  const mockChannelService = {
    createChannel: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          } as DeepMocked<PrismaService>,
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'JWT_SECRET') return 'test-secret'
              if (key === 'JWT_EXPIRATION_TIME') return '3600s'
              return null
            }),
          },
        },
        {
          provide: CacheService,
          useValue: mockCacheService,
        },
        {
          provide: ChannelService,
          useValue: mockChannelService,
        },
      ],
    }).compile()

    authService = module.get<AuthService>(AuthService)
    prismaService = module.get(PrismaService)
    jwtService = module.get(JwtService)
    channelService = module.get(ChannelService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('registerUser', () => {
    const mockRegisterInput: RegisterUserInput = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    }
    const mockHashedPassword = 'hashedPassword123'
    const mockToken = 'mock.jwt.token'
    const mockChannelToken = 'test-channel-token'

    const mockCreatedUser: User = {
      id: 'user-id-123',
      email: mockRegisterInput.email,
      name: mockRegisterInput.name,
      password: mockHashedPassword,
      channelToken: mockChannelToken,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    it('should successfully create a new user, hash password, and return AuthenticationPayload when email is unique', async () => {
      prismaService.user.findUnique.mockResolvedValue(null)
      ;(bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword)
      prismaService.user.create.mockResolvedValue(mockCreatedUser)
      jwtService.signAsync.mockResolvedValue(mockToken)

      const result = await authService.registerUser(
        mockRequestContext,
        mockRegisterInput,
        mockChannelToken,
      )

      const expectedJwtPayload = {
        sub: mockCreatedUser.id,
        email: mockCreatedUser.email,
        name: mockCreatedUser.name,
        jti: mockCreatedUser.id,
        channelToken: mockCreatedUser.channelToken,
      }
      const expectedJwtOptions = {
        secret: 'test-secret',
        expiresIn: '3600s',
      }

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockRegisterInput.email },
      })
      expect(bcrypt.hash).toHaveBeenCalledWith(mockRegisterInput.password, 10)
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: mockRegisterInput.email,
          name: mockRegisterInput.name,
          password: mockHashedPassword,
          channelToken: mockChannelToken,
        },
      })
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        expectedJwtPayload,
        expectedJwtOptions,
      )
      expect(result).toEqual({
        token: mockToken,
        user: {
          id: mockCreatedUser.id,
          email: mockCreatedUser.email,
          name: mockCreatedUser.name,
        },
      })
    })

    it('should throw EmailAlreadyExistsError if the email is already registered', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockCreatedUser)

      await expect(
        authService.registerUser(
          mockRequestContext,
          mockRegisterInput,
          mockChannelToken,
        ),
      ).rejects.toThrow(new EmailAlreadyExistsError(mockRegisterInput.email))

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockRegisterInput.email },
      })
      expect(bcrypt.hash).not.toHaveBeenCalled()
      expect(prismaService.user.create).not.toHaveBeenCalled()
      expect(jwtService.signAsync).not.toHaveBeenCalled()
    })
  })

  describe('login', () => {
    const mockLoginInput: LoginUserInput = {
      email: 'test@example.com',
      password: 'password123',
    }

    const mockStoredHashedPassword = 'hashedPasswordFromDB'
    const mockToken = 'mock.jwt.token.for.login'
    const mockChannelToken = 'login-channel-token'

    const mockExistingUser: User = {
      id: 'user-id-123',
      email: mockLoginInput.email,
      name: 'Test User LoggedIn',
      password: mockStoredHashedPassword,
      channelToken: mockChannelToken,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const mockUserObject: UserEntity = {
      id: mockExistingUser.id,
      email: mockExistingUser.email,
      name: mockExistingUser.name || undefined,
    }

    it('should successfully log in a user and return AuthenticationPayload when email exists and password matches', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockExistingUser)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(true) // Passwords match
      jwtService.signAsync.mockResolvedValue(mockToken)

      const result = await authService.login(mockRequestContext, mockLoginInput)

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockLoginInput.email },
      })
      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockLoginInput.password,
        mockStoredHashedPassword,
      )
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        {
          sub: mockExistingUser.id,
          email: mockExistingUser.email,
          name: mockExistingUser.name,
          jti: mockExistingUser.id,
          channelToken: mockExistingUser.channelToken,
        },
        { secret: 'test-secret', expiresIn: '3600s' }, // Assuming these are from ConfigService mock
      )
      expect(result).toEqual({
        token: mockToken,
        user: mockUserObject,
      })
    })

    it('should throw UserNotFoundError if the user with the given email does not exist', async () => {
      prismaService.user.findUnique.mockResolvedValue(null) // User not found

      await expect(
        authService.login(mockRequestContext, mockLoginInput),
      ).rejects.toThrow(new UserNotFoundError(mockLoginInput.email))

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockLoginInput.email },
      })
      expect(bcrypt.compare).not.toHaveBeenCalled()
      expect(jwtService.signAsync).not.toHaveBeenCalled()
    })

    it('should throw InvalidCredentialsError if email exists but password does not match', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockExistingUser)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

      await expect(
        authService.login(mockRequestContext, mockLoginInput),
      ).rejects.toThrow(new InvalidCredentialsError())

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockLoginInput.email },
      })
      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockLoginInput.password,
        mockStoredHashedPassword,
      )
      expect(jwtService.signAsync).not.toHaveBeenCalled()
    })
  })

  describe('logout', () => {
    let originalDateNow: () => number

    beforeEach(() => {
      // Mock Date.now() for consistent TTL calculations
      originalDateNow = Date.now
      const now = new Date('2025-06-04T00:00:00.000Z').getTime() // Wednesday, June 4, 2025 00:00:00 GMT
      Date.now = jest.fn(() => now)

      // Reset Redis mock calls
      mockCacheService.set.mockReset()

      // Assign the mockCacheService to the authService instance
      // This is a direct way to mock if cacheService is a public property or can be spied on.
      // If it's a private injected dependency, the module mocking approach is better.
      // For now, we'll assume 'this.cacheService.set' is called in the actual implementation.
      ;(authService as any).cacheService = mockCacheService // Or use jest.spyOn if it's a real injected service
    })

    afterEach(() => {
      Date.now = originalDateNow // Restore original Date.now
    })

    it('should successfully add the token JTI to denylist with correct TTL and return { success: true }', async () => {
      const jti = 'jwt-id-123'
      const futureExpTimeSeconds = Math.floor(Date.now() / 1000) + 3600
      const mockRequestContext = new RequestContext({
        user: mockAdminUser,
        channel: {
          token: 'mock_channel_token',
        },
        jwtPayload: { jti, exp: futureExpTimeSeconds },
      })

      mockCacheService.set.mockResolvedValue('OK' as never)

      const result: LogoutOutput = await authService.logout(mockRequestContext)

      const expectedTtl = futureExpTimeSeconds - Math.floor(Date.now() / 1000)
      expect(mockCacheService.set).toHaveBeenCalledWith(
        `denylist:jti:${jti}`, // Key for the denylisted JTI
        'true', // Value to store (could be anything, 'true' is simple)
        expectedTtl, // TTL in seconds
      )
      expect(result).toEqual({ success: true })
    })

    it('should return { success: false } if JTI is missing in token context', async () => {
      const futureExpTimeSeconds = Math.floor(Date.now() / 1000) + 3600

      const mockRequestContext = new RequestContext({
        user: mockAdminUser,
        channel: {
          token: 'mock_channel_token',
        },
        jwtPayload: { exp: futureExpTimeSeconds } as any,
      })

      const result: LogoutOutput = await authService.logout(mockRequestContext)

      expect(mockCacheService.set).not.toHaveBeenCalled()
      expect(result).toEqual({ success: false })
    })

    it('should return { success: false } if EXP is missing in token context', async () => {
      const jti = 'jwt-id-123'

      const mockRequestContext = new RequestContext({
        user: mockAdminUser,
        channel: {
          token: 'mock_channel_token',
        },
        jwtPayload: {
          jti,
        } as any, // Cast to any to satisfy JwtPayload structure for test
      })

      const result: LogoutOutput = await authService.logout(mockRequestContext)

      expect(mockCacheService.set).not.toHaveBeenCalled()
      expect(result).toEqual({ success: false })
    })

    it('should handle already expired or very near expiry tokens by setting a minimal positive TTL for Redis', async () => {
      const jti = 'jwt-id-already-expired'
      const pastExpTimeSeconds = Math.floor(Date.now() / 1000) - 3600 // Expired 1 hour ago

      const mockRequestContext = new RequestContext({
        user: mockAdminUser,
        channel: {
          token: 'mock_channel_token',
        },
        jwtPayload: {
          jti,
          exp: pastExpTimeSeconds,
        },
      })

      mockCacheService.set.mockResolvedValue('OK' as never)

      const result: LogoutOutput = await authService.logout(mockRequestContext)

      expect(mockCacheService.set).toHaveBeenCalledWith(
        `denylist:jti:${jti}`,
        'true',
        1, // Minimal positive TTL
      )
      expect(result).toEqual({ success: true }) // Still success, as client will clear token.
    })
  })

  describe('me', () => {
    const mockUserId = 'user-from-jwt-123'
    const mockChannelToken = 'user-channel-token'
    const mockRequestContextWithUser = new RequestContext({
      user: mockAdminUser,
      channel: {
        token: 'mock_channel_token',
      },
      jwtPayload: {
        sub: mockUserId,
        email: 'user@example.com',
        jti: 'some-jti',
        exp: Math.floor(Date.now() / 1000) + 3600,
        channelToken: mockChannelToken,
      },
    })

    const mockPrismaUser: User = {
      // Ensure this matches your Prisma User model
      id: mockUserId,
      email: 'user@example.com',
      name: 'Authenticated User',
      password: 'hashedPasswordFromDB_irrelevant_for_me_query',
      channelToken: mockChannelToken,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const expectedUserObject: UserEntity = {
      id: mockPrismaUser.id,
      email: mockPrismaUser.email,
      name: mockPrismaUser.name || undefined,
    }

    it('should return the UserObject for the authenticated user ID present in jwtPayload', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockPrismaUser)

      const result = await authService.me(mockRequestContextWithUser)

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockUserId },
      })
      expect(result).toEqual(expectedUserObject)
    })

    it('should throw UserNotFoundError if no user is found for the ID in jwtPayload', async () => {
      prismaService.user.findUnique.mockResolvedValue(null)

      await expect(authService.me(mockRequestContextWithUser)).rejects.toThrow(
        new UserNotFoundError(mockUserId),
      )

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockUserId },
      })
    })

    it('should throw MissingTokenClaimError if "sub" (user ID) is missing from jwtPayload', async () => {
      const mockRequestContextWithoutSub = new RequestContext({
        user: mockAdminUser,
        channel: {
          token: 'mock_channel_token',
        },
        jwtPayload: {
          email: 'user@example.com',
          jti: 'some-jti',
          exp: Math.floor(Date.now() / 1000) + 3600,
          channelToken: mockChannelToken,
        } as any,
      })

      await expect(
        authService.me(mockRequestContextWithoutSub),
      ).rejects.toThrow(new MissingTokenClaimException('sub'))

      expect(prismaService.user.findUnique).not.toHaveBeenCalled()
    })

    it('should throw an UnauthorizedException if jwtPayload itself is missing from RequestContext', async () => {
      const mockRequestContextWithoutJwtPayload = new RequestContext({
        user: mockAdminUser,
        channel: {
          token: 'mock_channel_token',
        },
        // jwtPayload is intentionally omitted by not providing the key or setting to undefined
      })

      await expect(
        authService.me(mockRequestContextWithoutJwtPayload),
      ).rejects.toThrow(UnauthorizedException)

      expect(prismaService.user.findUnique).not.toHaveBeenCalled()
    })
  })

  describe('registerNewTenant', () => {
    const mockRegisterNewTenantInput: RegisterNewTenantInput = {
      email: 'tenant@example.com',
      password: 'password123',
      userName: 'Tenant Admin',
      tenantName: 'Test Tenant',
      tenantDescription: 'A description for the test tenant.',
    }
    const mockHashedPassword = 'hashedPasswordTenant123'
    const mockToken = 'mock.jwt.token.tenant'
    const mockNewChannel = {
      id: 'channel-id-123',
      name: mockRegisterNewTenantInput.tenantName,
      description: mockRegisterNewTenantInput.tenantDescription,
      token: 'channel-token-xyz',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const mockNewUser: User = {
      id: 'tenant-user-id-123',
      email: mockRegisterNewTenantInput.email,
      name: mockRegisterNewTenantInput.userName,
      password: mockHashedPassword,
      channelToken: mockNewChannel.token,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    beforeEach(() => {
      // Mock for prisma.$transaction
      prismaService.$transaction = jest.fn().mockImplementation((callback) => {
        // Simulate the transaction by calling the callback with a mock transaction client (tx)
        // The mock transaction client will have the 'user.create' method mocked.
        const mockTx = {
          user: {
            create: prismaService.user.create, // Use the existing mock for user.create
          },
          // Add other model mocks here if they are used within the transaction
        }
        return callback(mockTx)
      })
    })

    it('should successfully register a new tenant and user, create a channel, and return AuthenticationPayloadObject', async () => {
      prismaService.user.findUnique.mockResolvedValue(null)
      channelService.createChannel.mockResolvedValue(mockNewChannel)
      ;(bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword)
      prismaService.user.create.mockResolvedValue(mockNewUser) // This will be used by the mockTx
      jwtService.signAsync.mockResolvedValue(mockToken)

      const result = await authService.registerNewTenant(
        mockRequestContext,
        mockRegisterNewTenantInput,
      )

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockRegisterNewTenantInput.email },
      })
      expect(channelService.createChannel).toHaveBeenCalledWith(
        mockRequestContext,
        {
          name: mockRegisterNewTenantInput.tenantName,
          description: mockRegisterNewTenantInput.tenantDescription,
        },
        { tx: expect.anything() }, // tx will be the mockTx object from $transaction mock
      )
      expect(bcrypt.hash).toHaveBeenCalledWith(
        mockRegisterNewTenantInput.password,
        10,
      )
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: mockRegisterNewTenantInput.email,
          name: mockRegisterNewTenantInput.userName,
          password: mockHashedPassword,
          channelToken: mockNewChannel.token,
        },
      })

      const expectedJwtPayload = {
        sub: mockNewUser.id,
        email: mockNewUser.email,
        name: mockNewUser.name,
        jti: mockNewUser.id,
        channelToken: mockNewChannel.token,
      }
      expect(jwtService.signAsync).toHaveBeenCalledWith(expectedJwtPayload, {
        secret: 'test-secret',
        expiresIn: '3600s',
      })

      expect(result).toEqual({
        token: mockToken,
        user: {
          id: mockNewUser.id,
          email: mockNewUser.email,
          name: mockNewUser.name,
        },
      })
    })

    it('should throw EmailAlreadyExistsError if the email is already registered', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockNewUser) // Simulate user already exists

      await expect(
        authService.registerNewTenant(
          mockRequestContext,
          mockRegisterNewTenantInput,
        ),
      ).rejects.toThrow(
        new EmailAlreadyExistsError(mockRegisterNewTenantInput.email),
      )

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockRegisterNewTenantInput.email },
      })
      expect(channelService.createChannel).not.toHaveBeenCalled()
      expect(bcrypt.hash).not.toHaveBeenCalled()
      expect(prismaService.user.create).not.toHaveBeenCalled()
      expect(jwtService.signAsync).not.toHaveBeenCalled()
    })

    it('should throw an error if channel creation fails', async () => {
      prismaService.user.findUnique.mockResolvedValue(null)
      const channelCreationError = new Error('Channel creation failed')
      channelService.createChannel.mockRejectedValue(channelCreationError)

      // Since channelService.createChannel is called within prisma.$transaction,
      // the transaction itself will fail if createChannel throws.
      // We expect the error from createChannel to propagate.
      await expect(
        authService.registerNewTenant(
          mockRequestContext,
          mockRegisterNewTenantInput,
        ),
      ).rejects.toThrow(channelCreationError)

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockRegisterNewTenantInput.email },
      })
      expect(channelService.createChannel).toHaveBeenCalledWith(
        mockRequestContext,
        {
          name: mockRegisterNewTenantInput.tenantName,
          description: mockRegisterNewTenantInput.tenantDescription,
        },
        { tx: expect.anything() },
      )
      expect(bcrypt.hash).not.toHaveBeenCalled() // bcrypt.hash is after channel creation
      expect(prismaService.user.create).not.toHaveBeenCalled()
      expect(jwtService.signAsync).not.toHaveBeenCalled()
    })

    it('should throw an error if user creation fails within the transaction', async () => {
      prismaService.user.findUnique.mockResolvedValue(null)
      channelService.createChannel.mockResolvedValue(mockNewChannel)
      ;(bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword)
      const userCreationError = new Error('User creation failed in DB')
      prismaService.user.create.mockRejectedValue(userCreationError) // Mock failure for user.create inside transaction

      await expect(
        authService.registerNewTenant(
          mockRequestContext,
          mockRegisterNewTenantInput,
        ),
      ).rejects.toThrow(userCreationError)

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockRegisterNewTenantInput.email },
      })
      expect(channelService.createChannel).toHaveBeenCalledTimes(1)
      expect(bcrypt.hash).toHaveBeenCalledWith(
        mockRegisterNewTenantInput.password,
        10,
      )
      expect(prismaService.user.create).toHaveBeenCalledTimes(1)
      expect(jwtService.signAsync).not.toHaveBeenCalled()
    })
  })
})
