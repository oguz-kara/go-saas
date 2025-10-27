// src/modules/attribute-group/api/graphql/dto/update-attribute-group.input.ts
import { InputType, Field } from '@nestjs/graphql'
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

@InputType()
export class UpdateAttributeGroupInput {
  @Field()
  @IsNotEmpty({ message: 'Grup adı boş olamaz.' })
  @IsString()
  @MaxLength(100)
  name: string
}
