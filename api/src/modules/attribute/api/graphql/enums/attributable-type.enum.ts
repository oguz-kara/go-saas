// src/modules/attribute/api/graphql/enums/attributable-type.enum.ts
import { registerEnumType } from '@nestjs/graphql'

export enum AttributableType {
  COMPANY = 'COMPANY',
}

registerEnumType(AttributableType, {
  name: 'AttributableType',
  description: 'The type of attributable entity',
})
