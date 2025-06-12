import 'server-only'
import { tr, Translations } from '@gocrm/lib/i18n/tr'

const dictionaries = {
  tr,
}

export const getTranslations = async (
  locale?: string,
): Promise<Translations> => {
  await Promise.resolve()
  console.log('locale', locale)

  return dictionaries.tr
}
