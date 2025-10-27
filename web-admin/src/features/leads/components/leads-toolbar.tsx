'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@gocrm/components/ui/button'
import { Input } from '@gocrm/components/ui/input'
import { X, Plus, Download, Filter } from 'lucide-react'
import { useDebouncedCallback } from 'use-debounce'
import { UsersQuery } from '@gocrm/graphql/generated/sdk'
import { useTranslations } from '@gocrm/hooks/use-translations'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@gocrm/components/ui/sheet'
import { Badge } from '@gocrm/components/ui/badge'
import { LeadsFacetedFilter } from './leads-faceted-filter'
import { LeadsViewOptions } from './leads-view-options'
import { routes } from '@gocrm/lib/routes'

interface LeadsToolbarProps {
  users?: UsersQuery['getUsers']['items']
}

export function LeadsToolbar({ users }: LeadsToolbarProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const { translations } = useTranslations()

  const [q, setQ] = useState(searchParams.get('q') ?? '')

  const setParam = (key: string, value?: string | null) => {
    const params = new URLSearchParams(searchParams)
    if (value && value.length > 0) {
      params.set(key, value)
      if (key !== 'skip') params.set('skip', '0')
    } else {
      params.delete(key)
    }
    replace(`${pathname}?${params.toString()}`)
  }

  const onSearch = useDebouncedCallback(
    (value: string) => setParam('q', value),
    400,
  )

  if (!translations) {
    return null
  }

  const t = translations.leadsPage
  const tStatus = translations.leadStatus
  const tSource = translations.leadSource
  const tPriority = translations.leadPriority

  const statusOptions = [
    { label: tStatus.NEW, value: 'NEW' },
    { label: tStatus.CONTACTED, value: 'CONTACTED' },
    { label: tStatus.QUALIFIED, value: 'QUALIFIED' },
    { label: tStatus.PROPOSAL_SENT, value: 'PROPOSAL_SENT' },
    { label: tStatus.NEGOTIATION, value: 'NEGOTIATION' },
    { label: tStatus.CONVERTED, value: 'CONVERTED' },
    { label: tStatus.LOST, value: 'LOST' },
  ]

  const sourceOptions = [
    { label: tSource.WEBSITE, value: 'WEBSITE' },
    { label: tSource.REFERRAL, value: 'REFERRAL' },
    { label: tSource.SOCIAL_MEDIA, value: 'SOCIAL_MEDIA' },
    { label: tSource.EMAIL_CAMPAIGN, value: 'EMAIL_CAMPAIGN' },
    { label: tSource.PAID_ADS, value: 'PAID_ADS' },
    { label: tSource.COLD_OUTREACH, value: 'COLD_OUTREACH' },
    { label: tSource.EVENT, value: 'EVENT' },
    { label: tSource.PARTNER, value: 'PARTNER' },
    { label: tSource.OTHER, value: 'OTHER' },
  ]

  const priorityOptions = [
    { label: tPriority.LOW, value: 'LOW' },
    { label: tPriority.MEDIUM, value: 'MEDIUM' },
    { label: tPriority.HIGH, value: 'HIGH' },
    { label: tPriority.URGENT, value: 'URGENT' },
  ]

  const setMultiParam = (key: string, values?: string[]) => {
    const params = new URLSearchParams(searchParams)
    params.delete(key)
    if (values && values.length > 0) {
      values.forEach((v) => params.append(key, v))
      params.set('skip', '0')
    }
    replace(`${pathname}?${params.toString()}`)
  }

  const hasFilters =
    searchParams.has('q') ||
    searchParams.has('status') ||
    searchParams.has('source') ||
    searchParams.has('priority') ||
    searchParams.has('assignedToId') ||
    searchParams.has('startDate') ||
    searchParams.has('endDate')

  const resetFilters = () => {
    const params = new URLSearchParams(searchParams)
    ;[
      'q',
      'status',
      'source',
      'priority',
      'assignedToId',
      'startDate',
      'endDate',
      'skip',
    ].forEach((k) => params.delete(k))
    replace(`${pathname}?${params.toString()}`)
    setQ('')
  }

  const userOptions =
    users?.map((u) => ({
      label: u.name || u.email,
      value: u.id,
    })) || []

  const activeFiltersCount =
    (searchParams.getAll('status').length || 0) +
    (searchParams.getAll('source').length || 0) +
    (searchParams.getAll('priority').length || 0) +
    (searchParams.getAll('assignedToId').length || 0)

  return (
    <div className="flex flex-col gap-3">
      {/* Mobile/Tablet: Search + Filter Button + Actions */}
      <div className="flex items-center gap-2 md:hidden">
        <Input
          placeholder={t.searchPlaceholder}
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            onSearch(e.target.value)
          }}
          className="h-8 flex-1"
        />

        {/* Mobile Filter Sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 relative">
              <Filter className="size-4" />
              {activeFiltersCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] flex flex-col">
            <SheetHeader className="px-6 pt-6 pb-4 border-b">
              <SheetTitle className="text-xl">{t.filterSheetTitle}</SheetTitle>
              <SheetDescription className="text-sm">
                {t.filterSheetDescription}
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground">
                    {t.filterStatus}
                  </label>
                  <LeadsFacetedFilter
                    title={t.filterStatus}
                    options={statusOptions}
                    selectedValues={searchParams.getAll('status')}
                    onValuesChange={(values: string[]) =>
                      setMultiParam('status', values)
                    }
                    fullWidth
                  />
                </div>

                <div className="h-px bg-border" />

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground">
                    {t.filterSource}
                  </label>
                  <LeadsFacetedFilter
                    title={t.filterSource}
                    options={sourceOptions}
                    selectedValues={searchParams.getAll('source')}
                    onValuesChange={(values: string[]) =>
                      setMultiParam('source', values)
                    }
                    fullWidth
                  />
                </div>

                <div className="h-px bg-border" />

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground">
                    {t.filterPriority}
                  </label>
                  <LeadsFacetedFilter
                    title={t.filterPriority}
                    options={priorityOptions}
                    selectedValues={searchParams.getAll('priority')}
                    onValuesChange={(values: string[]) =>
                      setMultiParam('priority', values)
                    }
                    fullWidth
                  />
                </div>

                {userOptions.length > 0 && (
                  <>
                    <div className="h-px bg-border" />
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-foreground">
                        {t.filterAssignedTo}
                      </label>
                      <LeadsFacetedFilter
                        title={t.filterAssignedTo}
                        options={userOptions}
                        selectedValues={searchParams.getAll('assignedToId')}
                        onValuesChange={(values: string[]) =>
                          setMultiParam('assignedToId', values)
                        }
                        fullWidth
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {hasFilters && (
              <div className="border-t px-6 py-4 bg-muted/30">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={resetFilters}
                  className="w-full"
                >
                  <X className="mr-2 size-4" />
                  {t.resetFilters}
                </Button>
              </div>
            )}
          </SheetContent>
        </Sheet>

        <LeadsViewOptions />
        <Button
          size="sm"
          variant="outline"
          className="h-8"
          onClick={() =>
            alert(
              translations?.exportButton?.notImplemented ||
                'Export button is not implemented yet, will be implemented in the future.',
            )
          }
        >
          <Download />
        </Button>
        <Button size="sm" className="h-8" href={routes.leads.new()}>
          <Plus />
        </Button>
      </div>

      {/* Desktop: Inline Filters */}
      <div className="hidden md:flex md:flex-col md:gap-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-1 items-center gap-2">
            <Input
              placeholder={t.searchPlaceholder}
              value={q}
              onChange={(e) => {
                setQ(e.target.value)
                onSearch(e.target.value)
              }}
              className="h-8 w-[180px] lg:w-[250px]"
            />
            <LeadsFacetedFilter
              title={t.filterStatus}
              options={statusOptions}
              selectedValues={searchParams.getAll('status')}
              onValuesChange={(values: string[]) =>
                setMultiParam('status', values)
              }
            />
            <LeadsFacetedFilter
              title={t.filterSource}
              options={sourceOptions}
              selectedValues={searchParams.getAll('source')}
              onValuesChange={(values: string[]) =>
                setMultiParam('source', values)
              }
            />
            <LeadsFacetedFilter
              title={t.filterPriority}
              options={priorityOptions}
              selectedValues={searchParams.getAll('priority')}
              onValuesChange={(values: string[]) =>
                setMultiParam('priority', values)
              }
            />
            {userOptions.length > 0 && (
              <LeadsFacetedFilter
                title={t.filterAssignedTo}
                options={userOptions}
                selectedValues={searchParams.getAll('assignedToId')}
                onValuesChange={(values: string[]) =>
                  setMultiParam('assignedToId', values)
                }
              />
            )}
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-8 px-2 lg:px-3"
              >
                {t.resetFilters}
                <X />
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <LeadsViewOptions />
            <Button
              size="sm"
              variant="outline"
              className="h-8"
              onClick={() =>
                alert(
                  translations?.exportButton?.notImplemented ||
                    'Export button is not implemented yet, will be implemented in the future.',
                )
              }
            >
              <Download className="mr-1" />
              {t.export}
            </Button>
            <Button size="sm" className="h-8" href={routes.leads.new()}>
              <Plus className="mr-1" />
              {t.newLead}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
