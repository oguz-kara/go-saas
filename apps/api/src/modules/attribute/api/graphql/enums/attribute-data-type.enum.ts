// src/modules/attribute/api/graphql/enums/attribute-data-type.enum.ts
import { registerEnumType } from '@nestjs/graphql'

export enum AttributeDataType {
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
  BOOLEAN = 'BOOLEAN',
}

registerEnumType(AttributeDataType, {
  name: 'AttributeDataType',
  description: 'The data type of the attribute',
})
