// src/modules/attribute/api/graphql/dto/create-attribute-type.input.ts
import { InputType, Field, ID } from '@nestjs/graphql'
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsEnum,
  IsUUID,
  IsArray,
} from 'class-validator'

import GraphQLJSON from 'graphql-type-json'
import { AttributableType } from '../enums/attributable-type.enum'
import { AttributeTypeKind } from '../enums/attribute-type-kind.enum'
import { AttributeDataType } from '../enums/attribute-data-type.enum'

@InputType()
export class CreateAttributeTypeInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string

  @Field(() => AttributeTypeKind)
  @IsEnum(AttributeTypeKind)
  kind: AttributeTypeKind

  @Field(() => AttributeDataType)
  @IsEnum(AttributeDataType)
  dataType: AttributeDataType

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  groupId?: string

  @Field(() => [AttributableType])
  @IsArray()
  @IsEnum(AttributableType, { each: true })
  availableFor: AttributableType[]

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  config?: Record<string, any>
}
