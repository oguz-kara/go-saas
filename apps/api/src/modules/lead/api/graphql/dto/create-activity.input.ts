import { Field, ID, InputType } from '@nestjs/graphql'
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator'

@InputType()
export class CreateActivityInput {
  @Field(() => String)
  @IsString()
  type: string

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  subject: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  description?: string

  @Field(() => ID)
  leadId: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string
}
