// src/modules/attribute/api/graphql/dto/create-attribute.input.ts
import { InputType, Field, ID } from '@nestjs/graphql'
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsUUID,
  IsOptional,
} from 'class-validator'
import GraphQLJSON from 'graphql-type-json'

@InputType()
export class CreateAttributeInput {
  @Field()
  @IsNotEmpty({ message: 'Değer boş olamaz.' })
  @IsString()
  @MaxLength(100)
  value: string // Örn: "Yazılım", "Potansiyel Müşteri"

  @Field(() => ID)
  @IsNotEmpty()
  @IsUUID()
  attributeTypeId: string // Hangi tipe ait olduğu (örn: "Sektör" tipinin ID'si)

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  parentId?: string

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  meta?: Record<string, any>
}
