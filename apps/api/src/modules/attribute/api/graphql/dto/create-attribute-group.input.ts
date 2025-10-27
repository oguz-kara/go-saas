// src/modules/attribute-group/api/graphql/dto/create-attribute-group.input.ts
import { InputType, Field } from '@nestjs/graphql'
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

@InputType()
export class CreateAttributeGroupInput {
  @Field()
  @IsNotEmpty({ message: 'Grup adı boş olamaz.' })
  @IsString()
  @MaxLength(100)
  name: string
}
