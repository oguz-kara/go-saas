import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import { Logger } from '@nestjs/common'
import { EmailService } from './email.service'
import * as nodemailer from 'nodemailer'
import * as fs from 'fs'
import * as Handlebars from 'handlebars'
import { EmailOptions } from '../../interfaces/email-template-context.interface'

// Mock logger
beforeAll(() => {
  jest.spyOn(Logger.prototype, 'log').mockImplementation(jest.fn())
  jest.spyOn(Logger.prototype, 'error').mockImplementation(jest.fn())
  jest.spyOn(Logger.prototype, 'warn').mockImplementation(jest.fn())
  jest.spyOn(Logger.prototype, 'debug').mockImplementation(jest.fn())
})

// Mock fs
jest.mock('fs')
const mockFs = fs as jest.Mocked<typeof fs>

// Mock Handlebars
jest.mock('handlebars')

describe('EmailService', () => {
  let service: EmailService
  let mockTransporter: any
  let configService: Partial<ConfigService>

  beforeEach(() => {
    // Mock nodemailer transporter
    mockTransporter = {
      verify: jest.fn().mockResolvedValue(true),
      sendMail: jest.fn().mockResolvedValue({ messageId: 'test-message-id' }),
    }

    // Mock config service
    configService = {
      get: jest.fn().mockReturnValue({
        smtp: {
          host: 'smtp.test.com',
          port: 587,
          secure: false,
          auth: {
            user: 'test@test.com',
            pass: 'testpass',
          },
        },
        from: {
          name: 'Test Sender',
          email: 'noreply@test.com',
        },
      }),
    }

    // Mock fs.readFileSync
    mockFs.readFileSync = jest.fn().mockReturnValue('test template content')

    // Mock Handlebars
    jest.spyOn(Handlebars, 'registerHelper').mockImplementation(jest.fn())
    jest.spyOn(Handlebars, 'registerPartial').mockImplementation(jest.fn())
    jest.spyOn(Handlebars, 'compile').mockReturnValue(jest.fn().mockReturnValue('compiled html') as any)
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  beforeEach(async () => {
    // Mock nodemailer.createTransport
    const createTransportSpy = jest
      .spyOn(nodemailer, 'createTransport')
      .mockReturnValue(mockTransporter)

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
    }).compile()

    service = module.get<EmailService>(EmailService)

    // Call onModuleInit manually for testing
    await service.onModuleInit()
  })

  describe('onModuleInit', () => {
    it('should initialize transporter with correct config', () => {
      expect(nodemailer.createTransport).toHaveBeenCalledWith({
        host: 'smtp.test.com',
        port: 587,
        secure: false,
        auth: {
          user: 'test@test.com',
          pass: 'testpass',
        },
      })
    })

    it('should register Handlebars helpers', () => {
      expect(Handlebars.registerHelper).toHaveBeenCalled()
    })
  })

  describe('sendEmail', () => {
    it('should send email successfully', async () => {
      const options: EmailOptions = {
        to: 'recipient@test.com',
        subject: 'Test Subject',
        html: '<h1>Test</h1>',
      }

      await service.sendEmail(options)

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: '"Test Sender" <noreply@test.com>',
        to: 'recipient@test.com',
        subject: 'Test Subject',
        html: '<h1>Test</h1>',
        text: expect.any(String),
      })
    })

    it('should handle multiple recipients', async () => {
      const options: EmailOptions = {
        to: ['recipient1@test.com', 'recipient2@test.com'],
        subject: 'Test Subject',
        html: '<h1>Test</h1>',
      }

      await service.sendEmail(options)

      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'recipient1@test.com, recipient2@test.com',
        }),
      )
    })

    it('should throw error when sendMail fails', async () => {
      const error = new Error('SMTP Error')
      mockTransporter.sendMail.mockRejectedValue(error)

      const options: EmailOptions = {
        to: 'recipient@test.com',
        subject: 'Test Subject',
        html: '<h1>Test</h1>',
      }

      await expect(service.sendEmail(options)).rejects.toThrow('SMTP Error')
    })
  })

  describe('sendTemplateEmail', () => {
    it('should load template and send email', async () => {
      const templateName = 'test-template'
      const context = { name: 'Test User' }
      const options = {
        to: 'recipient@test.com',
        subject: 'Test Subject',
      }

      await service.sendTemplateEmail(templateName, context, options)

      expect(mockFs.readFileSync).toHaveBeenCalled()
      expect(mockTransporter.sendMail).toHaveBeenCalled()
    })

    it('should throw error when template file not found', async () => {
      mockFs.readFileSync.mockImplementationOnce(() => {
        throw new Error('File not found')
      })

      const templateName = 'non-existent-template'
      const context = { name: 'Test User' }
      const options = {
        to: 'recipient@test.com',
        subject: 'Test Subject',
      }

      await expect(
        service.sendTemplateEmail(templateName, context, options),
      ).rejects.toThrow('Template non-existent-template not found')
    })
  })

  describe('verifyConnection', () => {
    it('should return true when connection is successful', async () => {
      const result = await service.verifyConnection()
      expect(result).toBe(true)
      expect(mockTransporter.verify).toHaveBeenCalled()
    })

    it('should return false when connection fails', async () => {
      mockTransporter.verify.mockRejectedValueOnce(new Error('Connection failed'))
      const result = await service.verifyConnection()
      expect(result).toBe(false)
    })
  })

  describe('stripHtml', () => {
    it('should strip HTML tags from text', () => {
      const html = '<h1>Test</h1><p>Content</p>'
      const result = (service as any).stripHtml(html)
      expect(result).not.toContain('<h1>')
      expect(result).not.toContain('<p>')
    })
  })
})

