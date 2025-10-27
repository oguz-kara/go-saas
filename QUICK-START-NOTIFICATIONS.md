# Quick Start: Real-time Notifications

## ✅ What's Been Implemented

Your app now has a complete real-time notification system:

- ✅ WebSocket server (Socket.IO) with JWT authentication
- ✅ Real-time notification delivery to users
- ✅ Browser push notifications (Web Notifications API)
- ✅ Sound alerts for new notifications
- ✅ Automatic reconnection on disconnect
- ✅ In-app toast notifications
- ✅ Permission management UI
- ✅ Cross-browser support (Chrome, Firefox, Safari, Edge)
- ✅ Cross-platform support (Windows, macOS, Linux)
- ✅ Comprehensive unit tests

## 🚀 Quick Start

### 1. Add Notification Sound (Optional but Recommended)

Download a notification sound and place it at:
```
web-admin/public/sounds/notification.mp3
```

Free sources:
- https://freesound.org (search "notification")
- https://mixkit.co/free-sound-effects/notification/
- https://www.zapsplat.com

**Note**: The app works without sound, but notifications will be silent.

### 2. Start Your Servers

```bash
# Terminal 1 - Backend
cd api
pnpm start:dev

# Terminal 2 - Frontend
cd web-admin
pnpm dev
```

### 3. Test the System

1. Open http://localhost:3000 in your browser
2. Login to the dashboard
3. After 3 seconds, you'll see a permission prompt
4. Click "Enable Notifications" and grant permission
5. You'll see a test notification!

### 4. Test Real-time Updates

**Option A: Create a Lead via API**
Open another browser tab and create a lead (this will trigger a notification).

**Option B: Simulate from Backend**
Add this to any backend service:

```typescript
import { NotificationService } from 'src/modules/notification/application/services/notification.service'

@Injectable()
export class YourService {
  constructor(private readonly notificationService: NotificationService) {}

  async sendTestNotification(userId: string) {
    await this.notificationService.createNotification({
      userId,
      type: 'INFO',
      priority: 'MEDIUM',
      title: 'Test Notification',
      message: 'This is a real-time test!',
    })
  }
}
```

## 📋 What Happens When a Notification Arrives

### Tab is FOCUSED (you're viewing the app)
- ✅ Toast notification appears (in-app)
- ✅ Notification list updates in real-time
- ✅ Unread count badge updates
- ❌ No browser notification (not needed)
- ❌ No sound (configurable)

### Tab is UNFOCUSED (you're on another tab/app)
- ✅ Browser notification appears (system-level)
- ✅ Sound plays (if notification.mp3 exists)
- ✅ Click notification → focuses window and navigates to lead
- ✅ Notification list updates when you return

## 🔍 Verify It's Working

### Check WebSocket Connection

1. Open DevTools → Console
2. Look for: `[SocketService] Connected: <socket-id>`
3. In development, you'll see a connection indicator (bottom-left)

### Check Notifications

1. Create a lead (any source except ADMIN)
2. If tab is focused: See toast notification
3. If tab is unfocused: See browser notification + sound

## 🛠️ Troubleshooting

### "No notifications appearing"
- Check browser notification permission (should be "granted")
- Check DevTools console for errors
- Verify WebSocket is connected

### "WebSocket not connecting"
- Verify backend is running on correct port
- Check `NEXT_PUBLIC_API_URL` in frontend `.env`
- Check JWT token is valid (re-login if needed)

### "No sound playing"
- Add `notification.mp3` to `web-admin/public/sounds/`
- Check browser allows audio autoplay
- Check system volume

## 📚 Full Documentation

For complete documentation, see:
- **REAL-TIME-NOTIFICATIONS.md** - Complete implementation guide
- **API**: `api/src/modules/notification/`
- **Frontend**: `web-admin/src/features/notifications/`

## 🧪 Run Tests

```bash
cd api
pnpm test notification.gateway.spec.ts
pnpm test notification.service.spec.ts
```

All tests should pass! ✅

## 🎉 That's It!

Your app now has enterprise-grade real-time notifications. Users will be notified instantly when:
- New leads arrive
- Important events occur
- Custom notifications are sent

The system is production-ready, fully tested, and works across all major browsers and operating systems!

