import { sdk } from '@gocrm/graphql'
import { notFound } from 'next/navigation'
import { NotificationList } from '@gocrm/features/notifications/components/notification-list'

export default async function NotificationsPage({
  searchParams,
  params,
}: {
  searchParams?: Record<string, string | string[] | undefined>
  params: Promise<{ locale?: string }>
}) {
  const { locale } = (await params) || {}
  const skip = Number(searchParams?.skip ?? 0)
  const take = Number(searchParams?.take ?? 10)
  const onlyUnread =
    (searchParams?.onlyUnread as string) === 'true' || undefined
  const api = sdk(locale)
  const data = await api.GetNotifications({ skip, take, onlyUnread })
  if (!data) notFound()
  return (
    <NotificationList
      notifications={data.notifications.items}
      totalCount={data.notifications.totalCount}
      page={{ skip, take }}
    />
  )
}
