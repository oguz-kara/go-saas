# Real-time Browser Notifications

This document describes the real-time notification system implemented using Socket.IO and the Web Notifications API.

## Overview

The system provides instant notification delivery to users through:
- **WebSocket connections** (Socket.IO) for real-time data push
- **Browser notifications** (Web Notifications API) for system-level alerts
- **Sound alerts** for new notifications
- **Toast notifications** for in-app alerts

## Architecture

### Backend (NestJS)

#### Components

1. **NotificationGateway** (`api/src/modules/notification/api/gateway/notification.gateway.ts`)
   - WebSocket gateway using Socket.IO
   - JWT-based authentication
   - User-specific rooms for targeted notifications
   - CORS configuration for frontend connections

2. **NotificationService** (`api/src/modules/notification/application/services/notification.service.ts`)
   - Creates notifications in the database
   - Emits real-time events via WebSocket
   - Updates unread counts

3. **OnLeadCreatedHandler** (`api/src/modules/notification/application/events/on-lead-created.handler.ts`)
   - Event handler for lead creation
   - Creates and broadcasts notifications to relevant users

#### WebSocket Events

**Server → Client:**
- `notification:new` - New notification created
- `notification:unread-count` - Updated unread count

**Client → Server:**
- `ping` - Connection health check (responds with `pong`)

### Frontend (Next.js)

#### Components

1. **SocketService** (`web-admin/src/lib/socket/socket-service.ts`)
   - Socket.IO client singleton
   - Auto-reconnection with exponential backoff
   - JWT token authentication
   - Event subscription management
   - Connection state tracking

2. **BrowserNotificationManager** (`web-admin/src/lib/notifications/browser-notification-manager.ts`)
   - Web Notifications API wrapper
   - Permission management
   - Sound playback
   - Only shows notifications when tab is not focused
   - Click handling to focus window and navigate

3. **useRealtimeNotifications** (`web-admin/src/features/notifications/hooks/use-realtime-notifications.ts`)
   - React hook for real-time notifications
   - Apollo cache updates
   - Integration with toast notifications
   - Connection state management

4. **NotificationPermissionPrompt** (`web-admin/src/features/notifications/components/notification-permission-prompt.tsx`)
   - User-friendly permission request UI
   - Dismissal options (temporary/permanent)
   - Test notification on grant

5. **RealtimeNotificationsProvider** (`web-admin/src/features/notifications/components/realtime-notifications-provider.tsx`)
   - Provider component for dashboard
   - Initializes real-time connection
   - Shows permission prompt
   - Development connection indicator

## Setup

### Backend

1. **Dependencies** (already installed):
```bash
cd api
pnpm add @nestjs/websockets @nestjs/platform-socket.io socket.io
```

2. **Environment Variables**:
No additional environment variables required. Uses existing:
- `JWT_SECRET` - For WebSocket authentication
- `FRONTEND_URL` - For CORS (defaults to `http://localhost:3000`)

3. **Module Configuration**:
The `NotificationModule` is already configured and imported in `AppModule`.

### Frontend

1. **Dependencies** (already installed):
```bash
cd web-admin
pnpm add socket.io-client
```

2. **Environment Variables**:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/admin-api
```

3. **Notification Sound**:
Add a notification sound file to `web-admin/public/sounds/notification.mp3`. See `web-admin/public/sounds/README.md` for instructions.

4. **Integration**:
The `RealtimeNotificationsProvider` is already integrated into the dashboard layout at `web-admin/src/app/(dashboard)/layout.tsx`.

## Usage

### Creating Notifications from Backend

#### Method 1: Using NotificationService (Recommended)

```typescript
import { NotificationService } from 'src/modules/notification/application/services/notification.service'

@Injectable()
export class YourService {
  constructor(private readonly notificationService: NotificationService) {}

  async someMethod() {
    // Create single notification
    await this.notificationService.createNotification({
      userId: 'user-id',
      type: 'INFO', // 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS' | 'NEW_LEAD'
      priority: 'MEDIUM', // 'LOW' | 'MEDIUM' | 'HIGH' (optional, defaults to 'MEDIUM')
      title: 'Notification Title',
      message: 'Notification message',
      leadId: 'lead-id', // Optional
      metadata: {}, // Optional
    })

    // Create multiple notifications
    await this.notificationService.createNotifications([
      { userId: 'user-1', type: 'INFO', title: 'Test', message: 'Message 1' },
      { userId: 'user-2', type: 'WARNING', title: 'Alert', message: 'Message 2' },
    ])
  }
}
```

#### Method 2: Using Events

```typescript
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class YourService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async someMethod() {
    // Emit event (handler will create notifications)
    this.eventEmitter.emit('lead.created', {
      leadId: 'lead-id',
      source: 'WEB',
      channelId: 'channel-id',
    })
  }
}
```

### Frontend Integration

#### Using the Hook

```typescript
import { useRealtimeNotifications } from '@gocrm/features/notifications/hooks/use-realtime-notifications'

function MyComponent() {
  const { connectionState, isConnected, unreadCount } = useRealtimeNotifications()

  return (
    <div>
      <p>Status: {connectionState}</p>
      <p>Unread: {unreadCount}</p>
    </div>
  )
}
```

#### Manual Socket Connection

```typescript
import { socketService } from '@gocrm/lib/socket/socket-service'

// Connect
socketService.connect()

// Subscribe to notifications
const unsubscribe = socketService.onNotification((notification) => {
  console.log('New notification:', notification)
})

// Subscribe to unread count
const unsubscribeCount = socketService.onUnreadCount((count) => {
  console.log('Unread count:', count)
})

// Cleanup
unsubscribe()
unsubscribeCount()
socketService.disconnect()
```

## Browser Notification Behavior

### When Notifications Are Shown

Browser notifications are only shown when:
1. User has granted notification permission
2. The browser tab is **NOT** currently focused (checked via `document.hidden`)
3. A new notification is received via WebSocket

### In-App Behavior

When the tab **IS** focused:
- Toast notification is shown (via Sonner)
- Apollo cache is updated
- No browser notification
- No sound (optional: can be configured)

### Permission States

- **default**: Permission not requested yet → Shows permission prompt
- **granted**: Permission granted → Shows browser notifications when tab is unfocused
- **denied**: Permission denied → Only shows in-app toast notifications

## Testing

### Backend Tests

```bash
cd api
pnpm test notification.gateway.spec.ts
pnpm test notification.service.spec.ts
```

### Manual Testing

1. **Start Backend**:
```bash
cd api
pnpm start:dev
```

2. **Start Frontend**:
```bash
cd web-admin
pnpm dev
```

3. **Test Scenarios**:

#### Test 1: WebSocket Connection
- Open browser DevTools → Console
- Look for: `[SocketService] Connected: <socket-id>`
- Should see: `🟢 Connected` indicator (bottom-left, development only)

#### Test 2: Permission Prompt
- After 3 seconds, permission prompt should appear (if not already granted/denied)
- Click "Enable Notifications"
- Grant permission in browser
- Should see test notification

#### Test 3: Real-time Notifications
- Keep admin panel open on one tab
- Use another tab/tool to create a lead (triggers notification)
- Switch to another tab
- Should see browser notification with sound
- Click notification → Should focus window and navigate to lead

#### Test 4: In-App Notifications
- Keep admin panel focused
- Create a lead
- Should see toast notification (no browser notification)
- Apollo cache should update immediately

#### Test 5: Multiple Tabs
- Open admin panel in 2+ tabs
- All tabs should receive real-time updates
- Browser notifications only on unfocused tabs

#### Test 6: Reconnection
- Stop backend server
- Should see: `🟡 Disconnected` indicator
- Restart backend server
- Should automatically reconnect: `🟢 Connected`

## Cross-Browser & Cross-Platform Support

### Supported Browsers

- ✅ Chrome/Edge (Windows, macOS, Linux)
- ✅ Firefox (Windows, macOS, Linux)
- ✅ Safari (macOS) - Limited notification features
- ✅ Opera (Windows, macOS, Linux)

### Browser Notification Support

| Browser | Notifications | Sound | Click Action |
|---------|--------------|-------|--------------|
| Chrome  | ✅            | ✅     | ✅            |
| Firefox | ✅            | ✅     | ✅            |
| Safari  | ✅            | ⚠️     | ✅            |
| Edge    | ✅            | ✅     | ✅            |

⚠️ Safari: System handles sound, custom sound may not work

### Operating Systems

- ✅ Windows 10/11 - Native notification center
- ✅ macOS - Native notification center
- ✅ Linux - Desktop environment dependent (GNOME, KDE, etc.)

## Troubleshooting

### WebSocket Connection Issues

**Problem**: Connection fails or immediately disconnects

**Solutions**:
1. Check JWT token is valid and not expired
2. Verify `NEXT_PUBLIC_API_URL` is correct
3. Check CORS configuration in backend
4. Verify backend WebSocket server is running on correct port

### Browser Notifications Not Showing

**Problem**: No browser notifications appear

**Solutions**:
1. Check permission state: Should be "granted"
2. Verify tab is NOT focused (notifications only show when tab is hidden)
3. Check browser notification settings (not blocked at OS level)
4. Open DevTools → Console for errors

### Sound Not Playing

**Problem**: No sound with notifications

**Solutions**:
1. Verify `notification.mp3` exists in `web-admin/public/sounds/`
2. Check browser allows audio autoplay
3. Check system volume
4. Try user interaction first (click button) to enable audio

### Notifications Not Real-time

**Problem**: Delayed or missing notifications

**Solutions**:
1. Check WebSocket connection state
2. Verify user is in correct channel (for lead notifications)
3. Check backend logs for errors
4. Verify `OnLeadCreatedHandler` is being triggered

## Performance Considerations

### Backend

- WebSocket connections are lightweight
- Each user has one socket connection
- Room-based broadcasting is efficient
- No polling required

### Frontend

- Single WebSocket connection per tab
- Apollo cache updates are optimized
- Toast notifications are rate-limited by Sonner
- Browser notifications are throttled by browser

### Scaling

For production with many users:
- Use Redis adapter for Socket.IO: `@socket.io/redis-adapter`
- Enable Socket.IO horizontal scaling
- Configure load balancer for WebSocket sticky sessions

## Security

### Authentication

- JWT token validated on WebSocket connection
- User can only join their own room (`user:{userId}`)
- Token verification uses same secret as REST API

### Authorization

- Users only receive notifications addressed to them
- Room names are server-controlled
- No client can emit to other users' rooms

## Future Enhancements

- [ ] Add notification preferences (types, channels, quiet hours)
- [ ] Implement notification batching for high volume
- [ ] Add notification read status sync across tabs
- [ ] Support rich notifications with images
- [ ] Add notification action buttons
- [ ] Implement notification groups/categories
- [ ] Add desktop widget for persistent notifications
- [ ] Support mobile push notifications (PWA)

## References

- [Socket.IO Documentation](https://socket.io/docs/v4/)
- [Web Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)
- [NestJS WebSockets](https://docs.nestjs.com/websockets/gateways)
- [Apollo Client Cache](https://www.apollographql.com/docs/react/caching/overview/)

