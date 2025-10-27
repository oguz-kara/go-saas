'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'

import { cn } from '@gocrm/lib/utils'
import { Button } from '@gocrm/components/ui/button'
import { Calendar } from '@gocrm/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@gocrm/components/ui/popover'
import { useTranslations } from '@gocrm/hooks/use-translations'

interface DateRangePickerProps {
  from?: Date
  to?: Date
  onSelect: (range: DateRange | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function DateRangePicker({
  from,
  to,
  onSelect,
  placeholder = 'Pick a date range',
  disabled,
  className,
}: DateRangePickerProps) {
  const { locale } = useTranslations()
  const dateLocale = locale === 'tr' ? tr : undefined

  const [date, setDate] = React.useState<DateRange | undefined>({
    from,
    to,
  })

  React.useEffect(() => {
    setDate({ from, to })
  }, [from, to])

  const handleSelect = (range: DateRange | undefined) => {
    setDate(range)
    // Only trigger onSelect when both dates are selected or range is cleared
    if (!range || (range.from && range.to) || (!range.from && !range.to)) {
      onSelect(range)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'justify-start text-left font-normal',
            !date?.from && 'text-muted-foreground',
            className,
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 size-4" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, 'LLL dd, y', { locale: dateLocale })} -{' '}
                {format(date.to, 'LLL dd, y', { locale: dateLocale })}
              </>
            ) : (
              format(date.from, 'LLL dd, y', { locale: dateLocale })
            )
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={handleSelect}
          numberOfMonths={2}
          locale={dateLocale}
        />
      </PopoverContent>
    </Popover>
  )
}

