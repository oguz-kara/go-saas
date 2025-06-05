// src/modules/auth/auth.resolver.spec.ts
import { Test, TestingModule } from '@nestjs/testing'
import { GqlExecutionContext } from '@nestjs/graphql' // For mocking GraphQL context
import { AuthResolver } from '../../api/graphql/resolvers/auth.resolver'
import { AuthService } from '../../application/services/auth.service'
import { RegisterUserInput } from '../../api/graphql/dto/register-user.input'
import { UserEntity } from '../../api/graphql/entities/user.entity'
import { AuthenticationPayloadObject } from '../../api/graphql/dto/authetication-payload.object-type'
import {
  CtxUser,
  RequestContext,
} from 'src/common/request-context/request-context'
import { EmailAlreadyExistsError } from '../../domain/exceptions/email-already-exists.exception'
import { LoginUserInput } from '../../api/graphql/dto/login-user.input'
import { UserNotFoundError } from '../../domain/exceptions/user-not-found.exception'
import { InvalidCredentialsError } from '../../domain/exceptions/invalid-credentials.exception'
import { InternalServerErrorException } from '@nestjs/common'

const mockAuthService = {
  registerUser: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
  me: jest.fn(),
  registerNewTenant: jest.fn(),
}

describe('AuthResolver', () => {
  let resolver: AuthResolver
  let service: typeof mockAuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    })
      .overrideProvider(GqlExecutionContext)
      .useValue({
        create: jest.fn(() => ({
          getContext: jest.fn(() => ({
            req: {
              requestId: 'mock-request-id-from-gql-exec-context',
            },
          })),
        })),
      })
      .compile()

    resolver = module.get<AuthResolver>(AuthResolver)
    service = module.get(AuthService)
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

    const mockUserObject: UserEntity = {
      id: 'user-id-1',
      email: 'test@example.com',
      name: 'Test User',
    }

    const mockAuthPayload: AuthenticationPayloadObject = {
      token: 'mock.jwt.token',
      user: mockUserObject,
    }

    const mockResolverChannelToken = 'resolver-channel-token-xyz'

    const mockRequestContext = new RequestContext({
      channel: { token: 'ctx-channel-token-abc' },
      user: mockUserObject as CtxUser,
    })

    it('should call authService.registerUser with correct arguments and return AuthenticationPayloadObject on success', async () => {
      service.registerUser.mockResolvedValue(mockAuthPayload)

      const result = await resolver.registerUser(
        mockRequestContext,
        mockRegisterInput,
        mockResolverChannelToken,
      )

      expect(service.registerUser).toHaveBeenCalledWith(
        mockRequestContext,
        mockRegisterInput,
        mockResolverChannelToken,
      )
      expect(result).toEqual(mockAuthPayload)
      expect(result.token).toBe('mock.jwt.token')
      expect(result.user.email).toBe(mockRegisterInput.email)
    })

    it('should propagate EmailAlreadyExistsError from service', async () => {
      const email = 'taken@example.com'
      const error = new EmailAlreadyExistsError(email)
      service.registerUser.mockRejectedValue(error)

      try {
        await resolver.registerUser(
          mockRequestContext,
          {
            ...mockRegisterInput,
            email,
          },
          mockResolverChannelToken,
        )
      } catch (e: any) {
        expect(e).toBeInstanceOf(EmailAlreadyExistsError)
        expect(e.message).toBe(`User with email "${email}" already exists`)
      }

      expect(service.registerUser).toHaveBeenCalledWith(
        mockRequestContext,
        {
          ...mockRegisterInput,
          email,
        },
        mockResolverChannelToken,
      )
    })
  })

  describe('loginUser', () => {
    const mockLoginInput: LoginUserInput = {
      email: 'test@example.com',
      password: 'password123',
    }

    const mockUserObject: UserEntity = {
      id: 'user-id-1',
      email: 'test@example.com',
      name: 'Test User',
    }

    const mockAuthPayload: AuthenticationPayloadObject = {
      // Defined in registerUser tests
      token: 'mock.jwt.token.for.login',
      user: mockUserObject,
    }

    const mockChannel = {
      token: 'xxx',
    }

    const mockRequestContext = new RequestContext({
      channel: mockChannel,
      user: mockUserObject as CtxUser,
    })

    it('should call authService.login with correct arguments and return AuthenticationPayloadObject on successful login', async () => {
      service.login.mockResolvedValue(mockAuthPayload)

      const result = await resolver.loginUser(
        mockRequestContext,
        mockLoginInput,
      )

      expect(service.login).toHaveBeenCalledWith(
        mockRequestContext,
        mockLoginInput,
      )
      expect(result).toEqual(mockAuthPayload)
      expect(result.token).toBe('mock.jwt.token.for.login')
      expect(result.user.email).toBe(mockLoginInput.email)
    })

    it('should propagate UserNotFoundError from service', async () => {
      const email = 'nonexistent@example.com'
      const error = new UserNotFoundError(email)
      service.login.mockRejectedValue(error)

      try {
        await resolver.loginUser(mockRequestContext, {
          ...mockLoginInput,
          email,
        })
      } catch (e: any) {
        expect(e).toBeInstanceOf(UserNotFoundError)
        expect(e.message).toBe(`User with identifier "${email}" not found.`)
      }

      expect(service.login).toHaveBeenCalledWith(mockRequestContext, {
        ...mockLoginInput,
        email,
      })
    })

    it('should propagate InvalidCredentialsError from service', async () => {
      const error = new InvalidCredentialsError()
      service.login.mockRejectedValue(error)

      try {
        await resolver.loginUser(mockRequestContext, mockLoginInput)
      } catch (e: any) {
        expect(e).toBeInstanceOf(InvalidCredentialsError)
        expect(e.message).toBe('Invalid email or password.')
      }
      expect(service.login).toHaveBeenCalledWith(
        mockRequestContext,
        mockLoginInput,
      )
    })
  })

  describe('logoutUser', () => {
    const mockUserObject: UserEntity = {
      // Re-using from login tests for context
      id: 'user-id-1',
      email: 'test@example.com',
      name: 'Test User',
    }
    const mockRequestContext = new RequestContext({
      channel: { token: 'ctx-channel-token-logout' },
      user: mockUserObject as CtxUser,
      // For logout, jwtPayload would typically be populated in a real request context by middleware
      jwtPayload: {
        jti: 'jwt-id-example',
        exp: Math.floor(Date.now() / 1000) + 3600,
        sub: mockUserObject.id,
        email: mockUserObject.email,
      },
    })

    it('should call authService.logout with the context and return its result', async () => {
      const mockLogoutOutput = { success: true }
      service.logout.mockResolvedValue(mockLogoutOutput)

      const result = await resolver.logoutUser(mockRequestContext)

      expect(service.logout).toHaveBeenCalledWith(mockRequestContext)
      expect(result).toEqual(mockLogoutOutput)
    })

    it('should handle logout failure (e.g., service returns success: false)', async () => {
      const mockLogoutOutputFailure = { success: false }
      service.logout.mockResolvedValue(mockLogoutOutputFailure)

      const result = await resolver.logoutUser(mockRequestContext)

      expect(service.logout).toHaveBeenCalledWith(mockRequestContext)
      expect(result).toEqual(mockLogoutOutputFailure)
    })

    it('should propagate errors from authService.logout', async () => {
      const errorMessage = 'Cache service unavailable'
      const logoutError = new InternalServerErrorException(errorMessage)
      service.logout.mockRejectedValue(logoutError)

      await expect(resolver.logoutUser(mockRequestContext)).rejects.toThrow(
        InternalServerErrorException,
      )
      await expect(resolver.logoutUser(mockRequestContext)).rejects.toThrow(
        errorMessage,
      )
      expect(service.logout).toHaveBeenCalledWith(mockRequestContext)
    })
  })

  describe('me', () => {
    const mockUserEntityForMe: UserEntity = {
      id: 'current-user-id-me',
      email: 'me@example.com',
      name: 'Current User',
    }
    const mockRequestContextForMe = new RequestContext({
      channel: { token: 'ctx-channel-token-me' },
      user: {
        // Simplified CtxUser for this test context
        id: mockUserEntityForMe.id,
        email: mockUserEntityForMe.email,
        name: mockUserEntityForMe.name as string,
      },
      // In a real scenario, jwtPayload would be derived from the token by auth middleware
      jwtPayload: {
        sub: mockUserEntityForMe.id,
        email: mockUserEntityForMe.email,
        jti: 'some-jti-for-me',
        exp: Math.floor(Date.now() / 1000) + 3600,
        channelToken: 'ctx-channel-token-me',
      },
    })

    it('should call authService.me with the context and return the user entity', async () => {
      // Ensure the mockAuthService has a 'me' method
      if (!service.me) {
        service.me = jest.fn()
      }
      service.me.mockResolvedValue(mockUserEntityForMe)

      const result = await resolver.me(mockRequestContextForMe)

      expect(service.me).toHaveBeenCalledWith(mockRequestContextForMe)
      expect(result).toEqual(mockUserEntityForMe)
    })

    it('should return null if authService.me returns null (e.g., no authenticated user)', async () => {
      if (!service.me) {
        service.me = jest.fn()
      }
      service.me.mockResolvedValue(null)

      const result = await resolver.me(mockRequestContextForMe)

      expect(service.me).toHaveBeenCalledWith(mockRequestContextForMe)
      expect(result).toBeNull()
    })

    it('should propagate UserNotFoundError from authService.me', async () => {
      if (!service.me) {
        service.me = jest.fn()
      }
      const error = new UserNotFoundError(mockUserEntityForMe.id)
      service.me.mockRejectedValue(error)

      await expect(resolver.me(mockRequestContextForMe)).rejects.toThrow(
        UserNotFoundError,
      )
      expect(service.me).toHaveBeenCalledWith(mockRequestContextForMe)
    })

    // Example for UnauthorizedException if JWT is invalid/missing, though context setup here is basic
    // it('should propagate UnauthorizedException if authService.me throws it', async () => {
    //   if (!service.me) {
    //     service.me = jest.fn();
    //   }
    //   const error = new UnauthorizedException('Token invalid');
    //   service.me.mockRejectedValue(error);
    //   const ctxWithoutValidJwt = new RequestContext({ channel: {token: 'any'} }); // Simulate context without valid JWT for 'me'

    //   await expect(resolver.me(ctxWithoutValidJwt)).rejects.toThrow(UnauthorizedException);
    //   expect(service.me).toHaveBeenCalledWith(ctxWithoutValidJwt);
    // });
  })

  describe('registerNewTenant', () => {
    const mockRegisterTenantInput = {
      email: 'newtenantadmin@example.com',
      password: 'securePassword123',
      userName: 'Tenant Admin User',
      tenantName: 'My New SaaS Tenant',
      tenantDescription: 'A great tenant for a great SaaS',
    }
    const mockTenantUserObject: UserEntity = {
      id: 'tenant-user-id-1',
      email: mockRegisterTenantInput.email,
      name: mockRegisterTenantInput.userName,
    }
    const mockTenantAuthPayload: AuthenticationPayloadObject = {
      token: 'mock.jwt.token.for.new.tenant',
      user: mockTenantUserObject,
    }
    const mockRequestContextForTenant = new RequestContext({
      // For registerNewTenant, the initial context might not have a user or specific channel yet,
      // or it might be a system context.
      // Adjust as per how the resolver actually gets/uses context.
      channel: { token: 'some-generic-channel-or-null' },
    })

    it('should call authService.registerNewTenant and return AuthenticationPayloadObject on success', async () => {
      service.registerNewTenant.mockResolvedValue(mockTenantAuthPayload)

      const result = await resolver.registerNewTenant(
        mockRequestContextForTenant,
        mockRegisterTenantInput,
      )

      expect(service.registerNewTenant).toHaveBeenCalledWith(
        mockRequestContextForTenant,
        mockRegisterTenantInput,
      )
      expect(result).toEqual(mockTenantAuthPayload)
      expect(result.user.email).toBe(mockRegisterTenantInput.email)
    })

    it('should propagate EmailAlreadyExistsError from service during tenant registration', async () => {
      const email = 'existingtenantadmin@example.com'
      const error = new EmailAlreadyExistsError(email)
      service.registerNewTenant.mockRejectedValue(error)

      await expect(
        resolver.registerNewTenant(mockRequestContextForTenant, {
          ...mockRegisterTenantInput,
          email,
        }),
      ).rejects.toThrow(EmailAlreadyExistsError)

      expect(service.registerNewTenant).toHaveBeenCalledWith(
        mockRequestContextForTenant,
        {
          ...mockRegisterTenantInput,
          email,
        },
      )
    })

    it('should propagate other errors from authService.registerNewTenant', async () => {
      const errorMessage = 'Tenant creation failed due to an internal issue.'
      const tenantCreationError = new InternalServerErrorException(errorMessage)
      service.registerNewTenant.mockRejectedValue(tenantCreationError)

      await expect(
        resolver.registerNewTenant(
          mockRequestContextForTenant,
          mockRegisterTenantInput,
        ),
      ).rejects.toThrow(InternalServerErrorException)
      await expect(
        resolver.registerNewTenant(
          mockRequestContextForTenant,
          mockRegisterTenantInput,
        ),
      ).rejects.toThrow(errorMessage)
    })
  })
})
