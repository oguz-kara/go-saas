'use client'

import { useState, useEffect } from 'react'
import { Bell, X } from 'lucide-react'
import { Button } from '@gocrm/components/ui/button'
import { Card, CardContent } from '@gocrm/components/ui/card'
import { browserNotificationManager } from '@gocrm/lib/notifications/browser-notification-manager'
import { useTranslations } from '@gocrm/hooks/use-translations'

export function NotificationPermissionPrompt() {
  const { translations } = useTranslations()
  const t = translations?.realtimeNotifications
  const [show, setShow] = useState(false)
  const [permissionState, setPermissionState] =
    useState<NotificationPermission>('default')

  useEffect(() => {
    if (!browserNotificationManager.isSupported()) {
      return
    }

    const currentPermission = browserNotificationManager.getPermissionState()
    setPermissionState(currentPermission)

    // Show prompt if permission is still default and user hasn't dismissed it permanently
    const dismissed = localStorage.getItem('notification-prompt-dismissed')
    if (currentPermission === 'default' && !dismissed) {
      // Show after a short delay to not overwhelm the user
      const timer = setTimeout(() => setShow(true), 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleRequestPermission = async () => {
    const permission = await browserNotificationManager.requestPermission()
    setPermissionState(permission)
    setShow(false)

    if (permission === 'granted') {
      // Show a test notification
      await browserNotificationManager.show({
        id: 'test',
        title: t?.notEnabledTitle || 'Notifications Enabled!',
        message:
          t?.notEnabledMessage ||
          'You will now receive real-time notifications',
        type: 'SUCCESS',
        priority: 'MEDIUM',
        isRead: false,
        createdAt: new Date().toISOString(),
      })
    }
  }

  const handleDismiss = () => {
    setShow(false)
    localStorage.setItem('notification-prompt-dismissed', 'true')
  }

  const handleDismissTemporary = () => {
    setShow(false)
  }

  if (!show || permissionState !== 'default') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md animate-in slide-in-from-bottom-5">
      <Card className="border-primary/50 shadow-lg">
        <CardContent className="flex gap-4 p-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="rounded-md bg-primary/10 p-2">
              <Bell className="size-6 text-primary" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="font-semibold">
                {t?.title || 'Enable Notifications'}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {t?.description ||
                  "Get instant alerts for new leads and important updates, even when you're on another tab."}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleRequestPermission}
                size="sm"
                className="gap-2"
              >
                <Bell className="size-4" />
                {t?.enableButton || 'Enable Notifications'}
              </Button>
              <Button
                onClick={handleDismissTemporary}
                size="sm"
                variant="ghost"
              >
                {t?.maybeLater || 'Maybe Later'}
              </Button>
              <Button
                onClick={handleDismiss}
                size="sm"
                variant="ghost"
                className="text-muted-foreground"
              >
                {t?.dontAskAgain || "Don't Ask Again"}
              </Button>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={handleDismissTemporary}
            className="flex-shrink-0 text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </CardContent>
      </Card>
    </div>
  )
}
