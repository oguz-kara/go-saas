import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { PrismaService } from 'src/common'
import { EmailService } from '../services/email.service'
import {
  CustomerEmailContext,
  MarketingEmailContext,
} from '../../interfaces/email-template-context.interface'

@Injectable()
export class OnLeadCreatedEmailHandler {
  private readonly logger = new Logger(OnLeadCreatedEmailHandler.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  @OnEvent('lead.created', { async: true })
  async handleLeadCreatedEvent(payload: {
    leadId: string
    source: string
    createdBy?: string | null
    channelId?: string | null
  }): Promise<void> {
    try {
      // Skip emails for admin-created leads
      if (payload.source === 'ADMIN') {
        this.logger.debug('Skipping email for admin-created lead')
        return
      }

      // Fetch the full lead data with related information
      const lead = await this.prisma.lead.findUnique({
        where: { id: payload.leadId },
        include: {
          assignedTo: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      })

      if (!lead) {
        this.logger.warn(`Lead not found: ${payload.leadId}`)
        return
      }

      // Fetch channel information
      const channel = await this.prisma.channel.findFirst({
        where: { token: payload.channelId ?? undefined },
        select: {
          name: true,
          marketingEmails: true,
        },
      })

      if (!channel) {
        this.logger.warn(`Channel not found: ${payload.channelId}`)
        return
      }

      // Prepare template contexts
      const customerContext: CustomerEmailContext = {
        lead: {
          firstName: lead.firstName,
          lastName: lead.lastName,
          email: lead.email,
          phone: lead.phone,
          company: lead.company,
          jobTitle: lead.jobTitle,
          website: lead.website,
          status: lead.status,
          source: lead.source,
          priority: lead.priority,
          productInterest: lead.productInterest,
          budget: lead.budget?.toString(),
          timeline: lead.timeline,
          companySize: lead.companySize,
          isDecisionMaker: lead.isDecisionMaker,
          painPoints: lead.painPoints,
          currentSolution: lead.currentSolution,
        },
        channel: {
          name: channel.name,
        },
      }

      const marketingContext: MarketingEmailContext = {
        ...customerContext,
        assignedTo: lead.assignedTo
          ? {
              name: lead.assignedTo.name,
              email: lead.assignedTo.email,
            }
          : null,
      }

      // Send customer confirmation email
      await this.sendCustomerEmail(customerContext)

      // Send marketing notification email(s)
      if (channel.marketingEmails && channel.marketingEmails.length > 0) {
        await this.sendMarketingEmails(
          marketingContext,
          channel.marketingEmails,
        )
      } else {
        this.logger.warn(
          `No marketing emails configured for channel: ${channel.name}`,
        )
      }
    } catch (error) {
      this.logger.error(
        'Failed to handle lead.created email event',
        error.stack,
      )
    }
  }

  private async sendCustomerEmail(
    context: CustomerEmailContext,
  ): Promise<void> {
    try {
      await this.emailService.sendTemplateEmail(
        'customer-lead-confirmation',
        context,
        {
          to: context.lead.email,
          subject: `Thank You for Your Interest - ${context.channel.name}`,
        },
      )

      this.logger.log(
        `Customer confirmation email sent to: ${context.lead.email}`,
      )
    } catch (error) {
      this.logger.error(
        `Failed to send customer email to ${context.lead.email}`,
        error.stack,
      )
    }
  }

  private async sendMarketingEmails(
    context: MarketingEmailContext,
    recipients: string[],
  ): Promise<void> {
    try {
      await this.emailService.sendTemplateEmail('marketing-new-lead', context, {
        to: recipients,
        subject: `New Lead: ${context.lead.firstName} ${context.lead.lastName} - ${context.lead.company || 'Individual'}`,
      })

      this.logger.log(
        `Marketing notification email sent to ${recipients.length} recipient(s)`,
      )
    } catch (error) {
      this.logger.error(
        'Failed to send marketing notification email',
        error.stack,
      )
    }
  }
}
