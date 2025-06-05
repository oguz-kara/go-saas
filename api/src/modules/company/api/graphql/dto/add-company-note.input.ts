// src/modules/company-note/api/graphql/dto/add-company-note.input.ts
import { InputType, Field } from '@nestjs/graphql'
import { IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator'

@InputType()
export class AddCompanyNoteInput {
  @Field()
  @IsNotEmpty({ message: 'Note content cannot be empty.' })
  @IsString()
  content: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  type?: string
}
