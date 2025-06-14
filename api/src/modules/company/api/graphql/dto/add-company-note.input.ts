// src/modules/company-note/api/graphql/dto/add-company-note.input.ts
import { InputType, Field } from '@nestjs/graphql'
import { CompanyNoteType } from '@prisma/client'
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsEnum,
} from 'class-validator'

@InputType()
export class AddCompanyNoteInput {
  @Field()
  @IsNotEmpty({ message: 'Note content cannot be empty.' })
  @IsString()
  content: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(CompanyNoteType)
  @MaxLength(50)
  type?: CompanyNoteType
}
