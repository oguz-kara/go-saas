// src/modules/company/application/services/company.service.integration-spec.ts
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { InternalServerErrorException } from '@nestjs/common'

import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { RequestContext } from 'src/common/request-context/request-context'
import { CompanyService } from '../application/services/company.service'
import { CreateCompanyInput } from '../api/graphql/dto/create-company.input'
import { CompanyNotFoundError } from '../domain/exceptions/company-not-found.exception'
import { UpdateCompanyInput } from '../api/graphql/dto/update-company.input'
import { ConfigModule } from '@nestjs/config'

const prisma = new PrismaClient()

describe('CompanyService (Integration)', () => {
  let companyService: CompanyService
  let prismaService: PrismaService
  let channel1Token: string
  let channel2Token: string

  // --- Test Setup ---
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
          isGlobal: true,
        }),
      ],
      providers: [CompanyService, PrismaService],
    }).compile()

    companyService = module.get<CompanyService>(CompanyService)
    prismaService = module.get<PrismaService>(PrismaService)
  })

  // Why: We set up a clean slate before each test. For this service, that means
  // deleting all companies and channels, then creating two fresh channels. This lets
  // us reliably test multi-tenancy (i.e., data isolation between channels).
  beforeEach(async () => {
    await prisma.company.deleteMany()
    await prisma.channel.deleteMany()

    const channel1 = await prisma.channel.create({
      data: { name: 'Tenant A', token: 'token-a' },
    })
    const channel2 = await prisma.channel.create({
      data: { name: 'Tenant B', token: 'token-b' },
    })
    channel1Token = channel1.token
    channel2Token = channel2.token
  })

  afterAll(async () => {
    await prisma.company.deleteMany()
    await prisma.channel.deleteMany()
    await prismaService.$disconnect()
    await prisma.$disconnect()
  })

  // --- Testing `createCompany` ---
  describe('createCompany', () => {
    const input: CreateCompanyInput = { name: 'Innovate Inc.' }

    it('should successfully create a new company linked to the channel in the context', async () => {
      // ARRANGE: Create a context that includes the channel token.
      const ctx = new RequestContext({ channel: { token: channel1Token } })

      // ACT
      const result = await companyService.createCompany(ctx, input)

      // ASSERT
      expect(result.name).toBe(input.name)
      expect(result.channelToken).toBe(channel1Token)

      const companyInDb = await prisma.company.findUnique({
        where: { id: result.id },
      })
      expect(companyInDb).toBeDefined()
    })

    it('should throw an error if no channel token is available', async () => {
      // ARRANGE: Create a context with no channel information.
      const ctx = new RequestContext({
        channel: { token: undefined },
      })

      // ACT & ASSERT
      // Why: This test validates our guard clause. The service must ensure that
      // a company is always associated with a channel.
      await expect(companyService.createCompany(ctx, input)).rejects.toThrow(
        InternalServerErrorException,
      )
    })
  })

  // --- Testing `getCompanyById` ---
  describe('getCompanyById', () => {
    it('should retrieve a company by its ID', async () => {
      // ARRANGE
      const createdCompany = await companyService.createCompany(
        new RequestContext({
          channel: { token: channel1Token },
        }),
        { name: 'TestCo' },
        channel1Token,
      )
      const ctx = new RequestContext({ channel: { token: channel1Token } })

      // ACT
      const foundCompany = await companyService.getCompanyById(
        ctx,
        createdCompany.id,
      )

      // ASSERT
      expect(foundCompany).toBeDefined()
      expect(foundCompany.id).toBe(createdCompany.id)
    })

    it('should throw CompanyNotFoundError if the company does not exist', async () => {
      // ARRANGE
      const ctx = new RequestContext({ channel: { token: channel1Token } })
      const nonExistentId = 'clerk-kent-is-not-superman'

      // ACT & ASSERT
      await expect(
        companyService.getCompanyById(ctx, nonExistentId),
      ).rejects.toThrow(CompanyNotFoundError)
    })

    it('should throw CompanyNotFoundError if the company belongs to another tenant', async () => {
      // Why: This is a critical security and data isolation test. We must prove
      // that a user from Tenant A can NEVER access data from Tenant B, even if they
      // guess a valid ID. The service logic `where: { id, channelToken: ct }` is what
      // makes this possible, and this test validates it.

      // ARRANGE: Create a company in Channel B.
      const companyInChannelB = await companyService.createCompany(
        new RequestContext({
          channel: { token: channel2Token },
        }),
        { name: 'SecretCo' },
        channel2Token,
      )
      // Try to access it from the context of Channel A.
      const ctxForChannelA = new RequestContext({
        channel: { token: channel1Token },
      })

      // ACT & ASSERT
      await expect(
        companyService.getCompanyById(ctxForChannelA, companyInChannelB.id),
      ).rejects.toThrow(CompanyNotFoundError)
    })
  })

  // --- Testing `updateCompany` ---
  describe('updateCompany', () => {
    it('should successfully update a company', async () => {
      // ARRANGE
      const originalCompany = await companyService.createCompany(
        new RequestContext({
          channel: { token: channel1Token },
        }),
        { name: 'Original Name' },
        channel1Token,
      )
      const ctx = new RequestContext({ channel: { token: channel1Token } })
      const updateData: UpdateCompanyInput = {
        name: 'Updated Name',
        website: 'https://updated.com',
      }

      // ACT
      const updatedCompany = await companyService.updateCompany(
        ctx,
        originalCompany.id,
        updateData,
      )

      // ASSERT
      expect(updatedCompany.name).toBe('Updated Name')
      expect(updatedCompany.website).toBe('https://updated.com')

      const companyInDb = await prisma.company.findUnique({
        where: { id: originalCompany.id },
      })
      expect(companyInDb?.name).toBe('Updated Name')
    })

    it('should throw CompanyNotFoundError when trying to update a non-existent company', async () => {
      // ARRANGE
      const ctx = new RequestContext({ channel: { token: channel1Token } })

      // ACT & ASSERT
      // Why: This tests our error handling for Prisma's P2025 error code.
      // We are ensuring a generic database error is translated into a meaningful,
      // specific application error.
      await expect(
        companyService.updateCompany(ctx, 'non-existent-id', { name: 'ghost' }),
      ).rejects.toThrow(CompanyNotFoundError)
    })
  })

  // --- Testing `deleteCompany` (Soft Delete) ---
  describe('deleteCompany', () => {
    it('should soft delete a company by setting the deletedAt timestamp', async () => {
      // ARRANGE
      const company = await companyService.createCompany(
        new RequestContext({
          channel: { token: channel1Token },
        }),
        { name: 'ToBeDeleted' },
        channel1Token,
      )
      const ctx = new RequestContext({ channel: { token: channel1Token } })

      // ACT
      const deletedCompany = await companyService.deleteCompany(ctx, company.id)

      // ASSERT
      expect(deletedCompany.deletedAt).not.toBeNull()

      const companyInDb = await prisma.company.findUnique({
        where: { id: company.id },
      })
      expect(companyInDb?.deletedAt).toEqual(deletedCompany.deletedAt)
    })

    it('getCompanyById should throw an error for a soft-deleted company', async () => {
      // Why: This test verifies that our soft delete implementation is effective.
      // Other parts of the system should treat a soft-deleted record as if it's gone.

      // ARRANGE
      const company = await companyService.createCompany(
        new RequestContext({
          channel: { token: channel1Token },
        }),
        { name: 'Vanishing Inc.' },
        channel1Token,
      )
      const ctx = new RequestContext({ channel: { token: channel1Token } })
      await companyService.deleteCompany(ctx, company.id) // Soft delete it

      // ACT & ASSERT
      await expect(
        companyService.getCompanyById(ctx, company.id),
      ).rejects.toThrow(CompanyNotFoundError)
    })
  })

  // --- Testing `getCompanies` ---
  describe('getCompanies', () => {
    beforeEach(async () => {
      // Seed data for consistent search and pagination tests.
      await companyService.createCompany(
        new RequestContext({
          channel: { token: channel1Token },
        }),
        { name: 'Apple Inc.', description: 'Tech giant' },
        channel1Token,
      )
      await companyService.createCompany(
        new RequestContext({
          channel: { token: channel1Token },
        }),
        { name: 'Microsoft', description: 'Software company' },
        channel1Token,
      )
      await companyService.createCompany(
        new RequestContext({
          channel: { token: channel1Token },
        }),
        { name: 'Google', description: 'Another tech giant' },
        channel1Token,
      )
      // This one should NOT be found when searching from channel 1
      await companyService.createCompany(
        new RequestContext({
          channel: { token: channel2Token },
        }),
        { name: 'Amazon', description: 'E-commerce and tech' },
        channel2Token,
      )
    })

    it('should retrieve all non-deleted companies for a given channel', async () => {
      const ctx = new RequestContext({ channel: { token: channel1Token } })
      const result = await companyService.getCompanies(ctx, {})

      expect(result.items.length).toBe(3)
      expect(result.totalCount).toBe(3)
    })

    it('should filter companies by a search query', async () => {
      // Why: This test validates the dynamic query building logic in the service.
      // We ensure that the `whereClause` is constructed and executed correctly.
      const ctx = new RequestContext({ channel: { token: channel1Token } })
      const result = await companyService.getCompanies(ctx, {
        searchQuery: 'giant',
      })

      expect(result.items.length).toBe(2)
      expect(result.totalCount).toBe(2)
      // Check that the correct companies were returned
      const names = result.items.map((c) => c.name)
      expect(names).toContain('Apple Inc.')
      expect(names).toContain('Google')
    })
  })
})
