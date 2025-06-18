import { InputType, Field } from '@nestjs/graphql'
import GraphQLJSON from 'graphql-type-json'
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'

@InputType()
export class CreateCompanyInput {
  @Field()
  @IsNotEmpty()
  @MaxLength(200)
  name: string

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(200)
  website?: string

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(200)
  taxId?: string

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(200)
  linkedinUrl?: string

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  address?: Record<string, any>

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(200)
  phoneNumber?: string

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(200)
  email?: string

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  socialProfiles?: Record<string, any>

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(1000)
  description?: string

  @Field(() => [String], { nullable: true })
  @IsOptional()
  attributeIds?: string[]

  @Field(() => [String], {
    nullable: true,
    description:
      'Hiyerarşik adres değerlerinin kodları (örn: ["turkiye", "izmir", "bornova"])',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  addressAttributeCodes?: string[]
}
