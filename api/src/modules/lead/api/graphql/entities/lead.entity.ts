import { ObjectType, Field, ID } from '@nestjs/graphql'
import { UserEntity } from 'src/modules/auth/api/graphql/entities/user.entity'
import {
  LeadStatusEnum,
  LeadSourceEnum,
  ProductInterestEnum,
  PriorityEnum,
} from '../enums/lead.enums'
import { ActivityEntity } from './activity.entity'
import { NoteEntity } from './note.entity'
import { TagEntity } from './tag.entity'

@ObjectType('Lead')
export class LeadEntity {
  @Field(() => ID)
  id: string

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date

  // Contact Information
  @Field(() => String)
  firstName: string

  @Field(() => String)
  lastName: string

  @Field(() => String)
  email: string

  @Field(() => String, { nullable: true })
  phone?: string | null

  @Field(() => String, { nullable: true })
  company?: string | null

  @Field(() => String, { nullable: true })
  jobTitle?: string | null

  @Field(() => String, { nullable: true })
  website?: string | null

  // Lead Details
  @Field(() => LeadStatusEnum)
  status: LeadStatusEnum

  @Field(() => LeadSourceEnum)
  source: LeadSourceEnum

  @Field(() => PriorityEnum)
  priority: PriorityEnum

  // Product Interest
  @Field(() => [ProductInterestEnum])
  productInterest: ProductInterestEnum[]

  @Field(() => String, { nullable: true })
  budget?: string | null

  @Field(() => String, { nullable: true })
  timeline?: string | null

  // Qualification
  @Field(() => Number, { nullable: true })
  companySize?: number | null

  @Field(() => Boolean)
  isDecisionMaker: boolean

  @Field(() => String, { nullable: true })
  painPoints?: string | null

  @Field(() => String, { nullable: true })
  currentSolution?: string | null

  // Tracking
  @Field(() => Date, { nullable: true })
  lastContactedAt?: Date | null

  @Field(() => Date, { nullable: true })
  convertedAt?: Date | null

  @Field(() => String, { nullable: true })
  lostReason?: string | null

  // Relations
  @Field(() => UserEntity, { nullable: true })
  assignedTo?: UserEntity | null

  @Field(() => String, { nullable: true })
  assignedToId?: string | null

  @Field(() => [ActivityEntity], { nullable: true })
  activities?: ActivityEntity[]

  @Field(() => Number, { nullable: true })
  activitiesCount?: number

  @Field(() => [NoteEntity], { nullable: true })
  notes?: NoteEntity[]

  @Field(() => Number, { nullable: true })
  notesCount?: number

  @Field(() => [TagEntity], { nullable: true })
  tags?: TagEntity[]

  @Field(() => Number, { nullable: true })
  tagsCount?: number
}
