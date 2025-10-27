'use client'

import { useTranslationsContext } from '../contexts/translations-context'

export const useTranslations = () => {
  const { translations, isLoading, locale } = useTranslationsContext()
  return { translations, isLoading, locale }
}
