import { Field, ID, InputType } from '@nestjs/graphql'
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator'
import {
  LeadSourceEnum,
  LeadStatusEnum,
  PriorityEnum,
  ProductInterestEnum,
} from '../enums/lead.enums'

@InputType()
export class UpdateLeadInput {
  @Field(() => ID)
  id: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  firstName?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  lastName?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  phone?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  company?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  jobTitle?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  website?: string

  @Field(() => LeadStatusEnum, { nullable: true })
  @IsOptional()
  @IsEnum(LeadStatusEnum)
  status?: LeadStatusEnum

  @Field(() => LeadSourceEnum, { nullable: true })
  @IsOptional()
  @IsEnum(LeadSourceEnum)
  source?: LeadSourceEnum

  @Field(() => PriorityEnum, { nullable: true })
  @IsOptional()
  @IsEnum(PriorityEnum)
  priority?: PriorityEnum

  @Field(() => [ProductInterestEnum], { nullable: true })
  @IsOptional()
  @IsArray()
  productInterest?: ProductInterestEnum[]

  @Field(() => String, { nullable: true })
  @IsOptional()
  budget?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  timeline?: string

  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  companySize?: number

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isDecisionMaker?: boolean

  @Field(() => String, { nullable: true })
  @IsOptional()
  painPoints?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  currentSolution?: string

  @Field(() => ID, { nullable: true })
  @IsOptional()
  assignedToId?: string
}
