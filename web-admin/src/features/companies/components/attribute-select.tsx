'use client'

import { X } from 'lucide-react'
import { useGetAttributeValuesByCodeQuery } from '@gocrm/graphql/generated/hooks'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@gocrm/components/ui/select'
import { Skeleton } from '@gocrm/components/ui/skeleton'
import { useTranslations } from '@gocrm/hooks/use-translations'
import { cn } from '@gocrm/lib/utils'

interface AttributeSelectProps {
  attributeTypeCode: string
  parentId: string | null
  label: string
  value?: string
  onValueChange: (value: string) => void
  onClear: () => void
  isDisabled?: boolean
}

export const AttributeSelect = ({
  attributeTypeCode,
  parentId,
  label,
  value,
  onValueChange,
  onClear,
  isDisabled = false,
}: AttributeSelectProps) => {
  const { translations } = useTranslations()
  const { data, loading } = useGetAttributeValuesByCodeQuery({
    variables: {
      args: {
        attributeTypeCode,
        parentCode: parentId,
        take: 500,
        skip: 0,
      },
    },
    // Skip the query if it's disabled (e.g., waiting for a parent selection)
    skip: isDisabled,
  })

  // Show a skeleton while loading
  if (loading) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  const items = data?.attributeValuesByCode.items ?? []

  // Don't render anything if it's not the first level and there are no items
  if (isDisabled && items.length === 0 && parentId !== null) {
    return null
  }

  const hasValue = value && value.length > 0

  return (
    <div className="relative w-full">
      <Select
        onValueChange={onValueChange}
        value={value}
        disabled={isDisabled || items.length === 0}
      >
        <SelectTrigger
          className={cn(
            'w-full border-0 border-b-1 border-dashed border-border rounded-none shadow-none',
            (label === translations?.address.neighborhood || !value) &&
              'border-none',
            hasValue && !isDisabled && 'pr-8',
          )}
        >
          <SelectValue
            placeholder={`${
              translations?.common.select
            } ${label.toLowerCase()}...`}
          />
        </SelectTrigger>
        <SelectContent>
          {items.length === 0 && !loading && (
            <SelectItem value="no-options" disabled>
              No options available
            </SelectItem>
          )}
          {items.map((item) => (
            <SelectItem key={item.code} value={item.code}>
              {item.value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasValue && !isDisabled && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onClear()
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground/70 transition-colors hover:text-muted-foreground"
          aria-label="Clear selection"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
