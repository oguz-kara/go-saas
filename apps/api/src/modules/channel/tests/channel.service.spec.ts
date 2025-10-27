import { Test, TestingModule } from '@nestjs/testing'
import { ChannelService } from '../application/services/channel.service'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import {
  CtxUser,
  RequestContext,
} from 'src/common/request-context/request-context'
import { DeepMocked } from 'src/common/test/types/deep-mocked.type'
import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import { CreateChannelInput } from '../api/graphql/dto/create-channel.input'
import { Prisma, Channel } from '@prisma/client'
import * as tokenUtils from '../domain/utils/token' // To mock generateChannelToken
import { ListQueryArgs } from 'src/common'

// Mock Logger
beforeAll(() => {
  jest.spyOn(Logger.prototype, 'log').mockImplementation(jest.fn())
  jest.spyOn(Logger.prototype, 'error').mockImplementation(jest.fn())
  jest.spyOn(Logger.prototype, 'warn').mockImplementation(jest.fn())
})

// Mock generateChannelToken
const mockGeneratedToken = 'mock-generated-channel-token'
jest.mock('../../domain/utils/token', () => ({
  generateChannelToken: jest.fn(() => mockGeneratedToken),
}))

const createPrismaP2002Error = (
  target: string[],
  message = 'Unique constraint failed',
) => {
  return new Prisma.PrismaClientKnownRequestError(message, {
    code: 'P2002',
    clientVersion: 'mock-prisma-client-version',
    meta: { target },
  })
}

describe('ChannelService', () => {
  let service: ChannelService
  let prisma: DeepMocked<PrismaService>
  let mockTxClient: DeepMocked<Prisma.TransactionClient>

  const mockUserId = 'user-channel-svc-123'
  const mockUserEmail = 'channeluser@example.com'
  const mockUserName = 'Channel Test User'
  const mockCtxUser: CtxUser = {
    id: mockUserId,
    email: mockUserEmail,
    name: mockUserName,
  }
  const mockRequestContext = new RequestContext({
    user: mockCtxUser,
    channel: { token: 'some-context-channel-token' }, // Context channel not directly used by ChannelService
  })

  beforeEach(async () => {
    // Mock for the Prisma TransactionClient
    // It needs to have the same structure as the regular PrismaClient for the models it interacts with.
    mockTxClient = {
      channel: {
        create: jest.fn(),
        findMany: jest.fn(), // Not typically used with tx in this service, but good for structure
        count: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findFirst: jest.fn(),
        deleteMany: jest.fn(),
        updateMany: jest.fn(),
        upsert: jest.fn(),
        aggregate: jest.fn(),
        groupBy: jest.fn(),
        $queryRaw: jest.fn(),
        $queryRawUnsafe: jest.fn(),
        $executeRaw: jest.fn(),
        $executeRawUnsafe: jest.fn(),
        $transaction: jest.fn(),
      },
    } as unknown as DeepMocked<Prisma.TransactionClient>

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChannelService,
        {
          provide: PrismaService,
          useValue: {
            channel: {
              create: jest.fn(),
              findMany: jest.fn(),
              count: jest.fn(),
              findUnique: jest.fn(),
            },
            $transaction: jest.fn((callback) => callback(mockTxClient)),
          },
        },
      ],
    }).compile()

    service = module.get<ChannelService>(ChannelService)
    prisma = module.get(PrismaService)
    ;(tokenUtils.generateChannelToken as jest.Mock).mockClear() // Clear mock calls for generateChannelToken
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('createChannel', () => {
    const mockCreateInput: CreateChannelInput = {
      name: 'Test Channel Name',
      description: 'A description for the test channel.',
    }
    const mockChannelId = 'channel-uuid-xyz'
    const mockExpectedChannel: Channel = {
      id: mockChannelId,
      name: mockCreateInput.name,
      description: mockCreateInput.description || null,
      token: mockGeneratedToken,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    it('should create a channel using default prisma client if no tx provided', async () => {
      ;(tokenUtils.generateChannelToken as jest.Mock).mockReturnValue(
        mockGeneratedToken,
      )
      prisma.channel.create.mockResolvedValue(mockExpectedChannel)

      const result = await service.createChannel(
        mockRequestContext,
        mockCreateInput,
      )

      expect(tokenUtils.generateChannelToken).toHaveBeenCalledTimes(1)
      expect(prisma.channel.create).toHaveBeenCalledWith({
        data: {
          name: mockCreateInput.name,
          description: mockCreateInput.description,
          token: mockGeneratedToken,
        },
      })
      expect(result).toEqual(mockExpectedChannel)
      expect(result.token).toBe(mockGeneratedToken)
    })

    it('should create a channel using provided transaction client (args.tx)', async () => {
      ;(tokenUtils.generateChannelToken as jest.Mock).mockReturnValue(
        mockGeneratedToken,
      )
      mockTxClient.channel.create.mockResolvedValue(mockExpectedChannel)

      const result = await service.createChannel(
        mockRequestContext,
        mockCreateInput,
        { tx: mockTxClient as unknown as Prisma.TransactionClient },
      )

      expect(tokenUtils.generateChannelToken).toHaveBeenCalledTimes(1)
      expect(mockTxClient.channel.create).toHaveBeenCalledWith({
        data: {
          name: mockCreateInput.name,
          description: mockCreateInput.description,
          token: mockGeneratedToken,
        },
      })
      expect(prisma.channel.create).not.toHaveBeenCalled() // Ensure default client is not used
      expect(result).toEqual(mockExpectedChannel)
    })

    it('should throw ConflictException if token already exists (P2002 on token)', async () => {
      ;(tokenUtils.generateChannelToken as jest.Mock).mockReturnValue(
        mockGeneratedToken,
      )
      const p2002Error = createPrismaP2002Error(['token'])
      prisma.channel.create.mockRejectedValue(p2002Error)

      await expect(
        service.createChannel(mockRequestContext, mockCreateInput),
      ).rejects.toThrow(ConflictException)
      await expect(
        service.createChannel(mockRequestContext, mockCreateInput),
      ).rejects.toThrow(`Channel token "${mockGeneratedToken}" already exists.`)
    })

    it('should throw ConflictException if name already exists (P2002 on name)', async () => {
      ;(tokenUtils.generateChannelToken as jest.Mock).mockReturnValue(
        mockGeneratedToken,
      )
      const p2002Error = createPrismaP2002Error(['name'])
      prisma.channel.create.mockRejectedValue(p2002Error)

      await expect(
        service.createChannel(mockRequestContext, mockCreateInput),
      ).rejects.toThrow(ConflictException)
      await expect(
        service.createChannel(mockRequestContext, mockCreateInput),
      ).rejects.toThrow(
        `Channel name "${mockCreateInput.name}" already exists.`,
      )
    })

    it('should throw InternalServerErrorException for other Prisma known errors', async () => {
      ;(tokenUtils.generateChannelToken as jest.Mock).mockReturnValue(
        mockGeneratedToken,
      )
      const someOtherPrismaError = new Prisma.PrismaClientKnownRequestError(
        'Some other DB error',
        { code: 'P20XX', clientVersion: 'test' },
      )
      prisma.channel.create.mockRejectedValue(someOtherPrismaError)

      await expect(
        service.createChannel(mockRequestContext, mockCreateInput),
      ).rejects.toThrow(InternalServerErrorException)
      await expect(
        service.createChannel(mockRequestContext, mockCreateInput),
      ).rejects.toThrow('Could not create channel.')
    })

    it('should throw InternalServerErrorException for unexpected errors during creation', async () => {
      ;(tokenUtils.generateChannelToken as jest.Mock).mockReturnValue(
        mockGeneratedToken,
      )
      const unexpectedError = new Error('Something went very wrong')
      prisma.channel.create.mockRejectedValue(unexpectedError)

      await expect(
        service.createChannel(mockRequestContext, mockCreateInput),
      ).rejects.toThrow(InternalServerErrorException)
      await expect(
        service.createChannel(mockRequestContext, mockCreateInput),
      ).rejects.toThrow('Could not create channel.')
    })
  })

  describe('getChannels', () => {
    const mockPaginationArgsDefault: ListQueryArgs = { skip: 0, take: 10 }
    const mockChannel1: Channel = {
      id: 'channel-1',
      name: 'Channel One',
      token: 'token-one',
      description: null,
      createdAt: new Date(Date.now() - 20000),
      updatedAt: new Date(Date.now() - 20000),
    }
    const mockChannel2: Channel = {
      id: 'channel-2',
      name: 'Channel Two',
      token: 'token-two',
      description: 'A second channel',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const mockChannelsList = [mockChannel2, mockChannel1] // Ordered by createdAt desc by default
    const mockTotalCount = mockChannelsList.length

    it('should get channels with default pagination and order', async () => {
      prisma.channel.findMany.mockResolvedValue(mockChannelsList)
      prisma.channel.count.mockResolvedValue(mockTotalCount)

      const result = await service.getChannels(
        mockRequestContext,
        mockPaginationArgsDefault,
      )

      expect(prisma.channel.findMany).toHaveBeenCalledWith({
        skip: mockPaginationArgsDefault.skip,
        take: mockPaginationArgsDefault.take,
        orderBy: { createdAt: 'desc' },
      })
      expect(prisma.channel.count).toHaveBeenCalledWith() // No where clause currently
      expect(result.items).toEqual(mockChannelsList)
      expect(result.totalCount).toBe(mockTotalCount)
    })

    it('should get channels with custom pagination', async () => {
      const customArgs: ListQueryArgs = { skip: 1, take: 1 }
      prisma.channel.findMany.mockResolvedValue([mockChannel1]) // Simulating skip 1, take 1
      prisma.channel.count.mockResolvedValue(mockTotalCount)

      const result = await service.getChannels(mockRequestContext, customArgs)

      expect(prisma.channel.findMany).toHaveBeenCalledWith({
        skip: customArgs.skip,
        take: customArgs.take,
        orderBy: { createdAt: 'desc' },
      })
      expect(result.items).toEqual([mockChannel1])
      expect(result.totalCount).toBe(mockTotalCount) // Total count should remain the same
    })

    it('should throw InternalServerErrorException if prisma.channel.findMany fails', async () => {
      const dbError = new Error('DB findMany channels failed')
      prisma.channel.findMany.mockRejectedValue(dbError)
      prisma.channel.count.mockResolvedValue(0) // count might be called in Promise.all

      await expect(
        service.getChannels(mockRequestContext, mockPaginationArgsDefault),
      ).rejects.toThrow(InternalServerErrorException)
      await expect(
        service.getChannels(mockRequestContext, mockPaginationArgsDefault),
      ).rejects.toThrow('Could not fetch channels.')
    })

    it('should throw InternalServerErrorException if prisma.channel.count fails', async () => {
      prisma.channel.findMany.mockResolvedValue([]) // findMany might succeed
      const dbError = new Error('DB count channels failed')
      prisma.channel.count.mockRejectedValue(dbError)

      await expect(
        service.getChannels(mockRequestContext, mockPaginationArgsDefault),
      ).rejects.toThrow(InternalServerErrorException)
      await expect(
        service.getChannels(mockRequestContext, mockPaginationArgsDefault),
      ).rejects.toThrow('Could not fetch channels.')
    })
  })

  describe('findChannelByToken', () => {
    const tokenToFind = 'existing-token-abc'
    const mockFoundChannel: Channel = {
      id: 'channel-found-by-token',
      name: 'Found Channel',
      token: tokenToFind,
      description: 'This channel was found by token',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    it('should return the channel if found by token', async () => {
      prisma.channel.findUnique.mockResolvedValue(mockFoundChannel)

      const result = await service.findChannelByToken(
        mockRequestContext,
        tokenToFind,
      )

      expect(prisma.channel.findUnique).toHaveBeenCalledWith({
        where: { token: tokenToFind },
      })
      expect(result).toEqual(mockFoundChannel)
    })

    it('should return null if channel with the token is not found', async () => {
      const nonExistentToken = 'non-existent-token-123'
      prisma.channel.findUnique.mockResolvedValue(null)

      const result = await service.findChannelByToken(
        mockRequestContext,
        nonExistentToken,
      )

      expect(prisma.channel.findUnique).toHaveBeenCalledWith({
        where: { token: nonExistentToken },
      })
      expect(result).toBeNull()
    })

    it('should throw InternalServerErrorException if prisma.channel.findUnique fails', async () => {
      const dbError = new Error('DB findUnique by token failed')
      prisma.channel.findUnique.mockRejectedValue(dbError)

      await expect(
        service.findChannelByToken(mockRequestContext, tokenToFind),
      ).rejects.toThrow(InternalServerErrorException)
      await expect(
        service.findChannelByToken(mockRequestContext, tokenToFind),
      ).rejects.toThrow('Error finding channel.')
    })
  })
})
