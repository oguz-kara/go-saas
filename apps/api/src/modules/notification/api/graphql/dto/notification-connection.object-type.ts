import { ObjectType, Field, Int } from '@nestjs/graphql'
import { NotificationEntity } from '../entities/notification.entity'

@ObjectType('NotificationConnection')
export class NotificationConnectionObject {
  @Field(() => [NotificationEntity])
  items: NotificationEntity[]

  @Field(() => Int)
  totalCount: number
}


