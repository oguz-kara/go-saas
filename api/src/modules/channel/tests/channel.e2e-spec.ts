// test/channel.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { AppModule } from 'src/app.module'
import { CreateChannelInput } from '../api/graphql/dto/create-channel.input'
import { createChannelMutation } from '../gql/create-channel.mutation-gql'
import { getChannelsQuery } from '../gql/get-channels.query-gql'
import { getChannelByTokenQuery } from '../gql/get-channel-by-token.query-gql'

describe('ChannelResolver (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  const GQL_ENDPOINT = '/admin-api' // Using the specified endpoint

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    // User specified not to add ValidationPipe yet for these tests
    // if (app.useGlobalPipes) { // Example if you were to add it later
    //   app.useGlobalPipes(new ValidationPipe());
    // }
    await app.init()

    prisma = moduleFixture.get<PrismaService>(PrismaService)
  })

  afterAll(async () => {
    await app.close()
  })

  // Clean the database before each test run within this describe block
  beforeEach(async () => {
    // It's good practice to also clean related tables if there are dependencies,
    // but for channel-specific tests, cleaning 'channel' is primary.
    // If tests create users that create channels, you'd clean users too.
    await prisma.companyNote.deleteMany() // Assuming notes depend on company
    await prisma.company.deleteMany() // Assuming company depends on channel
    await prisma.user.deleteMany() // Assuming user depends on channel
    await prisma.channel.deleteMany()
  })

  // --- Tests for createChannel ---
  describe('Mutation: createChannel', () => {
    it('should successfully create a new channel', async () => {
      // ARRANGE
      const input: CreateChannelInput = {
        name: 'E2E Test Channel',
        description: 'A channel created via E2E test',
      }

      // ACT
      const response = await request(app.getHttpServer())
        .post(GQL_ENDPOINT)
        .send({
          query: createChannelMutation,
          variables: { input },
        })

      // ASSERT
      expect(response.status).toBe(200)
      const createdChannel = response.body.data.createChannel
      expect(createdChannel.name).toBe(input.name)
      expect(createdChannel.description).toBe(input.description)
      expect(createdChannel.token).toEqual(expect.any(String)) // Token is auto-generated

      // Verify in DB
      const channelInDb = await prisma.channel.findUnique({
        where: { id: createdChannel.id },
      })
      expect(channelInDb).toBeDefined()
      expect(channelInDb?.name).toBe(input.name)
    })

    it('should return a conflict error if creating a channel with a duplicate name', async () => {
      // ARRANGE
      const input: CreateChannelInput = { name: 'Duplicate Name Channel' }
      // Create it once
      await request(app.getHttpServer())
        .post(GQL_ENDPOINT)
        .send({ query: createChannelMutation, variables: { input } })

      // ACT: Try to create it again
      const response = await request(app.getHttpServer())
        .post(GQL_ENDPOINT)
        .send({ query: createChannelMutation, variables: { input } })

      // ASSERT
      expect(response.status).toBe(200) // GraphQL often returns 200 for application errors
      expect(response.body.data).toBeNull() // No data should be returned on error
      expect(response.body.errors).toBeDefined()
      expect(response.body.errors[0].message).toContain(
        `Channel name "${input.name}" already exists.`,
      )
      // You might also want to check the error code if your GraphQL setup returns it
      // expect(response.body.errors[0].extensions.code).toBe('CONFLICT'); // Or whatever your setup is
    })
  })

  // --- Tests for getChannels ---
  describe('Query: channels', () => {
    it('should return an empty list when no channels exist', async () => {
      // ACT
      const response = await request(app.getHttpServer())
        .post(GQL_ENDPOINT)
        .send({ query: getChannelsQuery, variables: { skip: 0, take: 10 } })

      // ASSERT
      expect(response.status).toBe(200)
      const channelsData = response.body.data.channels
      expect(channelsData.items).toEqual([])
      expect(channelsData.totalCount).toBe(0)
    })

    it('should return a paginated list of channels', async () => {
      // ARRANGE: Create some channels
      const channelNames = ['Channel A', 'Channel B', 'Channel C']
      for (const name of channelNames) {
        await prisma.channel.create({
          data: {
            name,
            token: `token-${name.toLowerCase().replace(' ', '-')}`,
          },
        })
      }

      // ACT: Get the first page
      let response = await request(app.getHttpServer())
        .post(GQL_ENDPOINT)
        .send({ query: getChannelsQuery, variables: { skip: 0, take: 2 } })

      // ASSERT for first page
      expect(response.status).toBe(200)
      let channelsData = response.body.data.channels
      expect(channelsData.items.length).toBe(2)
      expect(channelsData.totalCount).toBe(3)
      // Service orders by createdAt desc, so check the latest ones (C then B)
      expect(channelsData.items[0].name).toBe('Channel C')
      expect(channelsData.items[1].name).toBe('Channel B')

      // ACT: Get the second page
      response = await request(app.getHttpServer())
        .post(GQL_ENDPOINT)
        .send({ query: getChannelsQuery, variables: { skip: 2, take: 2 } })

      // ASSERT for second page
      expect(response.status).toBe(200)
      channelsData = response.body.data.channels
      expect(channelsData.items.length).toBe(1)
      expect(channelsData.totalCount).toBe(3)
      expect(channelsData.items[0].name).toBe('Channel A')
    })
  })

  // --- Tests for getChannelByToken ---
  describe('Query: channelByToken', () => {
    let testChannelToken: string

    beforeEach(async () => {
      // ARRANGE: Create a channel to find
      const created = await prisma.channel.create({
        data: { name: 'Find Me Channel', token: 'find-me-123' },
      })
      testChannelToken = created.token
    })

    it('should return the channel if a valid token is provided', async () => {
      // ACT
      const response = await request(app.getHttpServer())
        .post(GQL_ENDPOINT)
        .send({
          query: getChannelByTokenQuery,
          variables: { token: testChannelToken },
        })

      // ASSERT
      expect(response.status).toBe(200)
      const channelData = response.body.data.channelByToken
      expect(channelData).toBeDefined()
      expect(channelData.name).toBe('Find Me Channel')
      expect(channelData.token).toBe(testChannelToken)
    })

    it('should return null if the token does not exist', async () => {
      // ACT
      const response = await request(app.getHttpServer())
        .post(GQL_ENDPOINT)
        .send({
          query: getChannelByTokenQuery,
          variables: { token: 'non-existent-token' },
        })

      // ASSERT
      expect(response.status).toBe(200)
      // `nullable: true` in the schema means data will have the field as null.
      expect(response.body.data.channelByToken).toBeNull()
    })
  })
})
