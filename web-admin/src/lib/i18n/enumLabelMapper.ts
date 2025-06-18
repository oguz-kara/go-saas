import { tr } from './tr'
import { AttributeDataType, AttributeTypeKind } from '@gocrm/graphql/generated/hooks'

export function getDataTypeLabel(dataType: AttributeDataType | string): string {
  return tr.attributeStudio[`dataTypeLabels_${dataType}`] as string || String(dataType)
}

export function getKindLabel(kind: AttributeTypeKind | string): string {
  return tr.attributeStudio[`kindLabels_${kind}`] as string || String(kind)
} 