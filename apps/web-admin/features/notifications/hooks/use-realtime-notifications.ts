'use client'

import { useEffect, useState, useCallback } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  socketService,
  ConnectionState,
  NotificationPayload,
} from '@/lib/socket/socket-service'
import { browserNotificationManager } from '@/lib/notifications/browser-notification-manager'
import { toast } from 'sonner'
import { useTranslations } from '@/hooks/use-translations'

export interface UseRealtimeNotificationsReturn {
  connectionState: ConnectionState
  isConnected: boolean
  unreadCount: number
}

export function useRealtimeNotifications(): UseRealtimeNotificationsReturn {
  const apolloClient = useApolloClient()
  const router = useRouter()
  const { data: session } = useSession()
  const { translations } = useTranslations()
  const t = translations?.realtimeNotifications
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected')
  const [unreadCount, setUnreadCount] = useState(0)

  // Get access token from session
  const accessToken = (session as any)?.accessToken as string | undefined

  const handleNewNotification = useCallback(
    (notification: NotificationPayload) => {
      console.log('[useRealtimeNotifications] New notification:', notification)

      // Update Apollo cache
      apolloClient.cache.modify({
        fields: {
          notifications(existingNotifications = { items: [], totalCount: 0 }) {
            // Add new notification to the beginning of the list
            const newNotificationRef = apolloClient.cache.writeFragment({
              data: notification,
              fragment: gql`
                fragment NewNotification on Notification {
                  id
                  createdAt
                  type
                  priority
                  title
                  message
                  isRead
                  readAt
                  leadId
                  userId
                  metadata
                }
              `,
            })

            return {
              ...existingNotifications,
              items: [newNotificationRef, ...existingNotifications.items],
              totalCount: existingNotifications.totalCount + 1,
            }
          },
        },
      })

      // Show browser notification (only if tab is not focused)
      browserNotificationManager.show(notification)

      // Show toast notification (always)
      const toastMessage = notification.message.length > 60
        ? `${notification.message.substring(0, 60)}...`
        : notification.message

      toast(notification.title, {
        description: toastMessage,
        action: notification.leadId
          ? {
              label: t?.view || 'View',
              onClick: () => {
                router.push(`/leads/${notification.leadId}`)
              },
            }
          : undefined,
      })
    },
    [apolloClient, router, t],
  )

  const handleUnreadCount = useCallback((count: number) => {
    console.log('[useRealtimeNotifications] Unread count update:', count)
    setUnreadCount(count)

    // Update Apollo cache
    apolloClient.cache.modify({
      fields: {
        unreadCount() {
          return count
        },
      },
    })
  }, [apolloClient])

  const handleConnectionStateChange = useCallback((state: ConnectionState) => {
    console.log('[useRealtimeNotifications] Connection state:', state)
    setConnectionState(state)
  }, [])

  useEffect(() => {
    if (!accessToken) {
      console.log('[useRealtimeNotifications] No session token, skipping WebSocket connection')
      return
    }

    console.log('[useRealtimeNotifications] Initializing WebSocket connection')

    // Connect to WebSocket server
    socketService.connect(accessToken)

    // Subscribe to events
    const unsubscribeNotification = socketService.onNotification(handleNewNotification)
    const unsubscribeUnreadCount = socketService.onUnreadCount(handleUnreadCount)
    const unsubscribeConnectionState = socketService.onConnectionStateChange(
      handleConnectionStateChange,
    )

    // Set initial connection state
    setConnectionState(socketService.getConnectionState())

    // Cleanup on unmount
    return () => {
      console.log('[useRealtimeNotifications] Cleaning up')
      unsubscribeNotification()
      unsubscribeUnreadCount()
      unsubscribeConnectionState()
      socketService.disconnect()
    }
  }, [accessToken, handleNewNotification, handleUnreadCount, handleConnectionStateChange])

  return {
    connectionState,
    isConnected: connectionState === 'connected',
    unreadCount,
  }
}
