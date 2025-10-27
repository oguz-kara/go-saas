import { sdk } from '@gocrm/graphql'
import { notFound } from 'next/navigation'
import { NotificationList } from '@gocrm/features/notifications/components/notification-list'

export default async function NotificationsPage({
  searchParams,
  params,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
  params: Promise<{ locale?: string }>
}) {
  const { locale } = (await params) || {}
  const resolvedSearchParams = await searchParams
  const skip = Number(resolvedSearchParams?.skip ?? 0)
  const take = Number(resolvedSearchParams?.take ?? 10)
  const onlyUnread =
    (resolvedSearchParams?.onlyUnread as string) === 'true' || undefined
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
