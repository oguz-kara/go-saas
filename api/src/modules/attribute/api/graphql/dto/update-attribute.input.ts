// src/modules/attribute/api/graphql/dto/update-attribute.input.ts
import { InputType, Field } from '@nestjs/graphql'
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

@InputType()
export class UpdateAttributeInput {
  @Field()
  @IsNotEmpty({ message: 'Değer boş olamaz.' })
  @IsString()
  @MaxLength(100)
  value: string // Sadece değeri güncellemeyi destekliyoruz
}
