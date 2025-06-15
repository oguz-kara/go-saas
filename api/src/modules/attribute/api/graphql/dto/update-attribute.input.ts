// src/modules/attribute/api/graphql/dto/update-attribute.input.ts
import { InputType, PartialType } from '@nestjs/graphql'
import { CreateAttributeInput } from './create-attribute.input'

@InputType()
export class UpdateAttributeInput extends PartialType(CreateAttributeInput) {}
