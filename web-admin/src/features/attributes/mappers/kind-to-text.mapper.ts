import { AttributeTypeKind } from '@gocrm/graphql/generated/hooks'
import { Translations } from '@gocrm/lib/i18n'

export const kindToTextMapper = (
  kind: AttributeTypeKind,
  t: Translations['attributeStudio'],
) => {
  switch (kind) {
    case AttributeTypeKind.Hierarchical:
      return t?.kindLabels_HIERARCHICAL || 'Hierarchical'
    case AttributeTypeKind.MultiSelect:
      return t?.kindLabels_MULTI_SELECT || 'Multi-Select'
    case AttributeTypeKind.Select:
      return t?.kindLabels_SELECT || 'Select'
    case AttributeTypeKind.Text:
      return t?.kindLabels_TEXT || 'Text'
  }
}
