'use client'

import { useRealtimeNotifications } from '../hooks/use-realtime-notifications'
import { NotificationPermissionPrompt } from './notification-permission-prompt'
import { useTranslations } from '@/hooks/use-translations'

/**
 * Provider component that initializes real-time notifications
 * and shows the permission prompt when needed
 */
export function RealtimeNotificationsProvider() {
  const { translations } = useTranslations()
  const t = translations?.realtimeNotifications
  const { connectionState, isConnected } = useRealtimeNotifications()

  // Log connection state in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[RealtimeNotificationsProvider] Connection state:', connectionState)
  }

  return (
    <>
      {/* Connection status indicator (optional, for debugging) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 z-50">
          <div
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              isConnected
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
            }`}
          >
{isConnected ? `🟢 ${t?.connected || 'Connected'}` : `🟡 ${t?.disconnected || 'Disconnected'}`}
          </div>
        </div>
      )}

      {/* Notification permission prompt */}
      <NotificationPermissionPrompt />
    </>
  )
}

