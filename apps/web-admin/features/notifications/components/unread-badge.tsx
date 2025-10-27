'use client'

import { useUnreadCountQuery } from '@/graphql/generated/hooks'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export function UnreadBadge() {
  const { data } = useUnreadCountQuery({ pollInterval: 30000 })
  const count = data?.unreadCount || 0
  if (count <= 0) return null
  
  return (
    <Badge
      variant="destructive"
      className={cn(
        'ml-2 h-5 min-w-5 animate-pulse px-1 text-xs',
        count > 99 && 'px-1.5',
      )}
    >
      {count > 99 ? '99+' : count}
    </Badge>
  )
}
