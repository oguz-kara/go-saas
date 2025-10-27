import { AttributableType } from '@/graphql/generated/hooks'
import { Translations } from '@/lib/i18n'

export const attributableToTextMapper = (
  attributable: AttributableType,
  t: Translations['attributeStudio'],
) => {
  switch (attributable) {
    case AttributableType.Company:
      return t?.availableForLabels_COMPANY || 'Company'
    default:
      return t?.availableForLabels_UNKNOWN || 'Unknown'
  }
}
