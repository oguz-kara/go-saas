import { io, Socket } from 'socket.io-client'

export type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error'

export interface NotificationPayload {
  id: string
  createdAt: string
  type: string
  priority: string
  title: string
  message: string
  isRead: boolean
  readAt?: string | null
  leadId?: string | null
  userId?: string | null
  metadata?: Record<string, any> | null
}

class SocketService {
  private socket: Socket | null = null
  private connectionState: ConnectionState = 'disconnected'
  private listeners: Map<string, Set<(...args: any[]) => void>> = new Map()
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5

  /**
   * Connect to the Socket.IO server
   */
  connect(token?: string): void {
    if (this.socket?.connected) {
      console.log('[SocketService] Already connected')
      return
    }

    if (!token) {
      console.error('[SocketService] No auth token found')
      this.updateConnectionState('error')
      return
    }

    // Derive WS base URL
    const adminApi =
      process.env.NEXT_PUBLIC_ADMIN_GRAPHQL_API_URL ||
      'http://localhost:5300/admin-api'
    const baseUrl = adminApi.replace(/\/?admin-api$/, '')
    const overrideWs = process.env.NEXT_PUBLIC_WS_URL
    const wsUrl = (overrideWs || baseUrl).replace(/\/$/, '')

    console.log('[SocketService] Connecting to:', `${wsUrl}/notifications`)

    this.updateConnectionState('connecting')

    this.socket = io(`${wsUrl}/notifications`, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
    })

    this.setupEventHandlers()
  }

  /**
   * Disconnect from the Socket.IO server
   */
  disconnect(): void {
    if (this.socket) {
      console.log('[SocketService] Disconnecting')
      this.socket.disconnect()
      this.socket = null
      this.updateConnectionState('disconnected')
    }
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false
  }

  /**
   * Get current connection state
   */
  getConnectionState(): ConnectionState {
    return this.connectionState
  }

  /**
   * Subscribe to notification events
   */
  onNotification(callback: (notification: NotificationPayload) => void): () => void {
    return this.on('notification:new', callback)
  }

  /**
   * Subscribe to unread count updates
   */
  onUnreadCount(callback: (count: number) => void): () => void {
    return this.on('notification:unread-count', callback)
  }

  /**
   * Subscribe to connection state changes
   */
  onConnectionStateChange(callback: (state: ConnectionState) => void): () => void {
    return this.on('connection-state-change', callback)
  }

  /**
   * Generic event listener
   */
  private on(event: string, callback: (...args: any[]) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback)

    // Return unsubscribe function
    return () => {
      const eventListeners = this.listeners.get(event)
      if (eventListeners) {
        eventListeners.delete(callback)
      }
    }
  }

  /**
   * Emit event to all listeners
   */
  private emit(event: string, ...args: any[]): void {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      eventListeners.forEach((callback) => callback(...args))
    }
  }

  /**
   * Setup Socket.IO event handlers
   */
  private setupEventHandlers(): void {
    if (!this.socket) return

    this.socket.on('connect', () => {
      console.log('[SocketService] Connected:', this.socket?.id)
      this.reconnectAttempts = 0
      this.updateConnectionState('connected')
    })

    this.socket.on('disconnect', (reason) => {
      console.log('[SocketService] Disconnected:', reason)
      this.updateConnectionState('disconnected')
    })

    this.socket.on('connect_error', (error) => {
      console.error('[SocketService] Connection error:', error.message)
      this.reconnectAttempts++
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        this.updateConnectionState('error')
      }
    })

    this.socket.on('notification:new', (notification: NotificationPayload) => {
      console.log('[SocketService] New notification received:', notification)
      this.emit('notification:new', notification)
    })

    this.socket.on('notification:unread-count', (count: number) => {
      console.log('[SocketService] Unread count update:', count)
      this.emit('notification:unread-count', count)
    })

    // Test ping/pong
    this.socket.emit('ping')
    this.socket.on('pong', () => {
      console.log('[SocketService] Pong received')
    })
  }

  /**
   * Update connection state and notify listeners
   */
  private updateConnectionState(state: ConnectionState): void {
    this.connectionState = state
    this.emit('connection-state-change', state)
  }
}

// Export singleton instance
export const socketService = new SocketService()

