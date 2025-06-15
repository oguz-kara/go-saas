// src/modules/attribute/api/graphql/dto/update-attribute-type.input.ts
import { InputType, Field, ID } from '@nestjs/graphql'
import { IsNotEmpty, IsUUID } from 'class-validator'
import { CreateAttributeTypeInput } from './create-attribute-type.input'

@InputType()
export class UpdateAttributeTypeInput extends CreateAttributeTypeInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsUUID()
  id: string
}
