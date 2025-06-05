import { InputType, Field } from '@nestjs/graphql'
import { IsOptional, IsString, MaxLength, IsNotEmpty } from 'class-validator'

@InputType()
export class UpdateCompanyNoteInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsNotEmpty({ message: 'Note content cannot be empty if provided.' })
  @IsString()
  content?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  type?: string
}
