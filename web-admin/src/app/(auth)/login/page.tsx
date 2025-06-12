'use client'

import { LoginForm } from '@gocrm/features/auth/components/login-form'
import { useTranslations } from '@gocrm/hooks/use-translations'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@gocrm/components/ui/card'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { useEffect } from 'react'

export default function LoginPage() {
  const { translations, isLoading } = useTranslations()
  const searchParams = useSearchParams()
  const sessionExpired = searchParams.get('session_expired')

  useEffect(() => {
    console.log('sessionExpired', sessionExpired)
    if (sessionExpired === 'true') {
      console.log('toast not working')
      toast.info('Oturum Süreniz Doldu', {
        description: 'Lütfen devam etmek için tekrar giriş yapın.',
      })
    }
  }, [searchParams])

  if (isLoading || !translations) {
    return <div>Yükleniyor...</div>
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">
            {translations.loginPage.title}
          </CardTitle>
          <CardDescription>
            {translations.loginPage.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  )
}
