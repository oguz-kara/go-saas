// src/contexts/translations-context.tsx
'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { tr, Translations } from '../lib/i18n/tr'

interface ITranslationsContext {
  translations: Translations | null
  isLoading: boolean
  locale: string
}

const TranslationsContext = createContext<ITranslationsContext | undefined>(
  undefined,
)

export const TranslationsProvider = ({ children }: { children: ReactNode }) => {
  const [translations, setTranslations] = useState<Translations | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [locale] = useState<string>('tr') // Turkish locale

  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true)
      try {
        setTimeout(() => {
          setTranslations(tr)
          setIsLoading(false)
        }, 200)
      } catch (error) {
        console.error('Failed to load translations:', error)
        setIsLoading(false)
      }
    }

    loadTranslations()
  }, [])

  const value = { translations, isLoading, locale }

  if (isLoading) {
    return null
  }

  return (
    <TranslationsContext.Provider value={value}>
      {children}
    </TranslationsContext.Provider>
  )
}

// Hook'u context'i tüketmek için oluşturuyoruz
export const useTranslationsContext = () => {
  const context = useContext(TranslationsContext)
  if (context === undefined) {
    throw new Error(
      'useTranslationsContext must be used within a TranslationsProvider',
    )
  }
  return context
}
