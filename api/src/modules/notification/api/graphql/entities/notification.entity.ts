import { ObjectType, Field, ID } from '@nestjs/graphql'
import { NotificationPriorityEnum, NotificationTypeEnum } from '../enums/notification.enums'
import GraphQLJSON from 'graphql-type-json'

@ObjectType('Notification')
export class NotificationEntity {
  @Field(() => ID)
  id: string

  @Field(() => Date)
  createdAt: Date

  @Field(() => NotificationTypeEnum)
  type: NotificationTypeEnum

  @Field(() => NotificationPriorityEnum)
  priority: NotificationPriorityEnum

  @Field(() => String)
  title: string

  @Field(() => String)
  message: string

  @Field(() => Boolean)
  isRead: boolean

  @Field(() => Date, { nullable: true })
  readAt?: Date | null

  @Field(() => String, { nullable: true })
  leadId?: string | null

  @Field(() => String, { nullable: true })
  userId?: string | null

  @Field(() => GraphQLJSON, { nullable: true })
  metadata?: Record<string, any> | null
}


