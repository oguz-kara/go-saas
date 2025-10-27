import {
  Injectable,
  InternalServerErrorException,
  Logger,
  forwardRef,
  Inject,
} from '@nestjs/common'
import { PrismaService, RequestContext } from 'src/common'
import { NotificationEntity } from '../../api/graphql/entities/notification.entity'
import { NotificationsFilterArgs } from '../../api/graphql/args/notifications-filter.args'
import { NotificationGateway } from '../../api/gateway/notification.gateway'

export interface CreateNotificationDto {
  userId: string
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS' | 'NEW_LEAD'
  priority?: 'LOW' | 'MEDIUM' | 'HIGH'
  title: string
  message: string
  leadId?: string
  metadata?: Record<string, any>
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name)

  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => NotificationGateway))
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async getNotifications(
    ctx: RequestContext,
    args: NotificationsFilterArgs,
  ): Promise<{ items: NotificationEntity[]; totalCount: number }> {
    const { user } = ctx
    if (!user?.id) {
      throw new InternalServerErrorException('User context is invalid.')
    }

    const { skip = 0, take = 10, onlyUnread } = args
    const where = { userId: user.id, ...(onlyUnread ? { isRead: false } : {}) }

    const [items, totalCount] = await this.prisma.$transaction([
      this.prisma.notification.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where }),
    ])

    return { items: items as unknown as NotificationEntity[], totalCount }
  }

  async unreadCount(ctx: RequestContext): Promise<number> {
    const { user } = ctx
    if (!user?.id) {
      throw new InternalServerErrorException('User context is invalid.')
    }
    return this.prisma.notification.count({
      where: { userId: user.id, isRead: false },
    })
  }

  async markAsRead(
    ctx: RequestContext,
    notificationId: string,
  ): Promise<NotificationEntity> {
    const { user } = ctx
    if (!user?.id) {
      throw new InternalServerErrorException('User context is invalid.')
    }

    const notif = await this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true, readAt: new Date() },
    })
    return notif as unknown as NotificationEntity
  }

  async markAllAsRead(ctx: RequestContext): Promise<number> {
    const { user } = ctx
    if (!user?.id) {
      throw new InternalServerErrorException('User context is invalid.')
    }
    const result = await this.prisma.notification.updateMany({
      where: { userId: user.id, isRead: false },
      data: { isRead: true, readAt: new Date() },
    })
    return result.count
  }

  /**
   * Create a notification and emit it via WebSocket
   */
  async createNotification(
    dto: CreateNotificationDto,
  ): Promise<NotificationEntity> {
    try {
      const notification = await this.prisma.notification.create({
        data: {
          userId: dto.userId,
          type: dto.type as any,
          priority: (dto.priority || 'MEDIUM') as any,
          title: dto.title,
          message: dto.message,
          leadId: dto.leadId,
          metadata: dto.metadata as any,
        },
      })

      // Emit via WebSocket to the user
      this.notificationGateway.emitNotificationToUser(
        dto.userId,
        notification,
      )

      // Also emit updated unread count
      const unreadCount = await this.prisma.notification.count({
        where: { userId: dto.userId, isRead: false },
      })
      this.notificationGateway.emitUnreadCountToUser(dto.userId, unreadCount)

      this.logger.log(
        `Notification created and emitted to user ${dto.userId}: ${dto.title}`,
      )

      return notification as unknown as NotificationEntity
    } catch (error) {
      this.logger.error(
        `Failed to create notification for user ${dto.userId}`,
        error?.stack,
      )
      throw error
    }
  }

  /**
   * Create multiple notifications and emit them via WebSocket
   */
  async createNotifications(
    dtos: CreateNotificationDto[],
  ): Promise<NotificationEntity[]> {
    const notifications: NotificationEntity[] = []

    for (const dto of dtos) {
      const notification = await this.createNotification(dto)
      notifications.push(notification)
    }

    return notifications
  }
}
