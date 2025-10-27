// eslint-disable @typescript-eslint/no-unsafe-argument
import {
  ConflictException,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { AttributableType, Prisma } from '@prisma/client'
import { EntityNotFoundException } from 'src/common/exceptions'
import { RequestContext } from 'src/common/request-context/request-context'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { DeepMocked } from 'src/common/test/types/deep-mocked.type'
import { CreateCompanyInput } from 'src/modules/company/api/graphql/dto/create-company.input'
import { UpdateCompanyInput } from 'src/modules/company/api/graphql/dto/update-company.input'
import { CompanyService } from '../application/services/company.service'

// Mock logger to prevent console output during tests
beforeAll(() => {
  jest.spyOn(Logger.prototype, 'log').mockImplementation(jest.fn())
  jest.spyOn(Logger.prototype, 'error').mockImplementation(jest.fn())
  jest.spyOn(Logger.prototype, 'warn').mockImplementation(jest.fn())
})

describe('CompanyService', () => {
  let service: CompanyService
  let prisma: DeepMocked<PrismaService>

  const mockUserId = 'user-id-123'
  const mockChannelToken = 'channel-token-abc'
  const mockRequestContext = new RequestContext({
    user: { id: mockUserId, name: 'Test User', email: 'test@user.com' },
    jwtPayload: { sub: mockUserId },
    channel: {
      token: mockChannelToken,
    },
  })

  const createPrismaNotFoundError = () => {
    return new Prisma.PrismaClientKnownRequestError(
      'An operation failed because it depends on one or more records that were required but not found.',
      { code: 'P2025', clientVersion: '4.x.x' },
    )
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn(),
            company: {
              create: jest.fn(),
              findMany: jest.fn(),
              count: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
            },
            attributeValue: {
              findMany: jest.fn(),
            },
            attributeAssignment: {
              createMany: jest.fn(),
              deleteMany: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile()

    service = module.get<CompanyService>(CompanyService)
    prisma = module.get(PrismaService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('createCompany', () => {
    const createCompanyInput: CreateCompanyInput = {
      name: 'Test Corp',
      website: 'https://testcorp.com',
      email: 'contact@testcorp.com',
    }
    const mockCompany = { id: 'company-id-1', ...createCompanyInput }

    it('should create a company within a transaction', async () => {
      const mockTx = {
        company: { create: jest.fn().mockResolvedValue(mockCompany) },
        attributeValue: { findMany: jest.fn() },
        attributeAssignment: { createMany: jest.fn() },
      }
      prisma.$transaction.mockImplementation(async (fn) => fn(mockTx as any))

      const result = await service.createCompany(
        mockRequestContext,
        createCompanyInput,
      )

      expect(prisma.$transaction).toHaveBeenCalledTimes(1)
      expect(mockTx.company.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ name: 'Test Corp' }),
      })
      expect(result).toEqual(mockCompany)
    })

    it('should throw ConflictException for invalid addressAttributeCodes', async () => {
      const input = {
        ...createCompanyInput,
        addressAttributeCodes: ['invalid-code'],
      }
      const mockTx = {
        attributeValue: { findMany: jest.fn().mockResolvedValue([]) },
      }
      prisma.$transaction.mockImplementation(async (fn) => fn(mockTx as any))

      await expect(
        service.createCompany(mockRequestContext, input),
      ).rejects.toThrow(ConflictException)
    })

    it('should throw ConflictException for invalid attributeIds', async () => {
      const input = { ...createCompanyInput, attributeIds: ['invalid-id'] }
      const mockTx = {
        attributeValue: { findMany: jest.fn().mockResolvedValue([]) },
      }
      prisma.$transaction.mockImplementation(async (fn) => fn(mockTx as any))

      await expect(
        service.createCompany(mockRequestContext, input),
      ).rejects.toThrow(ConflictException)
    })

    it('should throw InternalServerErrorException if channel token is missing', async () => {
      const ctxWithoutToken = new RequestContext({
        user: mockRequestContext.user,
        channel: {},
      })
      await expect(
        service.createCompany(ctxWithoutToken, createCompanyInput),
      ).rejects.toThrow(InternalServerErrorException)
    })

    it('should correctly create assignments for valid attributes', async () => {
      const input = {
        ...createCompanyInput,
        attributeIds: ['attr-id-1'],
        addressAttributeCodes: ['addr-code-1'],
      }
      const mockTx = {
        company: { create: jest.fn().mockResolvedValue(mockCompany) },
        attributeValue: {
          findMany: jest
            .fn()
            .mockResolvedValueOnce([{ id: 'addr-val-1', code: 'addr-code-1' }]) // For address codes
            .mockResolvedValueOnce([{ id: 'attr-id-1' }]), // For attribute IDs
        },
        attributeAssignment: { createMany: jest.fn() },
      }
      prisma.$transaction.mockImplementation(async (fn) => fn(mockTx as any))

      await service.createCompany(mockRequestContext, input)

      expect(mockTx.attributeAssignment.createMany).toHaveBeenCalledWith({
        data: expect.arrayContaining([
          expect.objectContaining({ attributeValueId: 'attr-id-1' }),
          expect.objectContaining({ attributeValueId: 'addr-val-1' }),
        ]),
      })
    })
  })

  describe('getCompanies', () => {
    it('should fetch companies with default pagination and context channel token', async () => {
      prisma.company.findMany.mockResolvedValue([])
      prisma.company.count.mockResolvedValue(0)

      await service.getCompanies(mockRequestContext, {})

      expect(prisma.company.findMany).toHaveBeenCalledWith({
        where: { deletedAt: null, channelToken: mockChannelToken },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
      })
      expect(prisma.company.count).toHaveBeenCalledWith({
        where: { deletedAt: null, channelToken: mockChannelToken },
      })
    })

    it('should filter by searchQuery', async () => {
      const searchQuery = 'Test'
      await service.getCompanies(mockRequestContext, { searchQuery })

      expect(prisma.company.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            deletedAt: null,
            channelToken: mockChannelToken,
            OR: [
              { name: { contains: searchQuery, mode: 'insensitive' } },
              { description: { contains: searchQuery, mode: 'insensitive' } },
            ],
          },
        }),
      )
    })

    it('should filter by address parts', async () => {
      const address = 'country-city'
      await service.getCompanies(mockRequestContext, { address })

      expect(prisma.company.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            deletedAt: null,
            channelToken: mockChannelToken,
            AND: [
              {
                attributeAssignments: {
                  some: { attributeValue: { code: 'country' } },
                },
              },
              {
                attributeAssignments: {
                  some: { attributeValue: { code: 'city' } },
                },
              },
            ],
          },
        }),
      )
    })

    it('should throw InternalServerErrorException on database error', async () => {
      prisma.company.findMany.mockRejectedValue(new Error('DB Error'))
      await expect(
        service.getCompanies(mockRequestContext, {}),
      ).rejects.toThrow(InternalServerErrorException)
    })
  })

  describe('getCompanyById', () => {
    const companyId = 'company-id-1'
    const mockCompany = { id: companyId, name: 'Test Co' }

    it('should return a company if found', async () => {
      prisma.company.findFirst.mockResolvedValue(mockCompany as any)
      const result = await service.getCompanyById(mockRequestContext, companyId)
      expect(prisma.company.findFirst).toHaveBeenCalledWith({
        where: {
          id: companyId,
          channelToken: mockChannelToken,
          deletedAt: null,
        },
        include: expect.any(Object),
      })
      expect(result).toEqual(mockCompany)
    })

    it('should throw EntityNotFoundException if company not found', async () => {
      prisma.company.findFirst.mockResolvedValue(null)
      await expect(
        service.getCompanyById(mockRequestContext, 'non-existent-id'),
      ).rejects.toThrow(
        new EntityNotFoundException('Company', 'non-existent-id'),
      )
    })
  })

  describe('updateCompany', () => {
    const companyId = 'company-id-1'
    const updateInput: UpdateCompanyInput = { name: 'Updated Name' }
    const mockCompany = { id: companyId, name: 'Old Name' }

    it('should update a company within a transaction', async () => {
      prisma.company.findFirst.mockResolvedValue(mockCompany as any)
      const mockTx = {
        company: {
          update: jest
            .fn()
            .mockResolvedValue({ ...mockCompany, ...updateInput }),
        },
        attributeValue: { findMany: jest.fn() },
        attributeAssignment: { deleteMany: jest.fn() },
      }
      prisma.$transaction.mockImplementation(async (fn) => fn(mockTx as any))

      const result = await service.updateCompany(
        mockRequestContext,
        companyId,
        updateInput,
      )

      expect(prisma.company.findFirst).toHaveBeenCalledWith({
        where: {
          id: companyId,
          channelToken: mockChannelToken,
          deletedAt: null,
        },
      })
      expect(prisma.$transaction).toHaveBeenCalledTimes(1)
      expect(mockTx.attributeAssignment.deleteMany).toHaveBeenCalledWith({
        where: {
          attributableId: companyId,
          attributableType: AttributableType.COMPANY,
        },
      })
      expect(mockTx.company.update).toHaveBeenCalledWith(expect.any(Object))
      expect(result.name).toBe('Updated Name')
    })

    it('should throw EntityNotFoundException if company to update is not found', async () => {
      prisma.company.findFirst.mockResolvedValue(null)
      await expect(
        service.updateCompany(mockRequestContext, 'non-existent', updateInput),
      ).rejects.toThrow(EntityNotFoundException)
    })

    it('should throw ConflictException on invalid attribute IDs', async () => {
      prisma.company.findFirst.mockResolvedValue(mockCompany as any)
      const mockTx = {
        attributeValue: { findMany: jest.fn().mockResolvedValue([]) },
      }
      prisma.$transaction.mockImplementation(async (fn) => fn(mockTx as any))

      await expect(
        service.updateCompany(mockRequestContext, companyId, {
          ...updateInput,
          attributeIds: ['invalid-id'],
        }),
      ).rejects.toThrow(ConflictException)
    })

    it('should throw UnauthorizedException if context is invalid', async () => {
      const invalidCtx = new RequestContext({ channel: {} }) // no token or user
      await expect(
        service.updateCompany(invalidCtx, companyId, updateInput),
      ).rejects.toThrow(UnauthorizedException)
    })
  })

  describe('deleteCompany', () => {
    const companyId = 'company-id-1'
    const mockCompany = { id: companyId, name: 'Test Co', deletedAt: null }

    it('should soft delete a company', async () => {
      prisma.company.findFirst.mockResolvedValue(mockCompany as any)
      prisma.company.update.mockResolvedValue({
        ...mockCompany,
        deletedAt: new Date(),
      } as any)

      const result = await service.deleteCompany(mockRequestContext, companyId)

      expect(prisma.company.findFirst).toHaveBeenCalledWith({
        where: {
          id: companyId,
          deletedAt: null,
          channelToken: mockChannelToken,
        },
      })
      expect(prisma.company.update).toHaveBeenCalledWith({
        where: { id: companyId, channelToken: mockChannelToken },
        data: { deletedAt: expect.any(Date) },
      })
      expect(result.deletedAt).not.toBeNull()
    })

    it('should throw EntityNotFoundException if company is not found for deletion', async () => {
      prisma.company.findFirst.mockResolvedValue(null)
      await expect(
        service.deleteCompany(mockRequestContext, companyId),
      ).rejects.toThrow(EntityNotFoundException)
    })

    it('should throw EntityNotFoundException if update fails with P2025', async () => {
      prisma.company.findFirst.mockResolvedValue(mockCompany as any)
      prisma.company.update.mockRejectedValue(createPrismaNotFoundError())
      await expect(
        service.deleteCompany(mockRequestContext, companyId),
      ).rejects.toThrow(EntityNotFoundException)
    })
  })

  describe('getCompanyAttributes', () => {
    const companyId = 'company-id-1'

    it('should return attributes for a company', async () => {
      const mockAttributes = [
        {
          id: 'val-1',
          value: 'Value 1',
          attributeTypeId: 'type-1',
          type: { name: 'Type 1' },
        },
      ]
      prisma.attributeValue.findMany.mockResolvedValue(mockAttributes as any)

      const result = await service.getCompanyAttributes(
        mockRequestContext,
        companyId,
      )

      expect(prisma.attributeValue.findMany).toHaveBeenCalledWith({
        where: {
          channelToken: mockChannelToken,
          deletedAt: null,
          assignments: { some: { companyId } },
        },
        include: { type: true },
      })
      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        id: 'val-1',
        name: 'Type 1',
        value: 'Value 1',
        attributeTypeId: 'type-1',
        type: { name: 'Type 1' },
      })
    })

    it('should throw UnauthorizedException if channel token is missing', async () => {
      const invalidCtx = new RequestContext({ channel: {} })
      await expect(
        service.getCompanyAttributes(invalidCtx, companyId),
      ).rejects.toThrow(UnauthorizedException)
    })
  })

  describe('getAssignmentsForCompany', () => {
    const companyId = 'company-id-1'

    it('should return assignments for a company', async () => {
      const mockAssignments = [{ id: 'assign-1', attributableId: companyId }]
      prisma.attributeAssignment.findMany.mockResolvedValue(
        mockAssignments as any,
      )

      const result = await service.getAssignmentsForCompany(
        mockRequestContext,
        companyId,
      )

      expect(prisma.attributeAssignment.findMany).toHaveBeenCalledWith({
        where: {
          attributableId: companyId,
          attributableType: 'COMPANY',
          channelToken: mockChannelToken,
        },
        include: expect.any(Object),
      })
      expect(result).toEqual(mockAssignments)
    })

    it('should throw UnauthorizedException if channel token is missing', async () => {
      const invalidCtx = new RequestContext({ channel: {} })
      await expect(
        service.getAssignmentsForCompany(invalidCtx, companyId),
      ).rejects.toThrow(UnauthorizedException)
    })
  })
})
