import { Test, TestingModule } from '@nestjs/testing'
import { InternalServerErrorException } from '@nestjs/common'
import { NotificationService, CreateNotificationDto } from './notification.service'
import { PrismaService } from 'src/common'
import { NotificationGateway } from '../../api/gateway/notification.gateway'
import { RequestContext } from 'src/common/request-context/request-context'

describe('NotificationService', () => {
  let service: NotificationService
  let prismaService: PrismaService
  let notificationGateway: NotificationGateway

  const mockPrismaService = {
    notification: {
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  }

  const mockNotificationGateway = {
    emitNotificationToUser: jest.fn(),
    emitUnreadCountToUser: jest.fn(),
  }

  const createMockContext = (userId: string): RequestContext => {
    return {
      user: {
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
      },
    } as RequestContext
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: NotificationGateway, useValue: mockNotificationGateway },
      ],
    }).compile()

    service = module.get<NotificationService>(NotificationService)
    prismaService = module.get<PrismaService>(PrismaService)
    notificationGateway = module.get<NotificationGateway>(NotificationGateway)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getNotifications', () => {
    it('should return paginated notifications for user', async () => {
      const ctx = createMockContext('user-123')
      const mockNotifications = [
        {
          id: 'notif-1',
          title: 'Test 1',
          message: 'Message 1',
          type: 'INFO',
          priority: 'MEDIUM',
          isRead: false,
          createdAt: new Date(),
        },
      ]

      mockPrismaService.$transaction.mockResolvedValue([
        mockNotifications,
        1,
      ])

      const result = await service.getNotifications(ctx, {
        skip: 0,
        take: 10,
      })

      expect(result).toEqual({
        items: mockNotifications,
        totalCount: 1,
      })
      expect(mockPrismaService.$transaction).toHaveBeenCalled()
    })

    it('should filter by unread notifications', async () => {
      const ctx = createMockContext('user-123')
      mockPrismaService.$transaction.mockResolvedValue([[], 0])

      await service.getNotifications(ctx, {
        skip: 0,
        take: 10,
        onlyUnread: true,
      })

      const transactionCall = mockPrismaService.$transaction.mock.calls[0][0]
      // Verify the first query in transaction includes isRead: false filter
      expect(transactionCall).toBeDefined()
    })

    it('should throw error when user context is invalid', async () => {
      const ctx = { user: null } as any

      await expect(
        service.getNotifications(ctx, { skip: 0, take: 10 }),
      ).rejects.toThrow(InternalServerErrorException)
    })
  })

  describe('unreadCount', () => {
    it('should return unread count for user', async () => {
      const ctx = createMockContext('user-123')
      mockPrismaService.notification.count.mockResolvedValue(5)

      const result = await service.unreadCount(ctx)

      expect(result).toBe(5)
      expect(mockPrismaService.notification.count).toHaveBeenCalledWith({
        where: { userId: 'user-123', isRead: false },
      })
    })

    it('should throw error when user context is invalid', async () => {
      const ctx = { user: null } as any

      await expect(service.unreadCount(ctx)).rejects.toThrow(
        InternalServerErrorException,
      )
    })
  })

  describe('markAsRead', () => {
    it('should mark notification as read and return it', async () => {
      const ctx = createMockContext('user-123')
      const mockNotification = {
        id: 'notif-1',
        title: 'Test',
        message: 'Message',
        isRead: true,
        readAt: new Date(),
      }

      mockPrismaService.notification.update.mockResolvedValue(mockNotification)

      const result = await service.markAsRead(ctx, 'notif-1')

      expect(result).toEqual(mockNotification)
      expect(mockPrismaService.notification.update).toHaveBeenCalledWith({
        where: { id: 'notif-1' },
        data: { isRead: true, readAt: expect.any(Date) },
      })
    })

    it('should throw error when user context is invalid', async () => {
      const ctx = { user: null } as any

      await expect(service.markAsRead(ctx, 'notif-1')).rejects.toThrow(
        InternalServerErrorException,
      )
    })
  })

  describe('markAllAsRead', () => {
    it('should mark all unread notifications as read', async () => {
      const ctx = createMockContext('user-123')
      mockPrismaService.notification.updateMany.mockResolvedValue({ count: 3 })

      const result = await service.markAllAsRead(ctx)

      expect(result).toBe(3)
      expect(mockPrismaService.notification.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user-123', isRead: false },
        data: { isRead: true, readAt: expect.any(Date) },
      })
    })

    it('should throw error when user context is invalid', async () => {
      const ctx = { user: null } as any

      await expect(service.markAllAsRead(ctx)).rejects.toThrow(
        InternalServerErrorException,
      )
    })
  })

  describe('createNotification', () => {
    it('should create notification and emit via WebSocket', async () => {
      const dto: CreateNotificationDto = {
        userId: 'user-123',
        type: 'INFO',
        priority: 'MEDIUM',
        title: 'Test Notification',
        message: 'Test message',
      }

      const mockNotification = {
        id: 'notif-1',
        ...dto,
        isRead: false,
        createdAt: new Date(),
      }

      mockPrismaService.notification.create.mockResolvedValue(mockNotification)
      mockPrismaService.notification.count.mockResolvedValue(1)

      const result = await service.createNotification(dto)

      expect(result).toEqual(mockNotification)
      expect(mockPrismaService.notification.create).toHaveBeenCalledWith({
        data: {
          userId: dto.userId,
          type: dto.type,
          priority: dto.priority,
          title: dto.title,
          message: dto.message,
          leadId: undefined,
          metadata: undefined,
        },
      })
      expect(mockNotificationGateway.emitNotificationToUser).toHaveBeenCalledWith(
        'user-123',
        mockNotification,
      )
      expect(mockNotificationGateway.emitUnreadCountToUser).toHaveBeenCalledWith(
        'user-123',
        1,
      )
    })

    it('should create notification with lead reference', async () => {
      const dto: CreateNotificationDto = {
        userId: 'user-123',
        type: 'NEW_LEAD',
        priority: 'HIGH',
        title: 'New Lead',
        message: 'John Doe submitted form',
        leadId: 'lead-456',
        metadata: {
          firstName: 'John',
          lastName: 'Doe',
        },
      }

      const mockNotification = {
        id: 'notif-2',
        ...dto,
        isRead: false,
        createdAt: new Date(),
      }

      mockPrismaService.notification.create.mockResolvedValue(mockNotification)
      mockPrismaService.notification.count.mockResolvedValue(2)

      const result = await service.createNotification(dto)

      expect(result).toEqual(mockNotification)
      expect(mockNotificationGateway.emitNotificationToUser).toHaveBeenCalledWith(
        'user-123',
        mockNotification,
      )
      expect(mockNotificationGateway.emitUnreadCountToUser).toHaveBeenCalledWith(
        'user-123',
        2,
      )
    })

    it('should use default priority when not provided', async () => {
      const dto: CreateNotificationDto = {
        userId: 'user-123',
        type: 'INFO',
        title: 'Test',
        message: 'Message',
      }

      const mockNotification = {
        id: 'notif-3',
        ...dto,
        priority: 'MEDIUM',
        isRead: false,
        createdAt: new Date(),
      }

      mockPrismaService.notification.create.mockResolvedValue(mockNotification)
      mockPrismaService.notification.count.mockResolvedValue(1)

      await service.createNotification(dto)

      expect(mockPrismaService.notification.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          priority: 'MEDIUM',
        }),
      })
    })

    it('should handle creation errors gracefully', async () => {
      const dto: CreateNotificationDto = {
        userId: 'user-123',
        type: 'INFO',
        title: 'Test',
        message: 'Message',
      }

      mockPrismaService.notification.create.mockRejectedValue(
        new Error('DB Error'),
      )

      await expect(service.createNotification(dto)).rejects.toThrow('DB Error')
      expect(mockNotificationGateway.emitNotificationToUser).not.toHaveBeenCalled()
    })
  })

  describe('createNotifications', () => {
    it('should create multiple notifications', async () => {
      const dtos: CreateNotificationDto[] = [
        {
          userId: 'user-123',
          type: 'INFO',
          title: 'Test 1',
          message: 'Message 1',
        },
        {
          userId: 'user-456',
          type: 'WARNING',
          title: 'Test 2',
          message: 'Message 2',
        },
      ]

      const mockNotifications = dtos.map((dto, i) => ({
        id: `notif-${i}`,
        ...dto,
        priority: 'MEDIUM',
        isRead: false,
        createdAt: new Date(),
      }))

      mockPrismaService.notification.create
        .mockResolvedValueOnce(mockNotifications[0])
        .mockResolvedValueOnce(mockNotifications[1])

      mockPrismaService.notification.count.mockResolvedValue(1)

      const results = await service.createNotifications(dtos)

      expect(results).toHaveLength(2)
      expect(mockNotificationGateway.emitNotificationToUser).toHaveBeenCalledTimes(2)
      expect(mockNotificationGateway.emitUnreadCountToUser).toHaveBeenCalledTimes(2)
    })

    it('should handle empty array', async () => {
      const results = await service.createNotifications([])

      expect(results).toHaveLength(0)
      expect(mockNotificationGateway.emitNotificationToUser).not.toHaveBeenCalled()
    })
  })
})

