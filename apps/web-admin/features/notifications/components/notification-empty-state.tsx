'use client'

import { Bell, BellOff, Search } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useTranslations } from '@/hooks/use-translations'

type EmptyStateType = 'all' | 'unread' | 'search'

interface NotificationEmptyStateProps {
  type: EmptyStateType
}

export function NotificationEmptyState({
  type,
}: NotificationEmptyStateProps) {
  const { translations } = useTranslations()
  const t = translations?.notifications

  const configs = {
    all: {
      icon: Bell,
      title: t?.emptyAll || 'All caught up!',
      description:
        t?.emptyAllDescription || 'New notifications will appear here.',
    },
    unread: {
      icon: BellOff,
      title: t?.emptyUnread || 'No unread notifications',
      description: t?.emptyUnreadDescription || 'You\'ve read all notifications.',
    },
    search: {
      icon: Search,
      title: t?.emptySearch || 'No notifications found',
      description:
        t?.emptySearchDescription || 'No notifications match your filters.',
    },
  }

  const config = configs[type]
  const Icon = config.icon

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 rounded-full bg-primary/10 p-6">
          <Icon className="size-12 text-primary" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">{config.title}</h3>
        <p className="text-sm text-muted-foreground">{config.description}</p>
      </CardContent>
    </Card>
  )
}

