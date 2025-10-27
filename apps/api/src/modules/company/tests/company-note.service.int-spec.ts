// src/modules/company-note/application/services/company-note.service.integration-spec.ts
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient, User } from '@prisma/client'

import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { RequestContext } from 'src/common/request-context/request-context'
import { CompanyNotFoundError } from 'src/modules/company/domain/exceptions/company-not-found.exception'
import { CompanyNoteService } from '../application/services/company-note.service'
import { AddCompanyNoteInput } from '../api/graphql/dto/add-company-note.input'
import { CompanyNoteNotFoundError } from '../domain/exceptions/company-note-not-found.exception'
import { ConfigModule } from '@nestjs/config'

const prisma = new PrismaClient()

describe('CompanyNoteService (Integration)', () => {
  let companyNoteService: CompanyNoteService
  let prismaService: PrismaService

  // --- Test Setup ---
  // Why: We need a consistent, known state before every test. This includes
  // multiple channels and companies to properly test multi-tenancy and relations.
  let channel1Token: string
  let channel2Token: string
  let companyInChannel1: { id: string }
  let softDeletedCompany: { id: string }
  let mockUser: User
  let ctx: RequestContext

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
          isGlobal: true,
        }),
      ],
      providers: [CompanyNoteService, PrismaService],
    }).compile()

    companyNoteService = module.get<CompanyNoteService>(CompanyNoteService)
    prismaService = module.get<PrismaService>(PrismaService)
  })

  beforeEach(async () => {
    // Clean up in order of dependency to avoid foreign key errors
    await prisma.companyNote.deleteMany()
    await prisma.company.deleteMany()
    await prisma.user.deleteMany()
    await prisma.channel.deleteMany()

    // Create consistent test data
    const channel1 = await prisma.channel.create({
      data: { name: 'Note Tenant A', token: 'token-note-a' },
    })
    const channel2 = await prisma.channel.create({
      data: { name: 'Note Tenant B', token: 'token-note-b' },
    })
    channel1Token = channel1.token
    channel2Token = channel2.token

    mockUser = await prisma.user.create({
      data: {
        email: 'note-user@test.com',
        name: 'Note User',
        password: '...',
        channelToken: channel1Token,
      },
    })
    ctx = new RequestContext({
      user: {
        id: mockUser.id,
        name: mockUser.name || '',
        email: mockUser.email,
      },
      channel: { token: channel1Token },
    })

    companyInChannel1 = await prisma.company.create({
      data: { name: 'Active Company', channelToken: channel1Token },
    })
    softDeletedCompany = await prisma.company.create({
      data: {
        name: 'Deleted Company',
        channelToken: channel1Token,
        deletedAt: new Date(),
      },
    })
  })

  afterAll(async () => {
    // Final cleanup
    await prisma.companyNote.deleteMany()
    await prisma.company.deleteMany()
    await prisma.user.deleteMany()
    await prisma.channel.deleteMany()
    await prismaService.$disconnect()
    await prisma.$disconnect()
  })

  // --- Testing `addNoteToCompany` ---
  describe('addNoteToCompany', () => {
    const input: AddCompanyNoteInput = { content: 'This is a test note.' }

    it('should successfully add a note to an active company', async () => {
      // ACT
      const result = await companyNoteService.addNoteToCompany(
        ctx,
        companyInChannel1.id,
        input,
      )

      // ASSERT
      expect(result).toBeDefined()
      expect(result.content).toBe(input.content)
      expect(result.companyId).toBe(companyInChannel1.id)
      expect(result.userId).toBe(mockUser.id)

      const noteInDb = await prisma.companyNote.findUnique({
        where: { id: result.id },
      })
      expect(noteInDb).toBeDefined()
    })

    it('should throw CompanyNotFoundError when adding a note to a non-existent company', async () => {
      // Why: This tests the service's precondition check. The service should
      // fail fast and gracefully if the parent entity (Company) doesn't exist.
      await expect(
        companyNoteService.addNoteToCompany(ctx, 'non-existent-id', input),
      ).rejects.toThrow(CompanyNotFoundError)
    })

    it('should throw CompanyNotFoundError when adding a note to a soft-deleted company', async () => {
      // Why: This is a critical state validation. A soft-deleted company should
      // behave as if it's non-existent for operations like adding new data to it.
      await expect(
        companyNoteService.addNoteToCompany(ctx, softDeletedCompany.id, input),
      ).rejects.toThrow(CompanyNotFoundError)
    })

    it('should throw an error if user context is missing', async () => {
      const ctxWithoutUser = new RequestContext({
        channel: { token: channel1Token },
      })
      await expect(
        companyNoteService.addNoteToCompany(
          ctxWithoutUser,
          companyInChannel1.id,
          input,
        ),
      ).rejects.toThrow('User context is invalid.')
    })
  })

  // --- Testing `getNotesForCompany` ---
  describe('getNotesForCompany', () => {
    beforeEach(async () => {
      // Seed notes for this specific company
      for (let i = 0; i < 3; i++) {
        await companyNoteService.addNoteToCompany(ctx, companyInChannel1.id, {
          content: `Note ${i}`,
        })
      }
    })

    it('should retrieve all notes for a specific company', async () => {
      const result = await companyNoteService.getNotesForCompany(
        ctx,
        companyInChannel1.id,
        {},
      )

      expect(result.items.length).toBe(3)
      expect(result.totalCount).toBe(3)
      expect(result.items[0].content).toBe('Note 2') // desc order
    })

    it('should throw CompanyNotFoundError if the company does not exist', async () => {
      await expect(
        companyNoteService.getNotesForCompany(ctx, 'non-existent-id', {}),
      ).rejects.toThrow(CompanyNotFoundError)
    })
  })

  // --- Testing `updateCompanyNote` and `deleteCompanyNote` ---
  describe('updateCompanyNote and deleteCompanyNote', () => {
    let noteToModify: { id: string }

    beforeEach(async () => {
      // Create a single note to be updated/deleted in these tests
      noteToModify = await companyNoteService.addNoteToCompany(
        ctx,
        companyInChannel1.id,
        { content: 'Original Content' },
      )
    })

    it('should successfully update a note', async () => {
      // ACT
      const updatedNote = await companyNoteService.updateCompanyNote(
        ctx,
        noteToModify.id,
        { content: 'Updated Content' },
      )

      // ASSERT
      expect(updatedNote.content).toBe('Updated Content')
      const noteInDb = await prisma.companyNote.findUnique({
        where: { id: noteToModify.id },
      })
      expect(noteInDb?.content).toBe('Updated Content')
    })

    it('should throw CompanyNoteNotFoundError when updating a note in another tenant', async () => {
      // Why: Security and data isolation check. Can a user from Channel B,
      // even if they guess a valid note ID, modify a note in Channel A? This
      // test proves they cannot because our service correctly scopes the query.
      const ctxForChannelB = new RequestContext({
        user: {
          id: mockUser.id,
          name: mockUser.name || '',
          email: mockUser.email,
        },
        channel: { token: channel2Token },
      })

      await expect(
        companyNoteService.updateCompanyNote(ctxForChannelB, noteToModify.id, {
          content: 'Malicious Update',
        }),
      ).rejects.toThrow(CompanyNoteNotFoundError)
    })

    it('should successfully hard delete a note', async () => {
      // ACT
      await companyNoteService.deleteCompanyNote(ctx, noteToModify.id)

      // ASSERT
      // Why: For a hard delete, the ultimate proof is that the record is gone.
      // We query the database directly and expect to find nothing.
      const noteInDb = await prisma.companyNote.findUnique({
        where: { id: noteToModify.id },
      })
      expect(noteInDb).toBeNull()
    })

    it('should throw CompanyNoteNotFoundError when deleting a non-existent note', async () => {
      await expect(
        companyNoteService.deleteCompanyNote(ctx, 'non-existent-id'),
      ).rejects.toThrow(CompanyNoteNotFoundError)
    })
  })
})
