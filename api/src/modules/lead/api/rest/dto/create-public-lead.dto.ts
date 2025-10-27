import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'
import { LeadSourceEnum } from '../../graphql/enums/lead.enums'

export class CreatePublicLeadDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  firstName: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  lastName: string

  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string

  @IsOptional()
  @IsString()
  @MaxLength(200)
  company?: string

  @IsOptional()
  @IsString()
  @MaxLength(100)
  jobTitle?: string

  @IsOptional()
  @IsString()
  @MaxLength(500)
  website?: string

  @IsEnum(LeadSourceEnum)
  @IsNotEmpty()
  source: LeadSourceEnum

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  message?: string // Additional message/notes from the contact form
}
