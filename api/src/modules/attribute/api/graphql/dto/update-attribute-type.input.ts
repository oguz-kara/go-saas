import { InputType, Field } from '@nestjs/graphql'
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

@InputType()
export class UpdateAttributeTypeInput {
  @Field()
  @IsNotEmpty({ message: 'Özellik tipi adı boş olamaz.' })
  @IsString()
  @MaxLength(100)
  name: string
}
