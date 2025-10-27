import { Test, TestingModule } from '@nestjs/testing'
import { Logger } from '@nestjs/common'
import { OnLeadCreatedEmailHandler } from './on-lead-created-email.handler'
import { PrismaService } from 'src/common'
import { EmailService } from '../services/email.service'
import { DeepMocked } from 'src/common/test/types/deep-mocked.type'

// Mock logger
beforeAll(() => {
  jest.spyOn(Logger.prototype, 'log').mockImplementation(jest.fn())
  jest.spyOn(Logger.prototype, 'error').mockImplementation(jest.fn())
  jest.spyOn(Logger.prototype, 'warn').mockImplementation(jest.fn())
  jest.spyOn(Logger.prototype, 'debug').mockImplementation(jest.fn())
})

describe('OnLeadCreatedEmailHandler', () => {
  let handler: OnLeadCreatedEmailHandler
  let prisma: DeepMocked<PrismaService>
  let emailService: DeepMocked<EmailService>

  const mockLead = {
    id: 'lead-123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    company: 'Test Corp',
    jobTitle: 'Developer',
    website: 'https://testcorp.com',
    status: 'NEW',
    source: 'WEBSITE',
    priority: 'MEDIUM',
    productInterest: ['SAAS', 'WEB_APP'],
    budget: '10000',
    timeline: 'Q1 2025',
    companySize: 50,
    isDecisionMaker: true,
    painPoints: 'Need automation',
    currentSolution: 'Manual processes',
    assignedTo: {
      name: 'Jane Smith',
      email: 'jane@example.com',
    },
  }

  const mockChannel = {
    name: 'Main Tenant',
    marketingEmails: ['marketing@example.com', 'sales@example.com'],
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OnLeadCreatedEmailHandler,
        {
          provide: PrismaService,
          useValue: {
            lead: {
              findUnique: jest.fn(),
            },
            channel: {
              findFirst: jest.fn(),
            },
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendTemplateEmail: jest.fn(),
          },
        },
      ],
    }).compile()

    handler = module.get<OnLeadCreatedEmailHandler>(OnLeadCreatedEmailHandler)
    prisma = module.get(PrismaService)
    emailService = module.get(EmailService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('handleLeadCreatedEvent', () => {
    const eventPayload = {
      leadId: 'lead-123',
      source: 'WEBSITE',
      createdBy: 'user-123',
      channelId: 'ch_main_tenant_1',
    }

    it('should send customer and marketing emails for non-admin leads', async () => {
      prisma.lead.findUnique.mockResolvedValue(mockLead as any)
      prisma.channel.findFirst.mockResolvedValue(mockChannel as any)
      emailService.sendTemplateEmail.mockResolvedValue(undefined)

      await handler.handleLeadCreatedEvent(eventPayload)

      expect(prisma.lead.findUnique).toHaveBeenCalledWith({
        where: { id: 'lead-123' },
        include: {
          assignedTo: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      })

      expect(prisma.channel.findFirst).toHaveBeenCalledWith({
        where: { token: 'ch_main_tenant_1' },
        select: {
          name: true,
          marketingEmails: true,
        },
      })

      expect(emailService.sendTemplateEmail).toHaveBeenCalledTimes(2)
      expect(emailService.sendTemplateEmail).toHaveBeenNthCalledWith(
        1,
        'customer-lead-confirmation',
        expect.objectContaining({
          lead: expect.objectContaining({
            email: 'john.doe@example.com',
            firstName: 'John',
          }),
          channel: { name: 'Main Tenant' },
        }),
        {
          to: 'john.doe@example.com',
          subject: 'Thank You for Your Interest - Main Tenant',
        },
      )
      expect(emailService.sendTemplateEmail).toHaveBeenNthCalledWith(
        2,
        'marketing-new-lead',
        expect.any(Object),
        {
          to: ['marketing@example.com', 'sales@example.com'],
          subject: 'New Lead: John Doe - Test Corp',
        },
      )
    })

    it('should skip email sending for admin-created leads', async () => {
      const adminPayload = { ...eventPayload, source: 'ADMIN' }

      await handler.handleLeadCreatedEvent(adminPayload)

      expect(prisma.lead.findUnique).not.toHaveBeenCalled()
      expect(emailService.sendTemplateEmail).not.toHaveBeenCalled()
    })

    it('should handle missing lead gracefully', async () => {
      prisma.lead.findUnique.mockResolvedValue(null)

      await handler.handleLeadCreatedEvent(eventPayload)

      expect(prisma.channel.findFirst).not.toHaveBeenCalled()
      expect(emailService.sendTemplateEmail).not.toHaveBeenCalled()
    })

    it('should handle missing channel gracefully', async () => {
      prisma.lead.findUnique.mockResolvedValue(mockLead as any)
      prisma.channel.findFirst.mockResolvedValue(null)

      await handler.handleLeadCreatedEvent(eventPayload)

      expect(prisma.lead.findUnique).toHaveBeenCalled()
      expect(emailService.sendTemplateEmail).not.toHaveBeenCalled()
    })

    it('should handle missing marketing emails gracefully', async () => {
      prisma.lead.findUnique.mockResolvedValue(mockLead as any)
      prisma.channel.findFirst.mockResolvedValue({
        ...mockChannel,
        marketingEmails: [],
      } as any)

      await handler.handleLeadCreatedEvent(eventPayload)

      expect(emailService.sendTemplateEmail).toHaveBeenCalledTimes(1) // Only customer email
    })

    it('should handle error during email sending gracefully', async () => {
      prisma.lead.findUnique.mockResolvedValue(mockLead as any)
      prisma.channel.findFirst.mockResolvedValue(mockChannel as any)
      emailService.sendTemplateEmail.mockRejectedValue(
        new Error('Email sending failed'),
      )

      await handler.handleLeadCreatedEvent(eventPayload)

      expect(emailService.sendTemplateEmail).toHaveBeenCalled()
    })

    it('should handle lead without assigned user', async () => {
      const leadWithoutAssignee = { ...mockLead, assignedTo: null }
      prisma.lead.findUnique.mockResolvedValue(leadWithoutAssignee as any)
      prisma.channel.findFirst.mockResolvedValue(mockChannel as any)
      emailService.sendTemplateEmail.mockResolvedValue(undefined)

      await handler.handleLeadCreatedEvent(eventPayload)

      expect(emailService.sendTemplateEmail).toHaveBeenCalledWith(
        'marketing-new-lead',
        expect.objectContaining({
          assignedTo: null,
        }),
        expect.any(Object),
      )
    })

    it('should include full lead data in customer email context', async () => {
      prisma.lead.findUnique.mockResolvedValue(mockLead as any)
      prisma.channel.findFirst.mockResolvedValue(mockChannel as any)
      emailService.sendTemplateEmail.mockResolvedValue(undefined)

      await handler.handleLeadCreatedEvent(eventPayload)

      const customerCall = (emailService.sendTemplateEmail as jest.Mock).mock
        .calls[0]
      const context = customerCall[1]

      expect(context.lead).toEqual({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        company: 'Test Corp',
        jobTitle: 'Developer',
        website: 'https://testcorp.com',
        status: 'NEW',
        source: 'WEBSITE',
        priority: 'MEDIUM',
        productInterest: ['SAAS', 'WEB_APP'],
        budget: '10000',
        timeline: 'Q1 2025',
        companySize: 50,
        isDecisionMaker: true,
        painPoints: 'Need automation',
        currentSolution: 'Manual processes',
      })
    })

    it('should include assigned user info in marketing email context', async () => {
      prisma.lead.findUnique.mockResolvedValue(mockLead as any)
      prisma.channel.findFirst.mockResolvedValue(mockChannel as any)
      emailService.sendTemplateEmail.mockResolvedValue(undefined)

      await handler.handleLeadCreatedEvent(eventPayload)

      const marketingCall = (emailService.sendTemplateEmail as jest.Mock).mock
        .calls[1]
      const context = marketingCall[1]

      expect(context.assignedTo).toEqual({
        name: 'Jane Smith',
        email: 'jane@example.com',
      })
    })

    it('should handle database errors gracefully', async () => {
      prisma.lead.findUnique.mockRejectedValue(new Error('Database error'))

      await handler.handleLeadCreatedEvent(eventPayload)

      expect(emailService.sendTemplateEmail).not.toHaveBeenCalled()
    })
  })
})


