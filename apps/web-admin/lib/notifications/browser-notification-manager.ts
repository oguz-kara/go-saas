import { NotificationPayload } from '../socket/socket-service'

export type NotificationPermissionState = 'default' | 'granted' | 'denied'

class BrowserNotificationManager {
  private notificationSound: HTMLAudioElement | null = null
  private permissionState: NotificationPermissionState = 'default'

  constructor() {
    if (typeof window !== 'undefined') {
      this.permissionState = this.getPermissionState()
      this.initializeSound()
    }
  }

  /**
   * Request notification permission from the user
   */
  async requestPermission(): Promise<NotificationPermissionState> {
    if (!this.isSupported()) {
      console.warn('[BrowserNotificationManager] Notifications not supported')
      return 'denied'
    }

    try {
      const permission = await Notification.requestPermission()
      this.permissionState = permission
      this.savePermissionState(permission)
      return permission
    } catch (error) {
      console.error('[BrowserNotificationManager] Permission request failed:', error)
      return 'denied'
    }
  }

  /**
   * Show a browser notification
   * Only shows when tab is not focused
   */
  async show(notification: NotificationPayload): Promise<void> {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return
    }

    // Only show if tab is not focused
    if (!document.hidden) {
      console.log('[BrowserNotificationManager] Tab is focused, skipping browser notification')
      return
    }

    if (!this.canShowNotifications()) {
      console.log('[BrowserNotificationManager] Cannot show notifications')
      return
    }

    try {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.id,
        requireInteraction: false,
        silent: false, // We'll play our own sound
        data: {
          id: notification.id,
          leadId: notification.leadId,
          url: notification.leadId ? `/leads/${notification.leadId}` : '/notifications',
        },
      })

      browserNotification.onclick = (event) => {
        event.preventDefault()
        window.focus()
        
        const data = browserNotification.data
        if (data?.url) {
          window.location.href = data.url
        }
        
        browserNotification.close()
      }

      // Play sound
      this.playSound()

      console.log('[BrowserNotificationManager] Notification shown:', notification.title)
    } catch (error) {
      console.error('[BrowserNotificationManager] Failed to show notification:', error)
    }
  }

  /**
   * Check if browser notifications are supported
   */
  isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window
  }

  /**
   * Check if we can show notifications
   */
  canShowNotifications(): boolean {
    return this.isSupported() && this.permissionState === 'granted'
  }

  /**
   * Get current permission state
   */
  getPermissionState(): NotificationPermissionState {
    if (!this.isSupported()) return 'denied'
    
    const savedPermission = this.loadPermissionState()
    if (savedPermission) return savedPermission
    
    return Notification.permission as NotificationPermissionState
  }

  /**
   * Play notification sound
   */
  private playSound(): void {
    if (!this.notificationSound) {
      return
    }

    try {
      this.notificationSound.currentTime = 0
      const playPromise = this.notificationSound.play()
      
      // Handle promise rejection silently to avoid console errors
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Audio playback failed - this is expected in some browsers
          // when there's no user interaction
        })
      }
    } catch {
      // Ignore play errors silently
    }
  }

  /**
   * Initialize notification sound
   */
  private initializeSound(): void {
    try {
      this.notificationSound = new Audio('/sounds/notification.mp3')
      this.notificationSound.volume = 0.5
    } catch (error) {
      console.error('[BrowserNotificationManager] Failed to initialize sound:', error)
    }
  }

  /**
   * Save permission state to localStorage
   */
  private savePermissionState(state: NotificationPermissionState): void {
    try {
      localStorage.setItem('notification-permission', state)
    } catch (error) {
      console.error('[BrowserNotificationManager] Failed to save permission state:', error)
    }
  }

  /**
   * Load permission state from localStorage
   */
  private loadPermissionState(): NotificationPermissionState | null {
    try {
      const saved = localStorage.getItem('notification-permission')
      return saved as NotificationPermissionState | null
    } catch {
      return null
    }
  }
}

// Export singleton instance
export const browserNotificationManager = new BrowserNotificationManager()

