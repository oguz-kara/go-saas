import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { Test, TestingModule } from '@nestjs/testing'
import { CompanyService } from '../../application/services/company.service'
import { RequestContext } from 'src/common/request-context/request-context'
import { CreateCompanyInput } from 'src/modules/company/api/graphql/dto/create-company.input'
import { CompanyEntity } from 'src/modules/company/api/graphql/entities/company.entity'
import { DeepMocked } from 'src/common/test/types/deep-mocked.type'
import { InternalServerErrorException } from '@nestjs/common'
import { CompanyNotFoundError } from '../../domain/exceptions/company-not-found.exception'
import { Logger } from '@nestjs/common'
import { Prisma } from '@prisma/client'

interface MockCompanyEntity extends CompanyEntity {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
  website?: string
  industry?: string
  linkedinUrl?: string
  address?: Record<string, any>
  channelToken?: string
  description?: string
}

const createPrismaNotFoundError = (
  message = 'Record to update/delete not found.',
) => {
  return new Prisma.PrismaClientKnownRequestError(message, {
    code: 'P2025',
    clientVersion: 'your-prisma-client-version', // It's good to put your actual client version here
    meta: { cause: 'Record to update/delete not found' }, // Optional: meta often contains more info
  })
}

beforeAll(() => {
  jest.spyOn(Logger.prototype, 'log').mockImplementation(jest.fn())
  jest.spyOn(Logger.prototype, 'error').mockImplementation(jest.fn())
  jest.spyOn(Logger.prototype, 'warn').mockImplementation(jest.fn())
  jest.spyOn(Logger.prototype, 'debug').mockImplementation(jest.fn())
  jest.spyOn(Logger.prototype, 'verbose').mockImplementation(jest.fn())
})

describe('CompanyService', () => {
  let service: CompanyService
  let prisma: DeepMocked<PrismaService>

  const mockUserId = 'test-user-id'
  const mockChannelToken = 'test-channel-token'
  const mockUserName = 'Test User'
  const mockUserEmail = 'test@example.com'

  const mockRequestContext = new RequestContext({
    user: { id: mockUserId, name: mockUserName, email: mockUserEmail },
    channel: {
      token: mockChannelToken,
    },
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: PrismaService,
          useValue: {
            company: {
              create: jest.fn(),
              findMany: jest.fn(),
              count: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              findFirst: jest.fn(),
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
      name: 'Test Company',
      website: 'http://test.com',
      industry: 'Tech',
      linkedinUrl: 'http://linkedin.com/company/test',
      address: { street: '123 Test St' },
      description: 'A test company.',
    }

    const expectedCompany: MockCompanyEntity = {
      id: 'some-uuid',
      name: createCompanyInput.name,
      website: createCompanyInput.website,
      industry: createCompanyInput.industry,
      linkedinUrl: createCompanyInput.linkedinUrl,
      address: createCompanyInput.address,
      description: createCompanyInput.description,
      channelToken: mockChannelToken,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    it('should call PrismaService.company.create with correct arguments including channelToken from context', async () => {
      prisma.company.create.mockResolvedValue({
        ...expectedCompany,
        website: createCompanyInput.website || null,
        industry: createCompanyInput.industry || null,
        linkedinUrl: createCompanyInput.linkedinUrl || null,
        address: createCompanyInput.address || null,
        description: createCompanyInput.description || null,
        channelToken: mockRequestContext.channel?.token || null,
        deletedAt: null,
      })

      await service.createCompany(mockRequestContext, createCompanyInput)

      expect(prisma.company.create).toHaveBeenCalledTimes(1)
      expect(prisma.company.create).toHaveBeenCalledWith({
        data: {
          name: createCompanyInput.name,
          website: createCompanyInput.website,
          industry: createCompanyInput.industry,
          linkedinUrl: createCompanyInput.linkedinUrl,
          address: createCompanyInput.address,
          description: createCompanyInput.description,
          channelToken: mockRequestContext.channel?.token,
        },
      })
    })

    it('should throw InternalServerErrorException with specific message if channel token is missing from context and not provided as argument', async () => {
      const ctxWithoutChannelToken = new RequestContext({
        user: { id: mockUserId, name: mockUserName, email: mockUserEmail },
        channel: {
          token: undefined, // Explicitly undefined
        },
      })

      // Call createCompany without the optional channelToken argument
      await expect(
        service.createCompany(ctxWithoutChannelToken, createCompanyInput),
      ).rejects.toThrow(InternalServerErrorException)

      await expect(
        service.createCompany(ctxWithoutChannelToken, createCompanyInput),
      ).rejects.toThrow('Channel token is required to create a company.')

      // Prisma.company.create should NOT have been called in this case
      expect(prisma.company.create).not.toHaveBeenCalled()
    })

    it('should throw InternalServerErrorException if PrismaService.company.create throws', async () => {
      const errorMessage = 'Prisma create failed'
      prisma.company.create.mockRejectedValue(new Error(errorMessage))

      await expect(
        service.createCompany(mockRequestContext, createCompanyInput),
      ).rejects.toThrow(InternalServerErrorException)
      await expect(
        service.createCompany(mockRequestContext, createCompanyInput),
      ).rejects.toThrow('Could not create company.')

      expect(prisma.company.create).toHaveBeenCalledWith({
        data: {
          name: createCompanyInput.name,
          website: createCompanyInput.website,
          industry: createCompanyInput.industry,
          linkedinUrl: createCompanyInput.linkedinUrl,
          address: createCompanyInput.address,
          description: createCompanyInput.description,
          channelToken: mockRequestContext.channel?.token,
        },
      })
    })

    it('should return the created company entity upon successful creation', async () => {
      prisma.company.create.mockResolvedValue(expectedCompany as any)

      const result = (await service.createCompany(
        mockRequestContext,
        createCompanyInput,
      )) as MockCompanyEntity

      expect(result).toEqual(expectedCompany)
      expect(result.name).toBe(createCompanyInput.name)
      expect(result.channelToken).toBe(mockChannelToken)
    })
  })

  describe('getCompanies', () => {
    const mockCompaniesList: MockCompanyEntity[] = [
      {
        id: 'uuid1',
        name: 'Alpha Company',
        description: 'Description for Alpha',
        channelToken: 'test-channel-token',
        createdAt: new Date(2023, 0, 1),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        id: 'uuid2',
        name: 'Beta Test Corp',
        description: 'Info about Beta',
        channelToken: 'arg-channel-token-override',
        createdAt: new Date(2023, 0, 2),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        id: 'uuid3',
        name: 'Gamma Solutions',
        description: 'Gamma company details',
        channelToken: 'mock-channel-token',
        createdAt: new Date(2023, 0, 3),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ]
    const mockTotalCount = mockCompaniesList.length

    beforeEach(() => {
      // Reset mocks for each test to avoid interference
      prisma.company.findMany
        .mockReset()
        .mockResolvedValue(mockCompaniesList as any[])
      prisma.company.count.mockReset().mockResolvedValue(mockTotalCount)
    })

    it('should be defined', () => {
      expect(typeof service.getCompanies).toBe('function')
    })

    it('should use context channelToken for filtering if no channelToken arg is provided', async () => {
      // Assuming mockRequestContext has a channel token
      const expectedWhere = { channelToken: mockRequestContext.channel?.token }
      prisma.company.findMany.mockResolvedValue(
        mockCompaniesList.filter(
          (c) => c.channelToken === mockRequestContext.channel?.token,
        ) as any[],
      )
      prisma.company.count.mockResolvedValue(
        mockCompaniesList.filter(
          (c) => c.channelToken === mockRequestContext.channel?.token,
        ).length,
      )

      const result = await service.getCompanies(mockRequestContext, {})

      expect(prisma.company.findMany).toHaveBeenCalledTimes(1)
      expect(prisma.company.findMany).toHaveBeenCalledWith({
        where: expectedWhere,
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
      })
      expect(prisma.company.count).toHaveBeenCalledTimes(1)
      expect(prisma.company.count).toHaveBeenCalledWith({
        where: expectedWhere,
      })
      expect(result.items).toEqual(
        mockCompaniesList.filter(
          (c) => c.channelToken === mockRequestContext.channel?.token,
        ),
      )
      expect(result.totalCount).toBe(
        mockCompaniesList.filter(
          (c) => c.channelToken === mockRequestContext.channel?.token,
        ).length,
      )
    })

    it('should use args.channelToken for filtering if provided, overriding context token', async () => {
      const specificArgChannelToken = 'arg-channel-token-override'
      const expectedWhere = { channelToken: specificArgChannelToken }
      const mockFilteredCompanies = mockCompaniesList.filter(
        (c) => c.channelToken === specificArgChannelToken,
      )
      console.log('mockFilteredCompanies', mockFilteredCompanies)

      const result = await service.getCompanies(mockRequestContext, {
        channelToken: specificArgChannelToken,
      })

      console.log('result', result)

      prisma.company.findMany.mockResolvedValue(mockFilteredCompanies as any[])
      prisma.company.count.mockResolvedValue(mockFilteredCompanies.length)

      expect(prisma.company.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expectedWhere,
        }),
      )
      expect(prisma.company.count).toHaveBeenCalledWith({
        where: expectedWhere,
      })
    })

    it('should apply no channelToken filter if args.channelToken is undefined and context channel token is also undefined', async () => {
      const ctxWithoutChannelToken = new RequestContext({
        user: { id: mockUserId, name: mockUserName, email: mockUserEmail },
        channel: { token: undefined }, // No token in context
      })
      const expectedWhere = {} // No channelToken property
      prisma.company.findMany.mockResolvedValue(mockCompaniesList as any[]) // All companies
      prisma.company.count.mockResolvedValue(mockCompaniesList.length)

      const result = await service.getCompanies(ctxWithoutChannelToken, {
        channelToken: undefined,
      }) // No token in args

      expect(prisma.company.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expectedWhere,
        }),
      )
      expect(prisma.company.count).toHaveBeenCalledWith({
        where: expectedWhere,
      })
      expect(result.items.length).toBe(mockCompaniesList.length)
    })

    it('should retrieve companies with specified pagination (skip, take)', async () => {
      const args = { skip: 5, take: 20 }
      const expectedWhere = { channelToken: mockRequestContext.channel?.token }

      prisma.company.findMany.mockResolvedValueOnce(
        mockCompaniesList
          .filter((c) => c.channelToken === mockRequestContext.channel?.token)
          .slice(0, 1) as any[],
      )
      prisma.company.count.mockResolvedValueOnce(1)

      const result = await service.getCompanies(mockRequestContext, args)

      expect(prisma.company.findMany).toHaveBeenCalledWith({
        where: expectedWhere,
        skip: args.skip,
        take: args.take,
        orderBy: { createdAt: 'desc' },
      })
      expect(prisma.company.count).toHaveBeenCalledWith({
        where: expectedWhere,
      })
      expect(result.items).toEqual(mockCompaniesList.slice(0, 1)) // This depends on filtering
      expect(result.totalCount).toBe(1)
    })

    it('should filter companies by explicitly provided args.channelToken and ignore context token', async () => {
      const specificChannel = 'channel1-from-args'
      const filteredCompanies = mockCompaniesList.filter(
        (c) => c.channelToken === specificChannel,
      )
      prisma.company.findMany.mockResolvedValue(filteredCompanies as any[])
      prisma.company.count.mockResolvedValue(filteredCompanies.length)

      const result = await service.getCompanies(mockRequestContext, {
        // mockRequestContext might have its own token
        channelToken: specificChannel,
      })

      const expectedWhere = { channelToken: specificChannel }
      expect(prisma.company.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expectedWhere,
          orderBy: { createdAt: 'desc' },
        }),
      )
      expect(prisma.company.count).toHaveBeenCalledWith({
        where: expectedWhere,
      })
      expect(result.items).toEqual(filteredCompanies)
      expect(result.totalCount).toBe(filteredCompanies.length)
    })

    it('should filter by searchQuery and context channelToken if no args.channelToken', async () => {
      const searchQuery = 'Alpha'
      const expectedWhere = {
        channelToken: mockRequestContext.channel?.token,
        OR: [
          { name: { contains: searchQuery, mode: 'insensitive' } },
          { description: { contains: searchQuery, mode: 'insensitive' } },
        ],
      }

      const filteredByChannel = mockCompaniesList.filter(
        (c) => c.channelToken === mockRequestContext.channel?.token,
      )

      const filteredByName = filteredByChannel.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )

      const result = await service.getCompanies(mockRequestContext, {
        searchQuery,
      })

      console.log('result', result)

      prisma.company.findMany.mockResolvedValue(filteredByName as any[])
      prisma.company.count.mockResolvedValue(filteredByName.length)

      expect(prisma.company.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expectedWhere,
          orderBy: { createdAt: 'desc' },
        }),
      )
      expect(prisma.company.count).toHaveBeenCalledWith({
        where: expectedWhere,
      })
    })

    it('should combine pagination, args.channelToken (priority), and searchQuery', async () => {
      const args = {
        skip: 0,
        take: 5,
        channelToken: 'channel1-from-args-priority', // This token should be used
        searchQuery: 'Company',
      }
      const expectedWhere = {
        channelToken: args.channelToken, // From args
        OR: [
          { name: { contains: args.searchQuery, mode: 'insensitive' } },
          { description: { contains: args.searchQuery, mode: 'insensitive' } },
        ],
      }
      // Manually filter mock data for this specific combined query for assertion
      const filteredCompanies = mockCompaniesList
        .filter(
          (c) =>
            c.channelToken === args.channelToken &&
            (c.name.toLowerCase().includes(args.searchQuery.toLowerCase()) ||
              (c.description &&
                c.description
                  .toLowerCase()
                  .includes(args.searchQuery.toLowerCase()))),
        )
        .slice(args.skip, args.skip + args.take)

      prisma.company.findMany.mockResolvedValue(filteredCompanies as any[])
      // Total count should be based on filters BEFORE pagination
      const totalFilteredCount = mockCompaniesList.filter(
        (c) =>
          c.channelToken === args.channelToken &&
          (c.name.toLowerCase().includes(args.searchQuery.toLowerCase()) ||
            (c.description &&
              c.description
                .toLowerCase()
                .includes(args.searchQuery.toLowerCase()))),
      ).length
      prisma.company.count.mockResolvedValue(totalFilteredCount)

      const result = await service.getCompanies(mockRequestContext, args)

      expect(prisma.company.findMany).toHaveBeenCalledWith({
        where: expectedWhere,
        skip: args.skip,
        take: args.take,
        orderBy: { createdAt: 'desc' },
      })
      expect(prisma.company.count).toHaveBeenCalledWith({
        where: expectedWhere,
      })
      expect(result.items).toEqual(filteredCompanies)
      expect(result.totalCount).toBe(totalFilteredCount)
    })

    it('should return an empty list and zero count if no companies match combined criteria (including channelToken from context)', async () => {
      prisma.company.findMany.mockResolvedValue([])
      prisma.company.count.mockResolvedValue(0)

      const result = await service.getCompanies(mockRequestContext, {
        // uses context token
        searchQuery: 'nonExistentXYZ',
      })

      expect(result.items).toEqual([])
      expect(result.totalCount).toBe(0)
      expect(prisma.company.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            channelToken: mockRequestContext.channel?.token, // Context token applied
            OR: [
              { name: { contains: 'nonExistentXYZ', mode: 'insensitive' } },
              {
                description: {
                  contains: 'nonExistentXYZ',
                  mode: 'insensitive',
                },
              },
            ],
          },
        }),
      )
      expect(prisma.company.count).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            channelToken: mockRequestContext.channel?.token, // Context token applied
            OR: [
              { name: { contains: 'nonExistentXYZ', mode: 'insensitive' } },
              {
                description: {
                  contains: 'nonExistentXYZ',
                  mode: 'insensitive',
                },
              },
            ],
          },
        }),
      )
    })

    it('should throw InternalServerErrorException if PrismaService.company.findMany throws', async () => {
      const errorMessage = 'Prisma findMany failed'
      prisma.company.findMany.mockRejectedValue(new Error(errorMessage))

      await expect(
        service.getCompanies(mockRequestContext, {}),
      ).rejects.toThrow(InternalServerErrorException)
      await expect(
        service.getCompanies(mockRequestContext, {}),
      ).rejects.toThrow('Could not fetch companies.')
    })

    it('should throw InternalServerErrorException if PrismaService.company.count throws', async () => {
      const errorMessage = 'Prisma count failed'
      // findMany might succeed, but count fails
      prisma.company.findMany.mockResolvedValue(mockCompaniesList as any[])
      prisma.company.count.mockRejectedValue(new Error(errorMessage))

      await expect(
        service.getCompanies(mockRequestContext, {}),
      ).rejects.toThrow(InternalServerErrorException)
      await expect(
        service.getCompanies(mockRequestContext, {}),
      ).rejects.toThrow('Could not fetch companies.') // The service throws this generic one after any prisma error in the try-catch
    })
  })

  describe('getCompanyById', () => {
    const mockCompanyId = 'company-uuid-123'
    const mockExistingCompany: MockCompanyEntity = {
      id: mockCompanyId,
      name: 'Specific Test Company',
      website: 'http://specific.com',
      industry: 'Testing',
      linkedinUrl: 'http://linkedin.com/company/specific',
      address: { street: '456 Specific Ave' },
      description: 'A specific company for testing getById.',
      channelToken: mockChannelToken,
      createdAt: new Date('2024-01-15T10:00:00.000Z'),
      updatedAt: new Date('2024-01-15T11:00:00.000Z'),
    }

    it('should call PrismaService.company.findUnique with ID and context channelToken if no args.channelToken, and return company', async () => {
      prisma.company.findUnique.mockResolvedValue(mockExistingCompany as any)

      const result = await service.getCompanyById(
        mockRequestContext, // Contains mockChannelToken
        mockCompanyId,
      )

      expect(prisma.company.findUnique).toHaveBeenCalledTimes(1)
      expect(prisma.company.findUnique).toHaveBeenCalledWith({
        where: {
          id: mockCompanyId,
          channelToken: mockRequestContext.channel?.token,
        },
      })
      expect(result).toEqual(mockExistingCompany)
    })

    it('should call PrismaService.company.findUnique with ID and args.channelToken if provided, overriding context token', async () => {
      const specificArgChannelToken = 'arg-channel-for-getById'
      const companyWithSpecificToken = {
        ...mockExistingCompany,
        channelToken: specificArgChannelToken,
      }
      prisma.company.findUnique.mockResolvedValue(
        companyWithSpecificToken as any,
      )

      const result = await service.getCompanyById(
        mockRequestContext, // Context token will be overridden
        mockCompanyId,
        { channelToken: specificArgChannelToken },
      )

      expect(prisma.company.findUnique).toHaveBeenCalledWith({
        where: { id: mockCompanyId, channelToken: specificArgChannelToken },
      })
      expect(result).toEqual(companyWithSpecificToken)
    })

    it('should throw CompanyNotFoundError if PrismaService.company.findUnique returns null (using context channelToken)', async () => {
      const nonExistentCompanyId = 'non-existent-uuid'
      prisma.company.findUnique.mockResolvedValue(null)

      await expect(
        service.getCompanyById(mockRequestContext, nonExistentCompanyId),
      ).rejects.toThrow(new CompanyNotFoundError(nonExistentCompanyId))

      expect(prisma.company.findUnique).toHaveBeenCalledWith({
        where: {
          id: nonExistentCompanyId,
          channelToken: mockRequestContext.channel?.token,
        },
      })
    })

    it('should throw CompanyNotFoundError if PrismaService.company.findUnique returns null (using args.channelToken)', async () => {
      const nonExistentCompanyId = 'non-existent-uuid'
      const specificArgChannelToken = 'arg-channel-for-notFound'
      prisma.company.findUnique.mockResolvedValue(null)

      await expect(
        service.getCompanyById(mockRequestContext, nonExistentCompanyId, {
          channelToken: specificArgChannelToken,
        }),
      ).rejects.toThrow(new CompanyNotFoundError(nonExistentCompanyId))

      expect(prisma.company.findUnique).toHaveBeenCalledWith({
        where: {
          id: nonExistentCompanyId,
          channelToken: specificArgChannelToken,
        },
      })
    })

    it('should throw InternalServerErrorException if PrismaService.company.findUnique throws an unexpected error', async () => {
      const errorMessage = 'Prisma findUnique failed unexpectedly'
      prisma.company.findUnique.mockRejectedValue(new Error(errorMessage))

      await expect(
        service.getCompanyById(mockRequestContext, mockCompanyId), // Uses context channel token
      ).rejects.toThrow(InternalServerErrorException)

      await expect(
        service.getCompanyById(mockRequestContext, mockCompanyId),
      ).rejects.toThrow('Could not fetch company.')

      expect(prisma.company.findUnique).toHaveBeenCalledWith({
        where: {
          id: mockCompanyId,
          channelToken: mockRequestContext.channel?.token,
        },
      })
    })
  })

  describe('updateCompany', () => {
    const mockCompanyId = 'company-uuid-for-update'
    const baseCompanyData: MockCompanyEntity = {
      id: mockCompanyId,
      name: 'Original Name',
      website: 'http://original.com',
      industry: 'Original Industry',
      linkedinUrl: 'http://linkedin.com/original',
      address: { street: '1 Original St' },
      description: 'Original description.',
      channelToken: 'original-channel',
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-01T00:00:00.000Z'),
      deletedAt: null,
    }

    // Define UpdateCompanyInput conceptual type for tests if not already imported
    // For simplicity, we'll use partial MockCompanyEntity for updateData
    type UpdateCompanyData = Partial<
      Omit<MockCompanyEntity, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
    > & { address?: Record<string, any> | null } // Ensure address can be explicitly nulled or an object

    it('should update with context channelToken if no channelToken arg, and return updated company', async () => {
      const updateData: UpdateCompanyData = {
        name: 'Updated Name by Context Token',
        website: 'http://updated-context.com',
        address: { street: '123 Context St' },
      }
      const expectedUpdatedCompany = {
        ...baseCompanyData,
        name: updateData.name,
        website: updateData.website,
        address: updateData.address,
        channelToken: mockRequestContext.channel?.token, // Updated with context token
        updatedAt: new Date(), // Assume this will be different
        deletedAt: null,
        industry: baseCompanyData.industry ?? null,
        linkedinUrl: baseCompanyData.linkedinUrl ?? null,
        description: baseCompanyData.description ?? null,
      }
      prisma.company.update.mockResolvedValue(expectedUpdatedCompany as any)

      const result = await service.updateCompany(
        mockRequestContext, // Contains mockChannelToken
        mockCompanyId,
        updateData,
        // No explicit channelToken, so context one should be used
      )

      const expectedPrismaUpdateData: Prisma.CompanyUpdateInput = {
        name: updateData.name,
        website: updateData.website,
      }
      if (updateData.address) {
        expectedPrismaUpdateData.address = { toJSON: expect.any(Function) } // Simplified check for address
      }

      expect(prisma.company.update).toHaveBeenCalledTimes(1)
      expect(prisma.company.update).toHaveBeenCalledWith({
        where: {
          id: mockCompanyId,
          deletedAt: null,
          channelToken: mockRequestContext.channel?.token,
        },
        data: expect.objectContaining(expectedPrismaUpdateData),
      })
      expect(result.name).toBe(updateData.name)
      expect(result.channelToken).toBe(mockRequestContext.channel?.token)
    })

    it('should update with explicit channelToken arg, overriding context token', async () => {
      const explicitChannelToken = 'explicit-channel-for-update'
      const updateData: UpdateCompanyData = {
        name: 'Updated Name by Arg Token',
        industry: 'Explicitly Updated Industry',
      }
      const expectedUpdatedCompany = {
        ...baseCompanyData,
        name: updateData.name,
        industry: updateData.industry,
        channelToken: explicitChannelToken, // Updated with explicit arg token
        updatedAt: new Date(),
        deletedAt: null,
        website: baseCompanyData.website ?? null,
        linkedinUrl: baseCompanyData.linkedinUrl ?? null,
        address: baseCompanyData.address ?? null,
        description: baseCompanyData.description ?? null,
      }
      prisma.company.update.mockResolvedValue(expectedUpdatedCompany as any)

      const result = await service.updateCompany(
        mockRequestContext, // Context token will be overridden
        mockCompanyId,
        updateData,
        explicitChannelToken,
      )

      expect(prisma.company.update).toHaveBeenCalledWith({
        where: {
          id: mockCompanyId,
          deletedAt: null,
          channelToken: explicitChannelToken,
        },
        data: {
          name: updateData.name,
          industry: updateData.industry,
        },
      })
      expect(result.name).toBe(updateData.name)
      expect(result.channelToken).toBe(explicitChannelToken)
    })

    it('should correctly handle address update (toJSON structure)', async () => {
      const updateData: UpdateCompanyData = {
        address: { city: 'New City', country: 'NC' },
      }
      const updatedCompany = {
        ...baseCompanyData,
        address: updateData.address,
        updatedAt: new Date(),
        channelToken: mockRequestContext.channel?.token, // Using context token for this test
        deletedAt: null,
        website: baseCompanyData.website ?? null,
        industry: baseCompanyData.industry ?? null,
        linkedinUrl: baseCompanyData.linkedinUrl ?? null,
        description: baseCompanyData.description ?? null,
      }
      prisma.company.update.mockResolvedValue(updatedCompany as any)

      await service.updateCompany(mockRequestContext, mockCompanyId, updateData)

      expect(prisma.company.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id: mockCompanyId,
            deletedAt: null,
            channelToken: mockRequestContext.channel?.token,
          },
          data: {
            address: expect.objectContaining({ toJSON: expect.any(Function) }),
          },
        }),
      )
    })

    it('should throw CompanyNotFoundError if company to update does not exist (Prisma P2025 error, using context token)', async () => {
      const nonExistentId = 'non-existent-company-id'
      const updateData: UpdateCompanyData = { name: 'Attempted Update' }
      prisma.company.update.mockRejectedValue(createPrismaNotFoundError())

      await expect(
        service.updateCompany(mockRequestContext, nonExistentId, updateData),
      ).rejects.toThrow(new CompanyNotFoundError(nonExistentId))

      expect(prisma.company.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id: nonExistentId,
            deletedAt: null,
            channelToken: mockRequestContext.channel?.token,
          },
        }),
      )
    })

    it('should throw CompanyNotFoundError if company to update does not exist (Prisma P2025 error, using arg token)', async () => {
      const nonExistentId = 'non-existent-company-id'
      const explicitChannelToken = 'arg-channel-for-update-notFound'
      const updateData: UpdateCompanyData = { name: 'Attempted Update' }
      prisma.company.update.mockRejectedValue(createPrismaNotFoundError())

      await expect(
        service.updateCompany(
          mockRequestContext,
          nonExistentId,
          updateData,
          explicitChannelToken,
        ),
      ).rejects.toThrow(new CompanyNotFoundError(nonExistentId))

      expect(prisma.company.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id: nonExistentId,
            deletedAt: null,
            channelToken: explicitChannelToken,
          },
        }),
      )
    })

    it('should throw InternalServerErrorException if PrismaService.company.update throws an unexpected error', async () => {
      const updateData: UpdateCompanyData = { name: 'Another Update' }
      const errorMessage = 'Unexpected Prisma update error'
      prisma.company.update.mockRejectedValue(new Error(errorMessage))

      await expect(
        service.updateCompany(mockRequestContext, mockCompanyId, updateData), // Uses context token
      ).rejects.toThrow(InternalServerErrorException)
      await expect(
        service.updateCompany(mockRequestContext, mockCompanyId, updateData), // Uses context token
      ).rejects.toThrow('Could not update company.')
    })
  })

  // New describe block for deleteCompany (Soft Delete)
  describe('deleteCompany', () => {
    const mockCompanyIdToDelete = 'company-uuid-for-delete'
    const companyBeforeDelete: MockCompanyEntity = {
      id: mockCompanyIdToDelete,
      name: 'Company Exists Before Delete',
      website: 'http://delete.com',
      industry: 'ToBeDeleted',
      linkedinUrl: 'http://linkedin.com/tobedeleted',
      address: { street: '789 Delete Rd' },
      description: 'This company will be soft deleted.',
      channelToken: mockChannelToken, // Assume it matches context for some tests
      createdAt: new Date('2024-02-01T00:00:00.000Z'),
      updatedAt: new Date('2024-02-01T00:00:00.000Z'),
      deletedAt: null, // Crucial: must be null before soft delete
    }

    let dateNowSpy: jest.SpyInstance
    const fixedCurrentDate = new Date('2025-06-04T12:00:00.000Z')

    beforeEach(() => {
      dateNowSpy = jest
        .spyOn(global, 'Date')
        .mockImplementation(() => fixedCurrentDate as any)
      // Reset mocks for prisma.company.findFirst and prisma.company.update for each test
      prisma.company.findFirst.mockReset()
      prisma.company.update.mockReset()
    })

    afterEach(() => {
      dateNowSpy.mockRestore()
    })

    it('should soft delete with context channelToken, set deletedAt, and return updated company', async () => {
      prisma.company.findFirst.mockResolvedValue(companyBeforeDelete as any)
      const expectedSoftDeletedCompany = {
        ...companyBeforeDelete,
        deletedAt: fixedCurrentDate,
        updatedAt: fixedCurrentDate, // Assuming service updates this, or remove if not
      }
      prisma.company.update.mockResolvedValue(expectedSoftDeletedCompany as any)

      const result = await service.deleteCompany(
        mockRequestContext,
        mockCompanyIdToDelete,
      )

      expect(prisma.company.findFirst).toHaveBeenCalledTimes(1)
      expect(prisma.company.findFirst).toHaveBeenCalledWith({
        where: {
          id: mockCompanyIdToDelete,
          deletedAt: null,
          channelToken: mockRequestContext.channel?.token,
        },
      })
      expect(prisma.company.update).toHaveBeenCalledTimes(1)
      expect(prisma.company.update).toHaveBeenCalledWith({
        where: {
          id: mockCompanyIdToDelete,
          channelToken: mockRequestContext.channel?.token,
        }, // Service uses ct here
        data: { deletedAt: fixedCurrentDate },
      })
      expect(result).toEqual(expectedSoftDeletedCompany)
      expect(result.deletedAt).toEqual(fixedCurrentDate)
    })

    it('should soft delete with args.channelToken, overriding context, set deletedAt, and return company', async () => {
      const explicitChannelToken = 'arg-channel-for-delete'
      const companyWithExplicitToken = {
        ...companyBeforeDelete,
        channelToken: explicitChannelToken,
      }
      prisma.company.findFirst.mockResolvedValue(
        companyWithExplicitToken as any,
      )
      const expectedSoftDeletedCompany = {
        ...companyWithExplicitToken,
        deletedAt: fixedCurrentDate,
        updatedAt: fixedCurrentDate,
      }
      prisma.company.update.mockResolvedValue(expectedSoftDeletedCompany as any)

      const result = await service.deleteCompany(
        mockRequestContext,
        mockCompanyIdToDelete,
        { channelToken: explicitChannelToken },
      )

      expect(prisma.company.findFirst).toHaveBeenCalledWith({
        where: {
          id: mockCompanyIdToDelete,
          deletedAt: null,
          channelToken: explicitChannelToken,
        },
      })
      expect(prisma.company.update).toHaveBeenCalledWith({
        where: {
          id: mockCompanyIdToDelete,
          channelToken: explicitChannelToken,
        },
        data: { deletedAt: fixedCurrentDate },
      })
      expect(result.deletedAt).toEqual(fixedCurrentDate)
      expect(result.channelToken).toBe(explicitChannelToken)
    })

    it('should throw CompanyNotFoundError if findFirst returns null (company not found or already deleted, using context token)', async () => {
      prisma.company.findFirst.mockResolvedValue(null)

      await expect(
        service.deleteCompany(mockRequestContext, mockCompanyIdToDelete),
      ).rejects.toThrow(new CompanyNotFoundError(mockCompanyIdToDelete))

      expect(prisma.company.findFirst).toHaveBeenCalledWith({
        where: {
          id: mockCompanyIdToDelete,
          deletedAt: null,
          channelToken: mockRequestContext.channel?.token,
        },
      })
      expect(prisma.company.update).not.toHaveBeenCalled()
    })

    it('should throw CompanyNotFoundError if findFirst returns null (using args.channelToken)', async () => {
      const explicitChannelToken = 'arg-channel-for-delete-notFound'
      prisma.company.findFirst.mockResolvedValue(null)

      await expect(
        service.deleteCompany(mockRequestContext, mockCompanyIdToDelete, {
          channelToken: explicitChannelToken,
        }),
      ).rejects.toThrow(new CompanyNotFoundError(mockCompanyIdToDelete))

      expect(prisma.company.findFirst).toHaveBeenCalledWith({
        where: {
          id: mockCompanyIdToDelete,
          deletedAt: null,
          channelToken: explicitChannelToken,
        },
      })
      expect(prisma.company.update).not.toHaveBeenCalled()
    })

    it('should throw CompanyNotFoundError if update fails with P2025 (record not found during update)', async () => {
      // Simulate findFirst succeeds, but update fails because record is gone
      prisma.company.findFirst.mockResolvedValue(companyBeforeDelete as any)
      prisma.company.update.mockRejectedValue(createPrismaNotFoundError()) // P2025 error

      await expect(
        service.deleteCompany(mockRequestContext, mockCompanyIdToDelete),
      ).rejects.toThrow(new CompanyNotFoundError(mockCompanyIdToDelete))

      expect(prisma.company.findFirst).toHaveBeenCalledTimes(1)
      expect(prisma.company.update).toHaveBeenCalledTimes(1)
    })

    it('should throw InternalServerErrorException if findFirst throws an unexpected error', async () => {
      const errorMessage = 'Unexpected Prisma findFirst error'
      prisma.company.findFirst.mockRejectedValue(new Error(errorMessage))

      await expect(
        service.deleteCompany(mockRequestContext, mockCompanyIdToDelete),
      ).rejects.toThrow(InternalServerErrorException)
      await expect(
        service.deleteCompany(mockRequestContext, mockCompanyIdToDelete),
      ).rejects.toThrow('Could not delete company.')
      expect(prisma.company.update).not.toHaveBeenCalled()
    })

    it('should throw InternalServerErrorException if update throws an unexpected error (not P2025)', async () => {
      prisma.company.findFirst.mockResolvedValue(companyBeforeDelete as any)
      const errorMessage = 'Unexpected Prisma update error'
      prisma.company.update.mockRejectedValue(new Error(errorMessage)) // Non-P2025 error

      await expect(
        service.deleteCompany(mockRequestContext, mockCompanyIdToDelete),
      ).rejects.toThrow(InternalServerErrorException)
      await expect(
        service.deleteCompany(mockRequestContext, mockCompanyIdToDelete),
      ).rejects.toThrow('Could not delete company.')
    })
  })
})
