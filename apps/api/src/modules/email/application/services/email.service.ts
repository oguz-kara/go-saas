import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as nodemailer from 'nodemailer'
import * as fs from 'fs'
import * as path from 'path'
import * as Handlebars from 'handlebars'
import { EmailOptions } from '../../interfaces/email-template-context.interface'

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new Logger(EmailService.name)
  private transporter: nodemailer.Transporter

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.initializeTransporter()
    this.registerHandlebarsHelpers()
  }

  private initializeTransporter() {
    const emailConfig = this.configService.get('email')

    this.transporter = nodemailer.createTransport({
      host: emailConfig.smtp.host,
      port: emailConfig.smtp.port,
      secure: emailConfig.smtp.secure,
      auth:
        emailConfig.smtp.auth.user && emailConfig.smtp.auth.pass
          ? {
              user: emailConfig.smtp.auth.user,
              pass: emailConfig.smtp.auth.pass,
            }
          : undefined,
    })

    this.logger.log('Email transporter initialized')
  }

  private registerHandlebarsHelpers() {
    // Helper to join array with comma
    Handlebars.registerHelper('join', function (array: string[]) {
      if (!array || !Array.isArray(array)) return ''
      return array.join(', ')
    })

    // Helper for equality check
    Handlebars.registerHelper('eq', function (a: any, b: any, options: any) {
      return a === b ? options.fn(this) : options.inverse(this)
    })
  }

  private loadTemplate(templateName: string): string {
    const templatePath = path.join(
      process.cwd(),
      'src',
      'modules',
      'email',
      'templates',
      `${templateName}.hbs`,
    )

    try {
      return fs.readFileSync(templatePath, 'utf-8')
    } catch (error) {
      this.logger.error(`Failed to load template: ${templateName}`, error)
      throw new Error(`Template ${templateName} not found`)
    }
  }

  private registerPartials() {
    const partialsDir = path.join(
      process.cwd(),
      'src',
      'modules',
      'email',
      'templates',
      'partials',
    )

    try {
      const partialFiles = fs.readdirSync(partialsDir)

      partialFiles.forEach((file) => {
        if (file.endsWith('.hbs')) {
          const partialName = file.replace('.hbs', '')
          const partialPath = path.join(partialsDir, file)
          const partialContent = fs.readFileSync(partialPath, 'utf-8')
          Handlebars.registerPartial(partialName, partialContent)
          this.logger.debug(`Registered partial: ${partialName}`)
        }
      })
    } catch (error) {
      this.logger.warn('Failed to register partials', error)
    }
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const emailConfig = this.configService.get('email')

      const mailOptions = {
        from: `"${emailConfig.from.name}" <${emailConfig.from.email}>`,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || this.stripHtml(options.html),
      }

      const info = await this.transporter.sendMail(mailOptions)
      this.logger.log(`Email sent: ${info.messageId}`)
    } catch (error) {
      const isDevelopment = process.env.NODE_ENV !== 'production'
      const isConnectionError =
        error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND'

      if (isDevelopment && isConnectionError) {
        this.logger.warn(
          `⚠️  Email not sent (SMTP server not available): ${options.subject}`,
        )
        this.logger.debug(
          `To: ${Array.isArray(options.to) ? options.to.join(', ') : options.to}`,
        )
        // Don't throw in development when SMTP server is unavailable
        return
      }

      this.logger.error(`Failed to send email: ${error.message}`, error.stack)
      throw error
    }
  }

  async sendTemplateEmail(
    templateName: string,
    context: any,
    options: {
      to: string | string[]
      subject: string
    },
  ): Promise<void> {
    try {
      this.registerPartials()

      const templateContent = this.loadTemplate(templateName)
      const template = Handlebars.compile(templateContent)
      const html = template({
        ...context,
        currentYear: new Date().getFullYear(),
      })

      await this.sendEmail({
        to: options.to,
        subject: options.subject,
        html,
      })
    } catch (error) {
      this.logger.error(
        `Failed to send template email: ${templateName}`,
        error.stack,
      )
      throw error
    }
  }

  private stripHtml(html: string): string {
    return html
      .replace(/<style[^>]*>.*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim()
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify()
      this.logger.log('Email server connection verified')
      return true
    } catch (error) {
      this.logger.error('Email server connection failed', error)
      return false
    }
  }
}
