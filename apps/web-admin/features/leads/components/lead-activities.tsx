'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  useGetActivitiesQuery,
  useGetActivitiesCountQuery,
  useCompleteActivityMutation,
  useDeleteActivityMutation,
} from '@/graphql/generated/hooks'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { toast } from 'sonner'
import { format, formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import {
  CalendarClock,
  Mail,
  Phone,
  Presentation,
  RefreshCcw,
  Filter,
  X,
} from 'lucide-react'
import { useTranslations } from '@/hooks/use-translations'
import { DateRange } from 'react-day-picker'

const ACTIVITY_TYPE_ICONS = {
  call: Phone,
  email: Mail,
  meeting: CalendarClock,
  demo: Presentation,
  follow_up: RefreshCcw,
}

interface FilterControlsProps {
  searchQuery: string
  setSearchQuery: (value: string) => void
  type: string | undefined
  setType: (value: string | undefined) => void
  status: 'scheduled' | 'completed' | 'overdue' | 'all'
  setStatus: (value: 'scheduled' | 'completed' | 'overdue' | 'all') => void
  dateRange: DateRange | undefined
  setDateRange: (value: DateRange | undefined) => void
  sortOrder: 'asc' | 'desc'
  setSortOrder: (value: 'asc' | 'desc') => void
  t: any
  tTypes: any
}

function FilterControls({
  searchQuery,
  setSearchQuery,
  type,
  setType,
  status,
  setStatus,
  dateRange,
  setDateRange,
  sortOrder,
  setSortOrder,
  t,
  tTypes,
}: FilterControlsProps) {
  return (
    <>
      <div className="grid gap-2">
        <Input
          placeholder={t?.searchPlaceholder || 'Search...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">{t?.typeFilter || 'Type'}</label>
        <Select
          value={type || 'all'}
          onValueChange={(v) => setType(v === 'all' ? undefined : v)}
        >
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t?.allStatus || 'All'}</SelectItem>
            <SelectItem value="call">{tTypes?.call || 'Call'}</SelectItem>
            <SelectItem value="email">{tTypes?.email || 'Email'}</SelectItem>
            <SelectItem value="meeting">
              {tTypes?.meeting || 'Meeting'}
            </SelectItem>
            <SelectItem value="demo">{tTypes?.demo || 'Demo'}</SelectItem>
            <SelectItem value="follow_up">
              {tTypes?.follow_up || 'Follow Up'}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">
          {t?.statusFilter || 'Status'}
        </label>
        <Select value={status} onValueChange={(v) => setStatus(v as any)}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t?.allStatus || 'All'}</SelectItem>
            <SelectItem value="scheduled">
              {t?.scheduledStatus || 'Scheduled'}
            </SelectItem>
            <SelectItem value="completed">
              {t?.completedStatus || 'Completed'}
            </SelectItem>
            <SelectItem value="overdue">
              {t?.overdueStatus || 'Overdue'}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">
          {t?.dateRangeFilter || 'Date Range'}
        </label>
        <DateRangePicker
          from={dateRange?.from}
          to={dateRange?.to}
          onSelect={setDateRange}
          placeholder={t?.dateRangeFilter || 'Pick a date range'}
          className="h-9 w-full"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">{t?.sortFilter || 'Sort'}</label>
        <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as any)}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">
              {t?.newestFirst || 'Newest first'}
            </SelectItem>
            <SelectItem value="asc">
              {t?.oldestFirst || 'Oldest first'}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  )
}

export function LeadActivities({ id }: { id: string }) {
  const { translations, locale } = useTranslations()
  const t = translations?.leadActivities
  const tTypes = translations?.activityTypes
  const dateLocale = locale === 'tr' ? tr : undefined

  const [type, setType] = useState<string | undefined>(undefined)
  const [status, setStatus] = useState<
    'scheduled' | 'completed' | 'overdue' | 'all'
  >('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [skip] = useState(0)
  const [take] = useState(20)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [completingId, setCompletingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const variables = useMemo(() => {
    return {
      leadId: id,
      type: type || undefined,
      isCompleted:
        status === 'completed' ? true : status === 'scheduled' ? false : undefined,
      searchQuery: searchQuery || undefined,
      startDate: dateRange?.from
        ? format(dateRange.from, 'yyyy-MM-dd', { locale: dateLocale })
        : undefined,
      endDate: dateRange?.to
        ? format(dateRange.to, 'yyyy-MM-dd', { locale: dateLocale })
        : undefined,
      skip,
      take,
    }
  }, [id, type, status, searchQuery, dateRange, skip, take, dateLocale])

  const { data, loading, refetch } = useGetActivitiesQuery({ variables })
  const { data: countData } = useGetActivitiesCountQuery({ variables })
  const [completeActivity] = useCompleteActivityMutation()
  const [deleteActivity] = useDeleteActivityMutation()

  const items = data?.activities || []
  const totalCount = countData?.activitiesCount || 0

  useEffect(() => {
    const handler = (e: any) => {
      if (e?.detail?.leadId === id) refetch()
    }
    window.addEventListener('lead-activities-changed', handler)
    return () => window.removeEventListener('lead-activities-changed', handler)
  }, [id, refetch])

  const handleComplete = async (activityId: string) => {
    setCompletingId(activityId)
    try {
      await completeActivity({
        variables: { id: activityId },
        awaitRefetchQueries: true,
      })
      await refetch()
      toast.success(t?.completeButton || 'Marked as completed')
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setCompletingId(null)
    }
  }

  const handleDelete = async (activityId: string) => {
    if (!confirm(t?.deleteConfirm || 'Delete this activity?')) return

    setDeletingId(activityId)
    try {
      await deleteActivity({
        variables: { id: activityId },
        awaitRefetchQueries: true,
      })
      await refetch()
      toast.success(t?.deleteButton || 'Activity deleted')
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setDeletingId(null)
    }
  }

  const hasFilters = type || status !== 'all' || searchQuery || dateRange?.from

  const clearFilters = () => {
    setType(undefined)
    setStatus('all')
    setSearchQuery('')
    setDateRange(undefined)
  }

  const activeFilterCount = [
    type,
    status !== 'all',
    searchQuery,
    dateRange?.from,
  ].filter(Boolean).length

  if (loading && !data) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    )
  }

  const processedItems = [...items]
    .filter((a) => {
      if (status !== 'overdue') return true
      const scheduled = a.scheduledAt ? new Date(a.scheduledAt) : undefined
      return scheduled && !a.completedAt && scheduled.getTime() < Date.now()
    })
    .sort((a, b) => {
      const da = a.scheduledAt
        ? new Date(a.scheduledAt).getTime()
        : new Date(a.createdAt).getTime()
      const db = b.scheduledAt
        ? new Date(b.scheduledAt).getTime()
        : new Date(b.createdAt).getTime()
      return sortOrder === 'desc' ? db - da : da - db
    })

  return (
    <div className="space-y-4">
      {/* Desktop Filters */}
      <div className="hidden md:flex md:flex-wrap md:items-end md:gap-3">
        <div className="w-full md:w-64">
          <Input
            placeholder={t?.searchPlaceholder || 'Search...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9"
          />
        </div>

        <Select
          value={type || 'all'}
          onValueChange={(v) => setType(v === 'all' ? undefined : v)}
        >
          <SelectTrigger className="h-9 w-36">
            <SelectValue placeholder={t?.typeFilter || 'Type'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t?.allStatus || 'All'}</SelectItem>
            <SelectItem value="call">{tTypes?.call || 'Call'}</SelectItem>
            <SelectItem value="email">{tTypes?.email || 'Email'}</SelectItem>
            <SelectItem value="meeting">
              {tTypes?.meeting || 'Meeting'}
            </SelectItem>
            <SelectItem value="demo">{tTypes?.demo || 'Demo'}</SelectItem>
            <SelectItem value="follow_up">
              {tTypes?.follow_up || 'Follow Up'}
            </SelectItem>
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={(v) => setStatus(v as any)}>
          <SelectTrigger className="h-9 w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t?.allStatus || 'All'}</SelectItem>
            <SelectItem value="scheduled">
              {t?.scheduledStatus || 'Scheduled'}
            </SelectItem>
            <SelectItem value="completed">
              {t?.completedStatus || 'Completed'}
            </SelectItem>
            <SelectItem value="overdue">
              {t?.overdueStatus || 'Overdue'}
            </SelectItem>
          </SelectContent>
        </Select>

        <DateRangePicker
          from={dateRange?.from}
          to={dateRange?.to}
          onSelect={setDateRange}
          placeholder={t?.dateRangeFilter || 'Pick a date range'}
          className="h-9 w-64"
        />

        <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as any)}>
          <SelectTrigger className="h-9 w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">
              {t?.newestFirst || 'Newest first'}
            </SelectItem>
            <SelectItem value="asc">{t?.oldestFirst || 'Oldest first'}</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-9"
          >
            <X className="mr-2 size-4" />
            {t?.clearFilters || 'Clear filters'}
          </Button>
        )}

        <div className="ml-auto text-sm text-muted-foreground">
          {t?.activityCount?.replace('{{count}}', totalCount.toString()) ||
            `${totalCount} activities`}
        </div>
      </div>

      {/* Mobile Filters */}
      <div className="flex items-center gap-2 md:hidden">
        <div className="flex-1">
          <Input
            placeholder={t?.searchPlaceholder || 'Search...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9"
          />
        </div>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-2">
              <Filter className="size-4" />
              {t?.filters || 'Filters'}
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{t?.filters || 'Filters'}</SheetTitle>
              <SheetDescription>
                {t?.activeFilters?.replace(
                  '{{count}}',
                  activeFilterCount.toString(),
                ) || `${activeFilterCount} active filters`}
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              <FilterControls
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                type={type}
                setType={setType}
                status={status}
                setStatus={setStatus}
                dateRange={dateRange}
                setDateRange={setDateRange}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                t={t}
                tTypes={tTypes}
              />
              {hasFilters && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    clearFilters()
                    setSheetOpen(false)
                  }}
                >
                  {t?.clearFilters || 'Clear filters'}
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Activities List */}
      {processedItems.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-sm text-muted-foreground">
            {hasFilters
              ? t?.emptyFiltered || 'No activities match your filters.'
              : t?.emptyState || 'No activities yet.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {processedItems.map((activity) => {
            const scheduled = activity.scheduledAt
              ? new Date(activity.scheduledAt)
              : undefined
            const isOverdue =
              scheduled &&
              !activity.completedAt &&
              scheduled.getTime() < Date.now()
            const TypeIcon =
              ACTIVITY_TYPE_ICONS[
                activity.type as keyof typeof ACTIVITY_TYPE_ICONS
              ] || RefreshCcw

            return (
              <Card
                key={activity.id}
                className={
                  activity.completedAt ? 'border-muted bg-muted/30' : ''
                }
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-md bg-primary/10 p-2">
                        <TypeIcon className="size-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-base font-semibold">
                          {activity.subject}
                        </CardTitle>
                        <div className="mt-1 flex flex-col gap-1 text-xs text-muted-foreground">
                          <span>
                            {tTypes?.[
                              activity.type as keyof typeof tTypes
                            ] || activity.type}
                          </span>
                          {scheduled && (
                            <span className="flex items-center gap-1.5 font-medium text-foreground">
                              <CalendarClock className="size-3.5" />
                              {format(scheduled, 'MMM dd, yyyy', { locale: dateLocale })}{' '}
                              {t?.scheduledAt || 'at'}{' '}
                              {format(scheduled, 'HH:mm', { locale: dateLocale })}
                            </span>
                          )}
                          {!scheduled && (
                            <span className="flex items-center gap-1.5 text-muted-foreground">
                              <CalendarClock className="size-3.5" />
                              {format(new Date(activity.createdAt), 'MMM dd, yyyy', {
                                locale: dateLocale,
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      {!activity.completedAt && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleComplete(activity.id)}
                          disabled={completingId === activity.id}
                        >
                          {t?.completeButton || 'Complete'}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(activity.id)}
                        disabled={deletingId === activity.id}
                      >
                        {t?.deleteButton || 'Delete'}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {(activity.description ||
                  activity.completedAt ||
                  isOverdue) && (
                  <CardContent className="pb-3 pt-0">
                    {activity.description && (
                      <p className="mb-2 whitespace-pre-wrap text-sm text-foreground">
                        {activity.description}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-2">
                      {activity.completedAt && (
                        <Badge variant="secondary" className="text-xs">
                          ✓ {t?.completedLabel || 'Completed'}{' '}
                          {formatDistanceToNow(new Date(activity.completedAt), {
                            locale: dateLocale,
                            addSuffix: true,
                          })}
                        </Badge>
                      )}
                      {isOverdue && (
                        <Badge variant="destructive" className="text-xs">
                          ⚠ {t?.overdueWarning || 'Overdue'}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
