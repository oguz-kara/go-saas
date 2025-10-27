'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'

import { Button } from '@gocrm/components/ui/button'
import { Calendar } from '@gocrm/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@gocrm/components/ui/popover'
import { useTranslations } from '@gocrm/hooks/use-translations'

interface DatePickerProps {
  value: Date | undefined
  onChange: (date: Date | undefined) => void
  disabled?: boolean
  className?: string
  placeholder?: string
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  disabled,
  className,
  placeholder,
}) => {
  const { translations, locale } = useTranslations()
  const dateLocale = locale === 'tr' ? tr : undefined
  const defaultPlaceholder = translations?.addActivity?.pickDatePlaceholder || 'Pick a date'

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!value}
          className={`data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal ${
            className || ''
          }`}
          disabled={disabled}
          type="button"
        >
          <CalendarIcon />
          {value ? (
            format(value, 'PPP', { locale: dateLocale })
          ) : (
            <span>{placeholder || defaultPlaceholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          disabled={disabled}
          locale={dateLocale}
        />
      </PopoverContent>
    </Popover>
  )
}
