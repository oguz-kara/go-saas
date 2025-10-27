import { ObjectType, Field, ID } from '@nestjs/graphql'

@ObjectType('LeadActivity')
export class ActivityEntity {
  @Field(() => ID)
  id: string

  @Field(() => Date)
  createdAt: Date

  @Field(() => String)
  type: string

  @Field(() => String)
  subject: string

  @Field(() => String, { nullable: true })
  description?: string | null

  @Field(() => Date, { nullable: true })
  scheduledAt?: Date | null

  @Field(() => Date, { nullable: true })
  completedAt?: Date | null

  @Field(() => String)
  leadId: string

  @Field(() => String)
  userId: string
}
