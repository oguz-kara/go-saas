'use client'

import { useState, useMemo } from 'react'
import {
  Bell,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  Eye,
  ExternalLink,
  CheckCheck,
  Search,
  Filter,
} from 'lucide-react'
import { AppPagination } from '@/components/common/app-pagination'
import { PageHeader } from '@/components/common/page-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Link from '@/components/common/link'
import {
  useMarkAllAsReadMutation,
  useMarkAsReadMutation,
} from '@/graphql/generated/hooks'
import { toast } from 'sonner'
import { routes } from '@/lib/routes'
import { useTranslations } from '@/hooks/use-translations'
import { NotificationEmptyState } from './notification-empty-state'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'

type NotificationItem = {
  id: string
  createdAt: string
  type: string
  priority: string
  title: string
  message: string
  isRead: boolean
  leadId?: string | null
  metadata?: any
}

interface NotificationListProps {
  notifications: NotificationItem[]
  totalCount: number
  page: { skip: number; take: number }
}

type DateGroup = 'today' | 'yesterday' | 'thisWeek' | 'earlier'

// Helper to get notification type icon
function getNotificationIcon(type: string) {
  switch (type.toUpperCase()) {
    case 'ERROR':
      return XCircle
    case 'WARNING':
      return AlertCircle
    case 'SUCCESS':
      return CheckCircle
    case 'INFO':
      return Info
    default:
      return Bell
  }
}

// Helper to get priority badge variant
function getPriorityVariant(
  priority: string,
): 'destructive' | 'secondary' | 'outline' {
  switch (priority.toUpperCase()) {
    case 'HIGH':
      return 'destructive'
    case 'MEDIUM':
      return 'secondary'
    case 'LOW':
    default:
      return 'outline'
  }
}

// Helper to group notifications by date
function getDateGroup(dateString: string): DateGroup {
  const date = new Date(dateString)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const weekAgo = new Date(today)
  weekAgo.setDate(weekAgo.getDate() - 7)

  if (date >= today) return 'today'
  if (date >= yesterday) return 'yesterday'
  if (date >= weekAgo) return 'thisWeek'
  return 'earlier'
}

export function NotificationList({
  notifications,
  totalCount,
  page,
}: NotificationListProps) {
  const { translations } = useTranslations()
  const t = translations?.notifications
  const [markAsRead] = useMarkAsReadMutation()
  const [markAllAsRead] = useMarkAllAsReadMutation()

  // Local state for filters
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread'>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Filter and group notifications
  const { filteredNotifications, groupedNotifications } = useMemo(() => {
    let filtered = notifications

    // Status filter
    if (statusFilter === 'unread') {
      filtered = filtered.filter((n) => !n.isRead)
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(
        (n) => n.type.toUpperCase() === typeFilter.toUpperCase(),
      )
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(query) ||
          n.message.toLowerCase().includes(query),
      )
    }

    // Group by date
    const groups: Record<DateGroup, NotificationItem[]> = {
      today: [],
      yesterday: [],
      thisWeek: [],
      earlier: [],
    }

    filtered.forEach((notification) => {
      const group = getDateGroup(notification.createdAt)
      groups[group].push(notification)
    })

    return {
      filteredNotifications: filtered,
      groupedNotifications: groups,
    }
  }, [notifications, statusFilter, typeFilter, searchQuery])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const onMarkAll = async () => {
    try {
      await markAllAsRead({
        optimisticResponse: { __typename: 'Mutation', markAllAsRead: 1 },
        update(cache) {
          notifications.forEach((item) => {
            cache.modify({
              id: cache.identify({ __typename: 'Notification', id: item.id }),
              fields: {
                isRead() {
                  return true
                },
                readAt() {
                  return new Date().toISOString()
                },
              },
            })
          })
          cache.modify({
            fields: {
              unreadCount() {
                return 0
              },
            },
          })
        },
      })
      toast.success(t?.markAllSuccess || 'All notifications marked as read')
    } catch (e: any) {
      toast.error(e?.message || t?.markAllError || 'Failed to mark all as read')
    }
  }

  const onMarkAsRead = async (notification: NotificationItem) => {
    try {
      await markAsRead({
        variables: { id: notification.id },
        optimisticResponse: {
          __typename: 'Mutation',
          markAsRead: {
            __typename: 'Notification',
            id: notification.id,
            isRead: true,
            readAt: new Date().toISOString(),
          },
        },
        update(cache) {
          cache.modify({
            id: cache.identify({
              __typename: 'Notification',
              id: notification.id,
            }),
            fields: {
              isRead() {
                return true
              },
              readAt() {
                return new Date().toISOString()
              },
            },
          })
          cache.modify({
            fields: {
              unreadCount(existing: number = 0) {
                return Math.max(0, existing - 1)
              },
            },
          })
        },
      })
      toast.success(t?.markReadSuccess || 'Marked as read')
    } catch (e: any) {
      toast.error(e?.message || t?.markReadError || 'Failed')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title={t?.pageTitle || 'Notifications'}
        description={
          t?.pageDescription?.replace('{{count}}', String(unreadCount)) ||
          `${unreadCount} unread notifications`
        }
        icon={Bell}
        titleSize="sm"
      >
        {unreadCount > 0 && (
          <Button onClick={onMarkAll} className="gap-2">
            <CheckCheck className="size-4" />
            <span className="hidden sm:inline">
              {t?.markAllReadButton || 'Mark All Read'}
            </span>
            <span className="sm:hidden">
              {t?.markAllReadButton || 'Mark All'}
            </span>
          </Button>
        )}
      </PageHeader>

      {/* Filters & Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {/* Status Tabs */}
        <Tabs
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as 'all' | 'unread')}
          className="w-full md:w-auto"
        >
          <TabsList className="grid w-full grid-cols-2 md:w-auto">
            <TabsTrigger value="all" className="gap-2">
              {t?.allTab || 'All'}
            </TabsTrigger>
            <TabsTrigger value="unread" className="gap-2">
              {t?.unreadTab || 'Unread'}
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t?.searchPlaceholder || 'Search notifications...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Type Filter */}
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <Filter className="mr-2 size-4" />
            <SelectValue placeholder={t?.typeFilter || 'Type'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t?.allTypes || 'All Types'}</SelectItem>
            <SelectItem value="INFO">{t?.typeInfo || 'Info'}</SelectItem>
            <SelectItem value="WARNING">
              {t?.typeWarning || 'Warning'}
            </SelectItem>
            <SelectItem value="ERROR">{t?.typeError || 'Error'}</SelectItem>
            <SelectItem value="SUCCESS">
              {t?.typeSuccess || 'Success'}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredNotifications.length === 0 &&
        (statusFilter === 'unread' ? (
          <NotificationEmptyState type="unread" />
        ) : (
          <NotificationEmptyState type="search" />
        ))}

      {notifications.length === 0 && <NotificationEmptyState type="all" />}

      {filteredNotifications.length !== 0 &&
        (notifications.length !== 0 ? (
          <div className="space-y-6">
            {(Object.keys(groupedNotifications) as DateGroup[]).map(
              (groupKey) => {
                const groupItems = groupedNotifications[groupKey]
                if (groupItems.length === 0) return null

                const groupLabels: Record<DateGroup, string> = {
                  today: t?.today || 'Today',
                  yesterday: t?.yesterday || 'Yesterday',
                  thisWeek: t?.thisWeek || 'This Week',
                  earlier: t?.earlier || 'Earlier',
                }

                return (
                  <div key={groupKey} className="space-y-3">
                    {/* Group Header */}
                    <div className="sticky top-0 z-10 bg-background/95 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                      <h3 className="text-sm font-semibold text-muted-foreground">
                        {groupLabels[groupKey]}
                      </h3>
                    </div>

                    {/* Notifications in Group */}
                    <div className="space-y-2">
                      {groupItems.map((notification) => {
                        const TypeIcon = getNotificationIcon(notification.type)
                        const priorityVariant = getPriorityVariant(
                          notification.priority,
                        )

                        return (
                          <Card
                            key={notification.id}
                            className={
                              notification.isRead
                                ? 'transition-all hover:shadow-md'
                                : 'border-primary/50 bg-primary/5 transition-all hover:shadow-md'
                            }
                          >
                            <CardContent className="flex gap-4 p-4">
                              {/* Icon */}
                              <div className="flex-shrink-0">
                                <div className="rounded-md bg-primary/10 p-2">
                                  <TypeIcon className="size-5 text-primary" />
                                </div>
                              </div>

                              {/* Content */}
                              <div className="flex-1 space-y-2">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                  <div className="flex-1">
                                    <h4 className="font-semibold leading-tight">
                                      {notification.title}
                                    </h4>
                                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                      {notification.message}
                                    </p>
                                  </div>
                                  <Badge
                                    variant={priorityVariant}
                                    className="w-fit"
                                  >
                                    {notification.priority.toUpperCase() ===
                                    'HIGH'
                                      ? t?.priorityHigh
                                      : notification.priority.toUpperCase() ===
                                        'MEDIUM'
                                      ? t?.priorityMedium
                                      : notification.priority.toUpperCase() ===
                                        'LOW'
                                      ? t?.priorityLow
                                      : notification.priority}
                                  </Badge>
                                </div>

                                {/* Footer with metadata and actions */}
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    {formatDistanceToNow(
                                      new Date(notification.createdAt),
                                      {
                                        addSuffix: true,
                                        locale: tr,
                                      },
                                    )}
                                  </span>

                                  {notification.leadId && (
                                    <Link
                                      href={routes.leads.detail(
                                        notification.leadId,
                                      )}
                                      className="flex items-center gap-1 text-primary hover:underline"
                                    >
                                      <ExternalLink className="size-3" />
                                      {t?.viewLead || 'View Lead'}
                                    </Link>
                                  )}

                                  {!notification.isRead && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => onMarkAsRead(notification)}
                                      className="h-auto gap-1 py-1 text-xs"
                                    >
                                      <Eye className="size-3" />
                                      {t?.markAsReadButton || 'Mark Read'}
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </div>
                )
              },
            )}
          </div>
        ) : null)}

      {/* Pagination */}
      <AppPagination
        totalCount={totalCount}
        pageSize={page.take}
        currentPage={Math.floor(page.skip / page.take) + 1}
      />
    </div>
  )
}
