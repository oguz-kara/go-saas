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
import { useAuthNotifications } from '@gocrm/features/auth/hooks/use-auth-notifications'

export default function LoginPage() {
  const { translations, isLoading } = useTranslations()

  useAuthNotifications()

  if (isLoading || !translations) {
    return <div>Yükleniyor...</div>
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">
            {translations?.loginPage.title}
          </CardTitle>
          <CardDescription>
            {translations?.loginPage.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  )
}
