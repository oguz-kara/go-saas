import { registerEnumType } from '@nestjs/graphql'

export enum NotificationTypeEnum {
  NEW_LEAD = 'NEW_LEAD',
  LEAD_STATUS_CHANGED = 'LEAD_STATUS_CHANGED',
  ACTIVITY_DUE = 'ACTIVITY_DUE',
  LEAD_ASSIGNED = 'LEAD_ASSIGNED',
}

export enum NotificationPriorityEnum {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

registerEnumType(NotificationTypeEnum, { name: 'NotificationType' })
registerEnumType(NotificationPriorityEnum, { name: 'NotificationPriority' })


