// src/modules/channel/application/services/channel.service.integration-spec.ts
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { ConflictException } from '@nestjs/common'

import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { RequestContext } from 'src/common/request-context/request-context'
import { ChannelService } from '../application/services/channel.service'
import { CreateChannelInput } from '../api/graphql/dto/create-channel.input'
import { ConfigModule } from '@nestjs/config'

const prisma = new PrismaClient()

describe('ChannelService (Integration)', () => {
  let channelService: ChannelService
  let prismaService: PrismaService

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
          isGlobal: true,
        }),
      ],
      providers: [ChannelService, PrismaService],
    }).compile()

    channelService = module.get<ChannelService>(ChannelService)
    prismaService = module.get<PrismaService>(PrismaService)
  })

  beforeEach(async () => {
    await prisma.channel.deleteMany()
  })

  afterAll(async () => {
    await prisma.channel.deleteMany()
    await prismaService.$disconnect()
    await prisma.$disconnect()
  })

  // --- Testing `createChannel` ---
  describe('createChannel', () => {
    const mockRequestContext = new RequestContext({
      channel: {
        token: 'xxx',
      },
    })
    const input: CreateChannelInput = {
      name: 'My Awesome Channel',
      description: 'A channel for testing.',
    }

    it('should successfully create a new channel in the database', async () => {
      // ACT: Execute the method under test.
      const result = await channelService.createChannel(
        mockRequestContext,
        input,
      )

      // ASSERT (Part 1: The Return Value)
      // Why: We first verify that the method returns a channel object with the correct properties
      // and a non-empty token, fulfilling its immediate contract.
      expect(result).toBeDefined()
      expect(result.name).toBe(input.name)
      expect(result.description).toBe(input.description)
      expect(result.token).toEqual(expect.any(String))

      // ASSERT (Part 2: The Database Side Effect)
      // Why: This is the core of the integration test. We go directly to the database
      // to confirm that the record was actually and correctly created.
      const channelInDb = await prismaService.channel.findUnique({
        where: { name: input.name },
      })
      expect(channelInDb).toBeDefined()
      expect(channelInDb?.token).toBe(result.token)
    })

    it('should throw a ConflictException for a duplicate channel name', async () => {
      // ARRANGE: First, create a channel to set up the conflict condition.
      await channelService.createChannel(mockRequestContext, input)

      // ACT & ASSERT: We expect the second attempt with the same name to fail
      // in a specific way.
      // Why: This test validates our custom error handling. We're not just checking
      // for any error, but for the specific, user-friendly ConflictException that
      // our service is supposed to throw when it catches a P2002 error from Prisma.
      await expect(
        channelService.createChannel(mockRequestContext, input),
      ).rejects.toThrow(ConflictException)

      await expect(
        channelService.createChannel(mockRequestContext, input),
      ).rejects.toThrow(`Channel name "${input.name}" already exists.`)
    })

    it('should use the provided transaction client to create a channel', async () => {
      // Why: This is an advanced test that validates a critical feature. When another
      // service calls `createChannel` as part of a larger transaction, we need to be
      // sure it correctly uses the provided transaction client (`tx`) instead of the
      // main `prisma` client. This ensures the operation is atomic.

      // ARRANGE: We "spy" on the main prisma client's `create` method. A spy lets
      // us observe a function without changing its behavior.
      const prismaCreateSpy = jest.spyOn(prismaService.channel, 'create')

      // ACT: We run our service method inside a transaction block.
      const result = await prismaService.$transaction(async (tx) => {
        return channelService.createChannel(mockRequestContext, input, { tx })
      })

      // ASSERT
      expect(result.name).toBe(input.name)
      // The most important assertion: The main prisma client was NEVER called.
      // This proves that the `tx` client was used instead.
      expect(prismaCreateSpy).not.toHaveBeenCalled()

      // We can also verify it was created inside the transaction.
      const channelInDb = await prismaService.channel.findUnique({
        where: { name: input.name },
      })
      expect(channelInDb).toBeDefined()

      // Cleanup the spy
      prismaCreateSpy.mockRestore()
    })
  })

  // --- Testing `getChannels` ---
  describe('getChannels', () => {
    // Why: For pagination tests, it's helpful to seed the database with a known
    // number of records so we can make precise assertions about the results.
    beforeEach(async () => {
      // Create 12 channels for testing pagination
      for (let i = 1; i <= 12; i++) {
        await prisma.channel.create({
          data: { name: `Channel ${i}`, token: `token-${i}` },
        })
      }
    })

    it('should return the first page of channels with default pagination', async () => {
      // ACT: Call with default pagination (skip: 0, take: 10)
      const result = await channelService.getChannels(
        new RequestContext({
          channel: {
            token: 'xxx',
          },
        }),
        {},
      )

      // ASSERT
      expect(result.items.length).toBe(10)
      expect(result.totalCount).toBe(12)
      expect(result.items[0].name).toBe('Channel 12') // Ordered by createdAt desc
    })

    it('should return the second page of channels using skip and take', async () => {
      // ACT: Request the second page.
      const result = await channelService.getChannels(
        new RequestContext({
          channel: {
            token: 'xxx',
          },
        }),
        {
          skip: 10,
          take: 10,
        },
      )

      // ASSERT
      expect(result.items.length).toBe(2) // Only 2 items left on the second page
      expect(result.totalCount).toBe(12)
    })

    it('should return an empty array if no channels exist', async () => {
      // ARRANGE: Ensure the database is empty for this specific test
      await prisma.channel.deleteMany()

      // ACT
      const result = await channelService.getChannels(
        new RequestContext({
          channel: {
            token: 'xxx',
          },
        }),
        {},
      )

      // ASSERT
      expect(result.items.length).toBe(0)
      expect(result.totalCount).toBe(0)
    })
  })

  // --- Testing `findChannelByToken` ---
  describe('findChannelByToken', () => {
    it('should return the channel if a valid token is provided', async () => {
      // ARRANGE
      const createdChannel = await prisma.channel.create({
        data: { name: 'Token Channel', token: 'find-me-token' },
      })

      // ACT
      const result = await channelService.findChannelByToken(
        new RequestContext({
          channel: {
            token: 'xxx',
          },
        }),
        'find-me-token',
      )

      // ASSERT
      expect(result).not.toBeNull()
      expect(result?.id).toBe(createdChannel.id)
      expect(result?.name).toBe('Token Channel')
    })

    it('should return null if the token does not exist', async () => {
      // ACT
      const result = await channelService.findChannelByToken(
        new RequestContext({
          channel: {
            token: 'xxx',
          },
        }),
        'non-existent-token',
      )

      // ASSERT
      // Why: For a "find" or "get" operation, returning `null` for a non-existent
      // record is standard, predictable behavior. Our test confirms this.
      expect(result).toBeNull()
    })
  })
})
