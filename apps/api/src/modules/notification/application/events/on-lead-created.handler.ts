import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { PrismaService } from 'src/common'
import { NotificationService } from '../services/notification.service'

@Injectable()
export class OnLeadCreatedHandler {
  private readonly logger = new Logger(OnLeadCreatedHandler.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  @OnEvent('lead.created', { async: true })
  async handleLeadCreatedEvent(payload: {
    leadId: string
    source: string
    createdBy?: string | null
    channelId?: string | null
  }): Promise<void> {
    try {
      if (payload.source === 'ADMIN') {
        return
      }

      const lead = await this.prisma.lead.findUnique({
        where: { id: payload.leadId },
      })
      if (!lead) return

      // Strategy: notify all users in the channel (simple baseline). In future, refine.
      const users = await this.prisma.user.findMany({
        where: { channelToken: payload.channelId ?? undefined },
        select: { id: true },
      })

      if (!users.length) return

      // Create notifications for each user using NotificationService
      // This will automatically emit real-time WebSocket events
      await this.notificationService.createNotifications(
        users.map((u) => ({
          userId: u.id,
          type: 'NEW_LEAD',
          priority: 'MEDIUM',
          title: 'Yeni lead alındı',
          message: `${lead.firstName} ${lead.lastName} (${lead.email})`,
          leadId: lead.id,
          metadata: {
            source: lead.source,
            email: lead.email,
            firstName: lead.firstName,
            lastName: lead.lastName,
          },
        })),
      )
    } catch (error) {
      this.logger.error('Failed to handle lead.created event', error?.stack)
    }
  }
}
