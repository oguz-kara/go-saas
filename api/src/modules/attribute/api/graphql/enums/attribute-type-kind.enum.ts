// src/modules/attribute/api/graphql/enums/attribute-type-kind.enum.ts
import { registerEnumType } from '@nestjs/graphql'

export enum AttributeTypeKind {
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
  BOOLEAN = 'BOOLEAN',
}

registerEnumType(AttributeTypeKind, {
  name: 'AttributeTypeKind',
  description: 'The kind of attribute type',
})
