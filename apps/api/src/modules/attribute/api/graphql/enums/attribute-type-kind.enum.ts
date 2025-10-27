// src/modules/attribute/api/graphql/enums/attribute-type-kind.enum.ts
import { registerEnumType } from '@nestjs/graphql'

export enum AttributeTypeKind {
  TEXT = 'TEXT',
  SELECT = 'SELECT',
  MULTI_SELECT = 'MULTI_SELECT',
  HIERARCHICAL = 'HIERARCHICAL',
}

registerEnumType(AttributeTypeKind, {
  name: 'AttributeTypeKind',
  description: 'The kind of attribute type',
})
