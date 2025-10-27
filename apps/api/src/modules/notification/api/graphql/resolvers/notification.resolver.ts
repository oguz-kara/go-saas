import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql'
import { ProtectResource } from 'src/common/decorators/protect-resource.decorator'
import { RequestContext } from 'src/common/request-context/request-context'
import { Ctx } from 'src/common/request-context/request-context.decorator'
import { NotificationEntity } from '../entities/notification.entity'
import { NotificationService } from 'src/modules/notification/application/services/notification.service'
import { NotificationConnectionObject as NotificationConnection } from '../dto/notification-connection.object-type'
import { NotificationsFilterArgs } from '../args/notifications-filter.args'

@Resolver(() => NotificationEntity)
@ProtectResource()
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @Query(() => NotificationConnection, { name: 'notifications' })
  async getNotifications(
    @Ctx() ctx: RequestContext,
    @Args() filterArgs: NotificationsFilterArgs,
  ): Promise<NotificationConnection> {
    return this.notificationService.getNotifications(ctx, filterArgs)
  }

  @Query(() => Number, { name: 'unreadCount' })
  async unreadCount(@Ctx() ctx: RequestContext): Promise<number> {
    return this.notificationService.unreadCount(ctx)
  }

  @Mutation(() => NotificationEntity, { name: 'markAsRead' })
  async markAsRead(
    @Ctx() ctx: RequestContext,
    @Args('notificationId', { type: () => ID }) notificationId: string,
  ): Promise<NotificationEntity> {
    return this.notificationService.markAsRead(ctx, notificationId)
  }

  @Mutation(() => Number, { name: 'markAllAsRead' })
  async markAllAsRead(@Ctx() ctx: RequestContext): Promise<number> {
    return this.notificationService.markAllAsRead(ctx)
  }
}


