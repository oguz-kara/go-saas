import { ArgsType, Field, ID } from '@nestjs/graphql'
import { IsArray, IsOptional } from 'class-validator'
import { ListQueryArgs } from 'src/common/graphql'
import {
  LeadSourceEnum,
  LeadStatusEnum,
  PriorityEnum,
} from '../enums/lead.enums'

@ArgsType()
export class LeadsFilterArgs extends ListQueryArgs {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  channelToken?: string

  @Field(() => [LeadStatusEnum], { nullable: true })
  @IsOptional()
  @IsArray()
  status?: LeadStatusEnum[]

  @Field(() => [LeadSourceEnum], { nullable: true })
  @IsOptional()
  @IsArray()
  source?: LeadSourceEnum[]

  @Field(() => [PriorityEnum], { nullable: true })
  @IsOptional()
  @IsArray()
  priority?: PriorityEnum[]

  @Field(() => ID, { nullable: true })
  @IsOptional()
  assignedToId?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  sortBy?: 'createdAt' | 'updatedAt' | 'priority'

  @Field(() => String, { nullable: true })
  @IsOptional()
  sortOrder?: 'asc' | 'desc'

  @Field(() => String, { nullable: true })
  @IsOptional()
  startDate?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  endDate?: string
}
