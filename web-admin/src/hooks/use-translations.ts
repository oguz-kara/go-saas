'use client'

import { useTranslationsContext } from '../contexts/translations-context'

export const useTranslations = () => {
  const { translations, isLoading } = useTranslationsContext()
  return { translations, isLoading }
}
