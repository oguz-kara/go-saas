import { Test, TestingModule } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { NotificationGateway } from './notification.gateway'
import { Socket } from 'socket.io'

describe('NotificationGateway', () => {
  let gateway: NotificationGateway
  let jwtService: JwtService
  let configService: ConfigService

  const mockJwtService = {
    verifyAsync: jest.fn(),
  }

  const mockConfigService = {
    get: jest.fn(),
  }

  const createMockSocket = (overrides = {}): Socket => {
    return {
      id: 'test-socket-id',
      handshake: {
        headers: {},
        auth: {},
      },
      join: jest.fn(),
      disconnect: jest.fn(),
      ...overrides,
    } as any
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationGateway,
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile()

    gateway = module.get<NotificationGateway>(NotificationGateway)
    jwtService = module.get<JwtService>(JwtService)
    configService = module.get<ConfigService>(ConfigService)

    // Setup mock server
    gateway.server = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
    } as any
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('handleConnection', () => {
    it('should successfully authenticate and join user room with Bearer token', async () => {
      const mockSocket = createMockSocket({
        handshake: {
          headers: {
            authorization: 'Bearer valid-token',
          },
        },
      })

      mockConfigService.get.mockReturnValue('test-secret')
      mockJwtService.verifyAsync.mockResolvedValue({ sub: 'user-123' })

      await gateway.handleConnection(mockSocket)

      expect(jwtService.verifyAsync).toHaveBeenCalledWith('valid-token', {
        secret: 'test-secret',
      })
      expect(mockSocket.join).toHaveBeenCalledWith('user:user-123')
      expect(mockSocket.disconnect).not.toHaveBeenCalled()
      expect((mockSocket as any).userId).toBe('user-123')
    })

    it('should successfully authenticate with auth token', async () => {
      const mockSocket = createMockSocket({
        handshake: {
          headers: {},
          auth: {
            token: 'valid-token',
          },
        },
      })

      mockConfigService.get.mockReturnValue('test-secret')
      mockJwtService.verifyAsync.mockResolvedValue({ sub: 'user-456' })

      await gateway.handleConnection(mockSocket)

      expect(jwtService.verifyAsync).toHaveBeenCalledWith('valid-token', {
        secret: 'test-secret',
      })
      expect(mockSocket.join).toHaveBeenCalledWith('user:user-456')
      expect((mockSocket as any).userId).toBe('user-456')
    })

    it('should disconnect client when no token is provided', async () => {
      const mockSocket = createMockSocket()

      await gateway.handleConnection(mockSocket)

      expect(mockSocket.disconnect).toHaveBeenCalled()
      expect(mockSocket.join).not.toHaveBeenCalled()
    })

    it('should disconnect client when token verification fails', async () => {
      const mockSocket = createMockSocket({
        handshake: {
          headers: {
            authorization: 'Bearer invalid-token',
          },
        },
      })

      mockConfigService.get.mockReturnValue('test-secret')
      mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'))

      await gateway.handleConnection(mockSocket)

      expect(mockSocket.disconnect).toHaveBeenCalled()
      expect(mockSocket.join).not.toHaveBeenCalled()
    })
  })

  describe('handleDisconnect', () => {
    it('should handle client disconnect', () => {
      const mockSocket = createMockSocket() as any
      mockSocket.userId = 'user-789'

      // Should not throw
      expect(() => gateway.handleDisconnect(mockSocket)).not.toThrow()
    })
  })

  describe('handlePing', () => {
    it('should respond with pong', () => {
      const mockSocket = createMockSocket()
      const result = gateway.handlePing(mockSocket as any)

      expect(result).toBe('pong')
    })
  })

  describe('emitNotificationToUser', () => {
    it('should emit notification to user room', () => {
      const notification = {
        id: 'notif-1',
        title: 'Test Notification',
        message: 'Test message',
        type: 'INFO',
        priority: 'MEDIUM',
        isRead: false,
        userId: 'user-123',
        createdAt: new Date().toISOString(),
      }

      gateway.emitNotificationToUser('user-123', notification)

      expect(gateway.server.to).toHaveBeenCalledWith('user:user-123')
      expect(gateway.server.emit).toHaveBeenCalledWith(
        'notification:new',
        notification,
      )
    })

    it('should emit notification with lead reference', () => {
      const notification = {
        id: 'notif-2',
        title: 'New Lead',
        message: 'John Doe submitted a form',
        type: 'NEW_LEAD',
        priority: 'HIGH',
        isRead: false,
        userId: 'user-456',
        leadId: 'lead-789',
        createdAt: new Date().toISOString(),
      }

      gateway.emitNotificationToUser('user-456', notification)

      expect(gateway.server.to).toHaveBeenCalledWith('user:user-456')
      expect(gateway.server.emit).toHaveBeenCalledWith(
        'notification:new',
        notification,
      )
    })
  })

  describe('emitUnreadCountToUser', () => {
    it('should emit unread count to user room', () => {
      gateway.emitUnreadCountToUser('user-123', 5)

      expect(gateway.server.to).toHaveBeenCalledWith('user:user-123')
      expect(gateway.server.emit).toHaveBeenCalledWith(
        'notification:unread-count',
        5,
      )
    })

    it('should emit zero unread count', () => {
      gateway.emitUnreadCountToUser('user-456', 0)

      expect(gateway.server.to).toHaveBeenCalledWith('user:user-456')
      expect(gateway.server.emit).toHaveBeenCalledWith(
        'notification:unread-count',
        0,
      )
    })
  })
})

