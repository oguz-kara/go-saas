import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from '../application/services/user.service'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import {
  CtxUser,
  RequestContext,
} from 'src/common/request-context/request-context'
import { DeepMocked } from 'src/common/test/types/deep-mocked.type'
import {
  BadRequestException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common'
import { UpdateUserProfileInput } from '../api/graphql/dto/update-user-profile.input'
import { ChangePasswordInput } from '../api/graphql/dto/change-password.input'
import { EntityNotFoundException } from 'src/common/exceptions'
import * as bcrypt from 'bcryptjs'

// Mock Logger
beforeAll(() => {
  jest.spyOn(Logger.prototype, 'log').mockImplementation(jest.fn())
  jest.spyOn(Logger.prototype, 'error').mockImplementation(jest.fn())
  jest.spyOn(Logger.prototype, 'warn').mockImplementation(jest.fn())
})

// Mock bcrypt
jest.mock('bcryptjs')

describe('UserService', () => {
  let service: UserService
  let prisma: DeepMocked<PrismaService>

  const mockUserId = 'user-123'
  const mockUserEmail = 'test@example.com'
  const mockUserName = 'Test User'
  const mockChannelToken = 'channel-token-123'
  const mockHashedPassword = '$2b$10$hashedpassword'

  const mockCtxUser: CtxUser = {
    id: mockUserId,
    email: mockUserEmail,
    name: mockUserName,
  }

  const mockRequestContext = new RequestContext({
    user: mockCtxUser,
    channel: { token: mockChannelToken },
  })

  const mockUser = {
    id: mockUserId,
    email: mockUserEmail,
    name: mockUserName,
    password: mockHashedPassword,
    channelToken: mockChannelToken,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              findFirst: jest.fn(),
              findMany: jest.fn(),
              count: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<UserService>(UserService)
    prisma = module.get(PrismaService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('updateUserProfile', () => {
    const mockInput: UpdateUserProfileInput = {
      name: 'Updated Name',
    }

    it('should successfully update user profile with valid input', async () => {
      const updatedUser = { ...mockUser, name: mockInput.name }
      prisma.user.findUnique.mockResolvedValue(mockUser)
      prisma.user.update.mockResolvedValue(updatedUser)

      const result = await service.updateUserProfile(mockRequestContext, mockInput)

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: mockUserId,
          channelToken: mockChannelToken,
        },
      })
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUserId },
        data: {
          name: mockInput.name,
        },
      })
      expect(result.name).toBe(mockInput.name)
      expect(result.id).toBe(mockUserId)
    })

    it('should throw UnauthorizedException if channel token is missing', async () => {
      const contextWithoutChannel = new RequestContext({
        user: mockCtxUser,
        channel: { token: '' },
      })

      await expect(
        service.updateUserProfile(contextWithoutChannel, mockInput),
      ).rejects.toThrow(UnauthorizedException)
      await expect(
        service.updateUserProfile(contextWithoutChannel, mockInput),
      ).rejects.toThrow('User channel could not be identified.')
    })

    it('should throw UnauthorizedException if user is not authenticated', async () => {
      const contextWithoutUser = new RequestContext({
        user: null,
        channel: { token: mockChannelToken },
      })

      await expect(
        service.updateUserProfile(contextWithoutUser, mockInput),
      ).rejects.toThrow(UnauthorizedException)
      await expect(
        service.updateUserProfile(contextWithoutUser, mockInput),
      ).rejects.toThrow('User not authenticated.')
    })

    it('should throw EntityNotFoundException if user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null)

      await expect(
        service.updateUserProfile(mockRequestContext, mockInput),
      ).rejects.toThrow(EntityNotFoundException)
    })

    it('should throw EntityNotFoundException if user belongs to different channel', async () => {
      prisma.user.findUnique.mockResolvedValue(null) // User not found in the specified channel

      await expect(
        service.updateUserProfile(mockRequestContext, mockInput),
      ).rejects.toThrow(EntityNotFoundException)
    })
  })

  describe('changePassword', () => {
    const mockChangePasswordInput: ChangePasswordInput = {
      currentPassword: 'currentPassword123',
      newPassword: 'newPassword123',
      confirmPassword: 'newPassword123',
    }

    it('should successfully change password with valid input', async () => {
      const mockNewHashedPassword = '$2b$10$newhashedpassword'
      prisma.user.findUnique.mockResolvedValue(mockUser)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)
      ;(bcrypt.hash as jest.Mock).mockResolvedValue(mockNewHashedPassword)
      prisma.user.update.mockResolvedValue({
        ...mockUser,
        password: mockNewHashedPassword,
      })

      const result = await service.changePassword(
        mockRequestContext,
        mockChangePasswordInput,
      )

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: mockUserId,
          channelToken: mockChannelToken,
        },
      })
      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockChangePasswordInput.currentPassword,
        mockHashedPassword,
      )
      expect(bcrypt.hash).toHaveBeenCalledWith(
        mockChangePasswordInput.newPassword,
        10,
      )
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUserId },
        data: {
          password: mockNewHashedPassword,
        },
      })
      expect(result.success).toBe(true)
      expect(result.message).toBe('Password changed successfully')
    })

    it('should throw BadRequestException if new password and confirm password do not match', async () => {
      const invalidInput: ChangePasswordInput = {
        currentPassword: 'currentPassword123',
        newPassword: 'newPassword123',
        confirmPassword: 'differentPassword123',
      }

      await expect(
        service.changePassword(mockRequestContext, invalidInput),
      ).rejects.toThrow(BadRequestException)
      await expect(
        service.changePassword(mockRequestContext, invalidInput),
      ).rejects.toThrow('New password and confirm password do not match')
    })

    it('should throw UnauthorizedException if channel token is missing', async () => {
      const contextWithoutChannel = new RequestContext({
        user: mockCtxUser,
        channel: { token: '' },
      })

      await expect(
        service.changePassword(contextWithoutChannel, mockChangePasswordInput),
      ).rejects.toThrow(UnauthorizedException)
      await expect(
        service.changePassword(contextWithoutChannel, mockChangePasswordInput),
      ).rejects.toThrow('User channel could not be identified.')
    })

    it('should throw UnauthorizedException if user is not authenticated', async () => {
      const contextWithoutUser = new RequestContext({
        user: null,
        channel: { token: mockChannelToken },
      })

      await expect(
        service.changePassword(contextWithoutUser, mockChangePasswordInput),
      ).rejects.toThrow(UnauthorizedException)
      await expect(
        service.changePassword(contextWithoutUser, mockChangePasswordInput),
      ).rejects.toThrow('User not authenticated.')
    })

    it('should throw EntityNotFoundException if user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null)

      await expect(
        service.changePassword(mockRequestContext, mockChangePasswordInput),
      ).rejects.toThrow(EntityNotFoundException)
    })

    it('should throw BadRequestException if current password is incorrect', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

      await expect(
        service.changePassword(mockRequestContext, mockChangePasswordInput),
      ).rejects.toThrow(BadRequestException)
      await expect(
        service.changePassword(mockRequestContext, mockChangePasswordInput),
      ).rejects.toThrow('Current password is incorrect')
    })

    it('should handle bcrypt errors gracefully', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser)
      ;(bcrypt.compare as jest.Mock).mockRejectedValue(new Error('Bcrypt error'))

      await expect(
        service.changePassword(mockRequestContext, mockChangePasswordInput),
      ).rejects.toThrow('Bcrypt error')
    })
  })

  describe('getUser', () => {
    it('should successfully get user by id', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser)

      const result = await service.getUser(mockRequestContext, mockUserId)

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: mockUserId,
          channelToken: mockChannelToken,
        },
      })
      expect(result.id).toBe(mockUserId)
      expect(result.email).toBe(mockUserEmail)
    })

    it('should throw EntityNotFoundException if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null)

      await expect(
        service.getUser(mockRequestContext, 'non-existent-id'),
      ).rejects.toThrow(EntityNotFoundException)
    })

    it('should throw UnauthorizedException if channel token is missing', async () => {
      const contextWithoutChannel = new RequestContext({
        user: mockCtxUser,
        channel: { token: '' },
      })

      await expect(
        service.getUser(contextWithoutChannel, mockUserId),
      ).rejects.toThrow(UnauthorizedException)
    })
  })

  describe('getUserByEmail', () => {
    it('should successfully get user by email', async () => {
      prisma.user.findFirst.mockResolvedValue(mockUser)

      const result = await service.getUserByEmail(
        mockRequestContext,
        mockUserEmail,
      )

      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: {
          email: mockUserEmail,
          channelToken: mockChannelToken,
        },
      })
      expect(result?.email).toBe(mockUserEmail)
    })

    it('should return null if user not found', async () => {
      prisma.user.findFirst.mockResolvedValue(null)

      const result = await service.getUserByEmail(
        mockRequestContext,
        'nonexistent@example.com',
      )

      expect(result).toBeNull()
    })

    it('should throw UnauthorizedException if channel token is missing', async () => {
      const contextWithoutChannel = new RequestContext({
        user: mockCtxUser,
        channel: { token: '' },
      })

      await expect(
        service.getUserByEmail(contextWithoutChannel, mockUserEmail),
      ).rejects.toThrow(UnauthorizedException)
    })
  })
})

