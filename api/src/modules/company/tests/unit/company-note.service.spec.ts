import { Test, TestingModule } from '@nestjs/testing'
import { CompanyNoteService } from '../../application/services/company-note.service'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import {
  CtxUser,
  RequestContext,
} from 'src/common/request-context/request-context'
import { DeepMocked } from 'src/common/test/types/deep-mocked.type'
import { InternalServerErrorException, Logger } from '@nestjs/common'

import { Prisma, Company, CompanyNote } from '@prisma/client'
import { AddCompanyNoteInput } from '../../api/graphql/dto/add-company-note.input'
import { CompanyNotFoundError } from '../../domain/exceptions/company-not-found.exception'
import { PaginationArgs } from 'src/common'
import { UpdateCompanyNoteInput } from '../../api/graphql/dto/update-company-note.input'
import { CompanyNoteNotFoundError } from '../../domain/exceptions/company-note-not-found.exception'

// Mock Logger
beforeAll(() => {
  jest.spyOn(Logger.prototype, 'log').mockImplementation(jest.fn())
  jest.spyOn(Logger.prototype, 'error').mockImplementation(jest.fn())
  jest.spyOn(Logger.prototype, 'warn').mockImplementation(jest.fn())
})

const createPrismaNotFoundError = (
  message = 'Record to update/delete not found.',
) => {
  return new Prisma.PrismaClientKnownRequestError(message, {
    code: 'P2025',
    clientVersion: 'mock-prisma-client-version',
    meta: { cause: 'Record to update/delete not found' },
  })
}

describe('CompanyNoteService', () => {
  let service: CompanyNoteService
  let prisma: DeepMocked<PrismaService>

  const mockUserId = 'user-uuid-123'
  const mockUserEmail = 'testuser@example.com'
  const mockUserName = 'Test User'
  const mockCtxUser: CtxUser = {
    id: mockUserId,
    email: mockUserEmail,
    name: mockUserName,
  }
  const mockChannelToken = 'channel-uuid-abc'
  const mockRequestContext = new RequestContext({
    user: mockCtxUser,
    channel: { token: mockChannelToken },
  })
  const mockRequestContextWithoutUser = new RequestContext({
    user: undefined,
    channel: { token: mockChannelToken },
  })

  const mockCompanyId = 'company-uuid-456'
  const mockExistingCompany: Company = {
    id: mockCompanyId,
    name: 'Test Company',
    channelToken: mockChannelToken,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    website: null,
    industry: null,
    linkedinUrl: null,
    address: Prisma.JsonNull as any,
    description: null,
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyNoteService,
        {
          provide: PrismaService,
          useValue: {
            company: {
              findFirst: jest.fn(),
            },
            companyNote: {
              create: jest.fn(),
              findMany: jest.fn(),
              count: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile()

    service = module.get<CompanyNoteService>(CompanyNoteService)
    prisma = module.get(PrismaService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('addNoteToCompany', () => {
    const mockAddNoteInput: AddCompanyNoteInput = {
      content: 'This is a test note.',
      type: 'GENERAL',
    }
    const mockCompanyNoteId = 'note-uuid-789'
    const mockCreatedCompanyNote: CompanyNote = {
      id: mockCompanyNoteId,
      companyId: mockCompanyId,
      userId: mockUserId,
      channelToken: mockChannelToken,
      content: mockAddNoteInput.content,
      type: mockAddNoteInput.type || 'GENERAL',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    it('should add a note using context channelToken if arg is not provided', async () => {
      prisma.company.findFirst.mockResolvedValue(mockExistingCompany)
      prisma.companyNote.create.mockResolvedValue(mockCreatedCompanyNote)

      const result = await service.addNoteToCompany(
        mockRequestContext,
        mockCompanyId,
        mockAddNoteInput,
      )

      expect(prisma.company.findFirst).toHaveBeenCalledWith({
        where: {
          id: mockCompanyId,
          deletedAt: null,
          channelToken: mockChannelToken,
        },
      })
      expect(prisma.companyNote.create).toHaveBeenCalledWith({
        data: {
          ...mockAddNoteInput,
          companyId: mockCompanyId,
          userId: mockUserId,
          channelToken: mockChannelToken,
        },
      })
      expect(result).toEqual(mockCreatedCompanyNote)
    })

    it('should add a note using provided channelToken arg, overriding context', async () => {
      const explicitChannelToken = 'explicit-channel-for-note'
      const companyWithExplicitToken = {
        ...mockExistingCompany,
        channelToken: explicitChannelToken,
      }
      const noteWithExplicitToken = {
        ...mockCreatedCompanyNote,
        channelToken: explicitChannelToken,
      }

      prisma.company.findFirst.mockResolvedValue(companyWithExplicitToken)
      prisma.companyNote.create.mockResolvedValue(noteWithExplicitToken)

      const result = await service.addNoteToCompany(
        mockRequestContext,
        mockCompanyId,
        mockAddNoteInput,
        explicitChannelToken,
      )

      expect(prisma.company.findFirst).toHaveBeenCalledWith({
        where: {
          id: mockCompanyId,
          deletedAt: null,
          channelToken: explicitChannelToken,
        },
      })
      expect(prisma.companyNote.create).toHaveBeenCalledWith({
        data: {
          ...mockAddNoteInput,
          companyId: mockCompanyId,
          userId: mockUserId,
          channelToken: explicitChannelToken,
        },
      })
      expect(result.channelToken).toBe(explicitChannelToken)
    })

    it('should throw InternalServerErrorException if user ID is missing from context', async () => {
      await expect(
        service.addNoteToCompany(
          mockRequestContextWithoutUser,
          mockCompanyId,
          mockAddNoteInput,
        ),
      ).rejects.toThrow(InternalServerErrorException)
      await expect(
        service.addNoteToCompany(
          mockRequestContextWithoutUser,
          mockCompanyId,
          mockAddNoteInput,
        ),
      ).rejects.toThrow('User context is invalid.')
      expect(prisma.company.findFirst).not.toHaveBeenCalled()
      expect(prisma.companyNote.create).not.toHaveBeenCalled()
    })

    it('should throw CompanyNotFoundError if company does not exist or is soft-deleted', async () => {
      prisma.company.findFirst.mockResolvedValue(null)

      await expect(
        service.addNoteToCompany(
          mockRequestContext,
          mockCompanyId,
          mockAddNoteInput,
        ),
      ).rejects.toThrow(new CompanyNotFoundError(mockCompanyId))
      expect(prisma.companyNote.create).not.toHaveBeenCalled()
    })

    it('should throw InternalServerErrorException if prisma.company.findFirst fails unexpectedly', async () => {
      const dbError = new Error('DB findFirst failed')
      prisma.company.findFirst.mockRejectedValue(dbError)

      await expect(
        service.addNoteToCompany(
          mockRequestContext,
          mockCompanyId,
          mockAddNoteInput,
        ),
      ).rejects.toThrow(InternalServerErrorException)
      await expect(
        service.addNoteToCompany(
          mockRequestContext,
          mockCompanyId,
          mockAddNoteInput,
        ),
      ).rejects.toThrow('Could not add note to company.')
      expect(prisma.companyNote.create).not.toHaveBeenCalled()
    })

    it('should throw InternalServerErrorException if prisma.companyNote.create fails', async () => {
      prisma.company.findFirst.mockResolvedValue(mockExistingCompany)
      const dbError = new Error('DB create failed')
      prisma.companyNote.create.mockRejectedValue(dbError)

      await expect(
        service.addNoteToCompany(
          mockRequestContext,
          mockCompanyId,
          mockAddNoteInput,
        ),
      ).rejects.toThrow(InternalServerErrorException)
      await expect(
        service.addNoteToCompany(
          mockRequestContext,
          mockCompanyId,
          mockAddNoteInput,
        ),
      ).rejects.toThrow('Could not add note to company.')
    })
  })

  describe('getNotesForCompany', () => {
    const mockPaginationArgs: PaginationArgs = { skip: 0, take: 10 }
    const mockCompanyNote1: CompanyNote = {
      id: 'note-uuid-1',
      companyId: mockCompanyId,
      userId: mockUserId,
      channelToken: mockChannelToken,
      content: 'Note 1 content',
      type: 'MEETING',
      createdAt: new Date(Date.now() - 10000),
      updatedAt: new Date(Date.now() - 10000),
    }
    const mockCompanyNote2: CompanyNote = {
      id: 'note-uuid-2',
      companyId: mockCompanyId,
      userId: mockUserId,
      channelToken: mockChannelToken,
      content: 'Note 2 content',
      type: 'CALL',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const mockNotesList = [mockCompanyNote2, mockCompanyNote1] // Ordered by createdAt desc
    const mockTotalCount = mockNotesList.length

    it('should get notes using context channelToken if arg not provided', async () => {
      prisma.company.findFirst.mockResolvedValue(mockExistingCompany)
      prisma.companyNote.findMany.mockResolvedValue(mockNotesList)
      prisma.companyNote.count.mockResolvedValue(mockTotalCount)

      const result = await service.getNotesForCompany(
        mockRequestContext,
        mockCompanyId,
        mockPaginationArgs,
      )

      expect(prisma.company.findFirst).toHaveBeenCalledWith({
        where: {
          id: mockCompanyId,
          deletedAt: null,
          channelToken: mockChannelToken,
        },
      })
      const expectedWhereClause = {
        companyId: mockCompanyId,
        channelToken: mockChannelToken,
      }
      expect(prisma.companyNote.findMany).toHaveBeenCalledWith({
        where: expectedWhereClause,
        skip: mockPaginationArgs.skip,
        take: mockPaginationArgs.take,
        orderBy: { createdAt: 'desc' },
      })
      expect(prisma.companyNote.count).toHaveBeenCalledWith({
        where: expectedWhereClause,
      })
      expect(result.items).toEqual(mockNotesList)
      expect(result.totalCount).toBe(mockTotalCount)
    })

    it('should get notes using provided channelToken arg, overriding context', async () => {
      const explicitChannelToken = 'explicit-channel-for-get-notes'
      const companyWithExplicitToken = {
        ...mockExistingCompany,
        channelToken: explicitChannelToken,
      }
      const notesWithExplicitToken = mockNotesList.map((n) => ({
        ...n,
        channelToken: explicitChannelToken,
      }))

      prisma.company.findFirst.mockResolvedValue(companyWithExplicitToken)
      prisma.companyNote.findMany.mockResolvedValue(notesWithExplicitToken)
      prisma.companyNote.count.mockResolvedValue(notesWithExplicitToken.length)

      const result = await service.getNotesForCompany(
        mockRequestContext,
        mockCompanyId,
        mockPaginationArgs,
        explicitChannelToken,
      )

      expect(prisma.company.findFirst).toHaveBeenCalledWith({
        where: {
          id: mockCompanyId,
          deletedAt: null,
          channelToken: explicitChannelToken,
        },
      })
      const expectedWhereClause = {
        companyId: mockCompanyId,
        channelToken: explicitChannelToken,
      }
      expect(prisma.companyNote.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expectedWhereClause }),
      )
      expect(prisma.companyNote.count).toHaveBeenCalledWith({
        where: expectedWhereClause,
      })
      expect(
        result.items.every(
          (item) => item.channelToken === explicitChannelToken,
        ),
      ).toBe(true)
    })

    it('should correctly apply pagination (skip, take)', async () => {
      const customPagination: PaginationArgs = { skip: 1, take: 1 }
      prisma.company.findFirst.mockResolvedValue(mockExistingCompany)
      prisma.companyNote.findMany.mockResolvedValue([mockCompanyNote1]) // Only second note (index 1) after skipping 1
      prisma.companyNote.count.mockResolvedValue(mockTotalCount) // Total count remains the same

      await service.getNotesForCompany(
        mockRequestContext,
        mockCompanyId,
        customPagination,
      )

      expect(prisma.companyNote.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: customPagination.skip,
          take: customPagination.take,
        }),
      )
    })

    it('should throw CompanyNotFoundError if company does not exist or is soft-deleted', async () => {
      prisma.company.findFirst.mockResolvedValue(null)

      await expect(
        service.getNotesForCompany(
          mockRequestContext,
          mockCompanyId,
          mockPaginationArgs,
        ),
      ).rejects.toThrow(new CompanyNotFoundError(mockCompanyId))
      expect(prisma.companyNote.findMany).not.toHaveBeenCalled()
      expect(prisma.companyNote.count).not.toHaveBeenCalled()
    })

    it('should throw InternalServerErrorException if prisma.company.findFirst fails', async () => {
      const dbError = new Error('DB findFirst failed')
      prisma.company.findFirst.mockRejectedValue(dbError)

      await expect(
        service.getNotesForCompany(
          mockRequestContext,
          mockCompanyId,
          mockPaginationArgs,
        ),
      ).rejects.toThrow(InternalServerErrorException)
      await expect(
        service.getNotesForCompany(
          mockRequestContext,
          mockCompanyId,
          mockPaginationArgs,
        ),
      ).rejects.toThrow('Could not fetch notes.')
    })

    it('should throw InternalServerErrorException if prisma.companyNote.findMany fails', async () => {
      prisma.company.findFirst.mockResolvedValue(mockExistingCompany)
      const dbError = new Error('DB findMany notes failed')
      prisma.companyNote.findMany.mockRejectedValue(dbError)
      // prisma.companyNote.count might still be called if Promise.all setup in service is not failing early
      // or if it's called before findMany in a sequential manner (depends on Promise.all behavior)
      // For robustness, we can assume count might still resolve or also fail.
      prisma.companyNote.count.mockResolvedValue(0) // Or mockRejectedValue for a more specific test if needed

      await expect(
        service.getNotesForCompany(
          mockRequestContext,
          mockCompanyId,
          mockPaginationArgs,
        ),
      ).rejects.toThrow(InternalServerErrorException)
      await expect(
        service.getNotesForCompany(
          mockRequestContext,
          mockCompanyId,
          mockPaginationArgs,
        ),
      ).rejects.toThrow('Could not fetch notes.')
    })

    it('should throw InternalServerErrorException if prisma.companyNote.count fails', async () => {
      prisma.company.findFirst.mockResolvedValue(mockExistingCompany)
      prisma.companyNote.findMany.mockResolvedValue([]) // findMany might succeed
      const dbError = new Error('DB count notes failed')
      prisma.companyNote.count.mockRejectedValue(dbError)

      await expect(
        service.getNotesForCompany(
          mockRequestContext,
          mockCompanyId,
          mockPaginationArgs,
        ),
      ).rejects.toThrow(InternalServerErrorException)
      await expect(
        service.getNotesForCompany(
          mockRequestContext,
          mockCompanyId,
          mockPaginationArgs,
        ),
      ).rejects.toThrow('Could not fetch notes.')
    })
  })

  describe('updateCompanyNote', () => {
    const mockNoteId = 'note-to-update-uuid'
    const mockUpdateNoteInput: UpdateCompanyNoteInput = {
      content: 'Updated note content.',
      type: 'TASK',
    }
    const mockExistingCompanyNote: CompanyNote = {
      id: mockNoteId,
      companyId: mockCompanyId,
      userId: mockUserId,
      channelToken: mockChannelToken,
      content: 'Original content',
      type: 'GENERAL',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const mockUpdatedCompanyNote: CompanyNote = {
      ...mockExistingCompanyNote,
      ...mockUpdateNoteInput,
      updatedAt: new Date(Date.now() + 5000), // Ensure updatedAt is different
    }

    it('should update a note using context channelToken if arg not provided', async () => {
      prisma.companyNote.findUnique.mockResolvedValue(mockExistingCompanyNote)
      prisma.companyNote.update.mockResolvedValue(mockUpdatedCompanyNote)

      const result = await service.updateCompanyNote(
        mockRequestContext,
        mockNoteId,
        mockUpdateNoteInput,
      )

      expect(prisma.companyNote.findUnique).toHaveBeenCalledWith({
        where: { id: mockNoteId, channelToken: mockChannelToken },
      })
      expect(prisma.companyNote.update).toHaveBeenCalledWith({
        where: { id: mockNoteId, channelToken: mockChannelToken },
        data: mockUpdateNoteInput,
      })
      expect(result).toEqual(mockUpdatedCompanyNote)
    })

    it('should update a note using provided channelToken arg, overriding context', async () => {
      const explicitChannelToken = 'explicit-channel-for-update-note'
      const noteWithExplicitToken = {
        ...mockExistingCompanyNote,
        channelToken: explicitChannelToken,
      }
      const updatedNoteWithExplicitToken = {
        ...mockUpdatedCompanyNote,
        channelToken: explicitChannelToken,
      }

      prisma.companyNote.findUnique.mockResolvedValue(noteWithExplicitToken)
      prisma.companyNote.update.mockResolvedValue(updatedNoteWithExplicitToken)

      const result = await service.updateCompanyNote(
        mockRequestContext,
        mockNoteId,
        mockUpdateNoteInput,
        explicitChannelToken,
      )

      expect(prisma.companyNote.findUnique).toHaveBeenCalledWith({
        where: { id: mockNoteId, channelToken: explicitChannelToken },
      })
      expect(prisma.companyNote.update).toHaveBeenCalledWith({
        where: { id: mockNoteId, channelToken: explicitChannelToken },
        data: mockUpdateNoteInput,
      })
      expect(result.channelToken).toBe(explicitChannelToken)
    })

    it('should throw InternalServerErrorException if user ID is missing', async () => {
      await expect(
        service.updateCompanyNote(
          mockRequestContextWithoutUser,
          mockNoteId,
          mockUpdateNoteInput,
        ),
      ).rejects.toThrow(InternalServerErrorException)
      await expect(
        service.updateCompanyNote(
          mockRequestContextWithoutUser,
          mockNoteId,
          mockUpdateNoteInput,
        ),
      ).rejects.toThrow('User context is invalid.')
      expect(prisma.companyNote.findUnique).not.toHaveBeenCalled()
      expect(prisma.companyNote.update).not.toHaveBeenCalled()
    })

    it('should throw CompanyNoteNotFoundError if note to update is not found', async () => {
      prisma.companyNote.findUnique.mockResolvedValue(null)

      await expect(
        service.updateCompanyNote(
          mockRequestContext,
          mockNoteId,
          mockUpdateNoteInput,
        ),
      ).rejects.toThrow(new CompanyNoteNotFoundError(mockNoteId))
      expect(prisma.companyNote.update).not.toHaveBeenCalled()
    })

    it('should throw InternalServerErrorException if prisma.companyNote.findUnique fails', async () => {
      const dbError = new Error('DB findUnique failed')
      prisma.companyNote.findUnique.mockRejectedValue(dbError)

      await expect(
        service.updateCompanyNote(
          mockRequestContext,
          mockNoteId,
          mockUpdateNoteInput,
        ),
      ).rejects.toThrow(InternalServerErrorException)
      await expect(
        service.updateCompanyNote(
          mockRequestContext,
          mockNoteId,
          mockUpdateNoteInput,
        ),
      ).rejects.toThrow('Could not update note.')
      expect(prisma.companyNote.update).not.toHaveBeenCalled()
    })

    it('should throw InternalServerErrorException if prisma.companyNote.update fails', async () => {
      prisma.companyNote.findUnique.mockResolvedValue(mockExistingCompanyNote)
      const dbError = new Error('DB update failed')
      prisma.companyNote.update.mockRejectedValue(dbError)

      await expect(
        service.updateCompanyNote(
          mockRequestContext,
          mockNoteId,
          mockUpdateNoteInput,
        ),
      ).rejects.toThrow(InternalServerErrorException)
      await expect(
        service.updateCompanyNote(
          mockRequestContext,
          mockNoteId,
          mockUpdateNoteInput,
        ),
      ).rejects.toThrow('Could not update note.')
    })
  })

  describe('deleteCompanyNote', () => {
    const mockNoteIdToDelete = 'note-to-delete-uuid'
    const mockExistingCompanyNoteToDelete: CompanyNote = {
      id: mockNoteIdToDelete,
      companyId: mockCompanyId,
      userId: mockUserId,
      channelToken: mockChannelToken,
      content: 'Content to be deleted',
      type: 'ARCHIVED',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    it('should delete a note using context channelToken if arg not provided', async () => {
      prisma.companyNote.findUnique.mockResolvedValue(
        mockExistingCompanyNoteToDelete,
      )
      prisma.companyNote.delete.mockResolvedValue(
        mockExistingCompanyNoteToDelete,
      )

      const result = await service.deleteCompanyNote(
        mockRequestContext,
        mockNoteIdToDelete,
      )

      expect(prisma.companyNote.findUnique).toHaveBeenCalledWith({
        where: { id: mockNoteIdToDelete, channelToken: mockChannelToken },
      })
      expect(prisma.companyNote.delete).toHaveBeenCalledWith({
        where: { id: mockNoteIdToDelete, channelToken: mockChannelToken },
      })
      expect(result).toEqual(mockExistingCompanyNoteToDelete)
    })

    it('should delete a note using provided channelToken arg, overriding context', async () => {
      const explicitChannelToken = 'explicit-channel-for-delete-note'
      const noteWithExplicitToken = {
        ...mockExistingCompanyNoteToDelete,
        channelToken: explicitChannelToken,
      }

      prisma.companyNote.findUnique.mockResolvedValue(noteWithExplicitToken)
      prisma.companyNote.delete.mockResolvedValue(noteWithExplicitToken)

      const result = await service.deleteCompanyNote(
        mockRequestContext,
        mockNoteIdToDelete,
        explicitChannelToken,
      )

      expect(prisma.companyNote.findUnique).toHaveBeenCalledWith({
        where: { id: mockNoteIdToDelete, channelToken: explicitChannelToken },
      })
      expect(prisma.companyNote.delete).toHaveBeenCalledWith({
        where: { id: mockNoteIdToDelete, channelToken: explicitChannelToken },
      })
      expect(result.channelToken).toBe(explicitChannelToken)
    })

    it('should throw InternalServerErrorException if user ID is missing', async () => {
      await expect(
        service.deleteCompanyNote(
          mockRequestContextWithoutUser,
          mockNoteIdToDelete,
        ),
      ).rejects.toThrow(InternalServerErrorException)
      await expect(
        service.deleteCompanyNote(
          mockRequestContextWithoutUser,
          mockNoteIdToDelete,
        ),
      ).rejects.toThrow('User context is invalid.')
      expect(prisma.companyNote.findUnique).not.toHaveBeenCalled()
      expect(prisma.companyNote.delete).not.toHaveBeenCalled()
    })

    it('should throw CompanyNoteNotFoundError if note to delete is not found by findUnique', async () => {
      prisma.companyNote.findUnique.mockResolvedValue(null)

      await expect(
        service.deleteCompanyNote(mockRequestContext, mockNoteIdToDelete),
      ).rejects.toThrow(new CompanyNoteNotFoundError(mockNoteIdToDelete))
      expect(prisma.companyNote.delete).not.toHaveBeenCalled()
    })

    it('should throw CompanyNoteNotFoundError if prisma.companyNote.delete fails with P2025', async () => {
      prisma.companyNote.findUnique.mockResolvedValue(
        mockExistingCompanyNoteToDelete,
      )
      prisma.companyNote.delete.mockRejectedValue(createPrismaNotFoundError()) // Simulate P2025

      await expect(
        service.deleteCompanyNote(mockRequestContext, mockNoteIdToDelete),
      ).rejects.toThrow(new CompanyNoteNotFoundError(mockNoteIdToDelete))
    })

    it('should throw InternalServerErrorException if prisma.companyNote.findUnique fails unexpectedly', async () => {
      const dbError = new Error('DB findUnique failed unexpectedly')
      prisma.companyNote.findUnique.mockRejectedValue(dbError)

      await expect(
        service.deleteCompanyNote(mockRequestContext, mockNoteIdToDelete),
      ).rejects.toThrow(InternalServerErrorException)
      await expect(
        service.deleteCompanyNote(mockRequestContext, mockNoteIdToDelete),
      ).rejects.toThrow('Could not delete note.')
      expect(prisma.companyNote.delete).not.toHaveBeenCalled()
    })

    it('should throw InternalServerErrorException if prisma.companyNote.delete fails with a non-P2025 error', async () => {
      prisma.companyNote.findUnique.mockResolvedValue(
        mockExistingCompanyNoteToDelete,
      )
      const dbError = new Error('DB delete failed with generic error')
      prisma.companyNote.delete.mockRejectedValue(dbError)

      await expect(
        service.deleteCompanyNote(mockRequestContext, mockNoteIdToDelete),
      ).rejects.toThrow(InternalServerErrorException)
      await expect(
        service.deleteCompanyNote(mockRequestContext, mockNoteIdToDelete),
      ).rejects.toThrow('Could not delete note.')
    })
  })
})
