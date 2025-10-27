import { Field, ID, InputType } from '@nestjs/graphql'
import { IsDateString, IsOptional, IsString } from 'class-validator'

@InputType()
export class UpdateActivityInput {
  @Field(() => ID)
  id: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  type?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  subject?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  description?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string
}
