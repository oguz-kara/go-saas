import { ArgsType, Field, ID } from '@nestjs/graphql'
import { IsBoolean, IsOptional } from 'class-validator'
import { ListQueryArgs } from 'src/common/graphql'

@ArgsType()
export class ActivitiesFilterArgs extends ListQueryArgs {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  leadId?: string

  @Field(() => ID, { nullable: true })
  @IsOptional()
  userId?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  type?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  startDate?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  endDate?: string

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  isCompleted?: boolean
}


