import { AttributeDataType } from '@gocrm/graphql/generated/hooks'
import { Translations } from '@gocrm/lib/i18n'

export const dataTypeToTextMapper = (
  dataType: AttributeDataType,
  t: Translations['attributeStudio'],
) => {
  switch (dataType) {
    case AttributeDataType.Boolean:
      return t?.dataTypeLabels_BOOLEAN || 'Boolean'
    case AttributeDataType.Date:
      return t?.dataTypeLabels_DATE || 'Date'
    case AttributeDataType.Number:
      return t?.dataTypeLabels_NUMBER || 'Number'
    case AttributeDataType.Text:
      return t?.dataTypeLabels_TEXT || 'Text'
    default:
      return t?.dataTypeLabels_UNKNOWN || 'Unknown'
  }
}
