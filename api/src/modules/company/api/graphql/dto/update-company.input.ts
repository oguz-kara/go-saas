import { IsNotEmpty, IsOptional, IsUrl } from 'class-validator'
import { Prisma } from '@prisma/client'

import { Field, InputType } from '@nestjs/graphql'
import { MaxLength } from 'class-validator'
import GraphQLJSON from 'graphql-type-json'

@InputType()
export class UpdateCompanyInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(255)
  name?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUrl()
  website?: string | null

  @Field(() => String, { nullable: true })
  @IsOptional()
  @MaxLength(100)
  industry?: string | null

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUrl()
  linkedinUrl?: string | null

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  address?: Prisma.JsonObject | null

  @Field(() => String, { nullable: true })
  @IsOptional()
  @MaxLength(2000)
  description?: string | null

  @Field(() => [String], { nullable: true })
  @IsOptional()
  attributeIds?: string[]
}
