import 'server-only'
import { tr, Translations } from '@gocrm/lib/i18n/tr'

const dictionaries = {
  tr,
}

export const getTranslations = async (
  locale?: string,
): Promise<Translations> => {
  console.log({ locale })
  await Promise.resolve()

  return dictionaries.tr
}
