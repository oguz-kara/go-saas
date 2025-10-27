import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Logger, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

interface AuthenticatedSocket extends Socket {
  userId?: string
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/notifications',
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server

  private readonly logger = new Logger(NotificationGateway.name)

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token = this.extractTokenFromHandshake(client)

      if (!token) {
        this.logger.warn(`Client ${client.id} - No token provided`)
        client.disconnect()
        return
      }

      const payload = await this.verifyToken(token)
      client.userId = payload.sub

      // Join user-specific room
      client.join(`user:${client.userId}`)

      this.logger.log(
        `Client ${client.id} connected - User: ${client.userId}, Room: user:${client.userId}`,
      )
    } catch (error) {
      this.logger.error(
        `Client ${client.id} authentication failed: ${error.message}`,
      )
      client.disconnect()
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.logger.log(`Client ${client.id} disconnected - User: ${client.userId}`)
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: AuthenticatedSocket): string {
    return 'pong'
  }

  /**
   * Emit a notification to a specific user
   */
  emitNotificationToUser(userId: string, notification: any) {
    this.server.to(`user:${userId}`).emit('notification:new', notification)
    this.logger.debug(`Emitted notification to user:${userId}`)
  }

  /**
   * Emit notification count update to a specific user
   */
  emitUnreadCountToUser(userId: string, count: number) {
    this.server.to(`user:${userId}`).emit('notification:unread-count', count)
    this.logger.debug(`Emitted unread count (${count}) to user:${userId}`)
  }

  private extractTokenFromHandshake(client: Socket): string | null {
    const authHeader = client.handshake.headers.authorization
    const token = client.handshake.auth?.token

    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7)
    }

    if (token) {
      return token
    }

    return null
  }

  private async verifyToken(token: string): Promise<any> {
    try {
      const secret = this.configService.get<string>('JWT_SECRET')
      return await this.jwtService.verifyAsync(token, { secret })
    } catch (error) {
      throw new UnauthorizedException('Invalid token')
    }
  }
}

