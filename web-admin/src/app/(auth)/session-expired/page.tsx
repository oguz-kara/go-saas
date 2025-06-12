// src/app/session-expired/page.tsx
'use client'

import { Button } from '@gocrm/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@gocrm/components/ui/card'
import { useTranslations } from '@gocrm/hooks/use-translations'
import { signOut } from 'next-auth/react'
import { AlertTriangle } from 'lucide-react'

export default function SessionExpiredPage() {
  const { translations, isLoading } = useTranslations()

  const handleLoginRedirect = () => {
    signOut({ callbackUrl: '/login' })
  }

  if (isLoading || !translations) {
    return null
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-full sm:max-w-sm text-center">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
          </div>
          <CardTitle className="mt-4 text-2xl">
            {translations.sessionExpiredDialog.title}
          </CardTitle>
          <CardDescription className="mt-2">
            {translations.sessionExpiredDialog.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleLoginRedirect} className="w-full">
            {translations.sessionExpiredDialog.loginButton}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
