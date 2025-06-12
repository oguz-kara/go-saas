// src/hooks/use-auth-notifications.ts
'use client'

import { useEffect } from 'react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useTranslations } from '@gocrm/hooks/use-translations'

export const useAuthNotifications = () => {
  const { translations, isLoading } = useTranslations()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (isLoading || !translations) {
      return
    }

    const sessionExpired = searchParams.get('session_expired')
    const loggedOut = searchParams.get('logged_out')
    const loginRedirect = searchParams.get('login_redirect')

    let toastShown = false

    if (sessionExpired === 'true') {
      toast.info(translations.authNotifications.sessionExpiredTitle, {
        description: translations.authNotifications.sessionExpiredDescription,
      })
      toastShown = true
    } else if (loggedOut === 'true') {
      toast.success(translations.authNotifications.loggedOutTitle, {
        description: translations.authNotifications.loggedOutDescription,
      })
      toastShown = true
    } else if (loginRedirect === 'true') {
      toast.info(translations.authNotifications.loginRedirectTitle, {
        description: translations.authNotifications.loginRedirectDescription,
      })
      toastShown = true
    }

    if (toastShown) {
      const newSearchParams = new URLSearchParams(searchParams.toString())
      newSearchParams.delete('session_expired')
      newSearchParams.delete('logged_out')

      router.replace(`${pathname}?${newSearchParams.toString()}`)
    }
  }, [searchParams, translations, isLoading, pathname, router])
}
