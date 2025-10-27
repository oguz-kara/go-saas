'use client'

import * as React from 'react'
import { Check, PlusCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { useTranslations } from '@/hooks/use-translations'

interface LeadsFacetedFilterProps {
  title?: string
  options: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
  selectedValues: string[]
  onValuesChange: (values: string[]) => void
  fullWidth?: boolean
}

export function LeadsFacetedFilter({
  title,
  options,
  selectedValues,
  onValuesChange,
  fullWidth = false,
}: LeadsFacetedFilterProps) {
  const { translations } = useTranslations()
  const selectedValuesSet = new Set(selectedValues)

  if (!translations) {
    return null
  }

  const t = translations.leadsPage

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size={fullWidth ? 'default' : 'sm'}
          className={cn(
            fullWidth ? 'h-10 w-full justify-start' : 'h-8',
            'border-dashed',
          )}
        >
          <PlusCircle className={fullWidth ? 'mr-2 size-4' : ''} />
          {title}
          {selectedValuesSet.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValuesSet.size}
              </Badge>
              <div
                className={cn('hidden gap-1', fullWidth ? 'flex' : 'lg:flex')}
              >
                {selectedValuesSet.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {t.selectedCount.replace(
                      '{{count}}',
                      String(selectedValuesSet.size),
                    )}
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValuesSet.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn('p-0', fullWidth ? 'w-full' : 'w-[200px]')}
        align="start"
      >
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>{t.noResults}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValuesSet.has(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      const newValues = new Set(selectedValuesSet)
                      if (isSelected) {
                        newValues.delete(option.value)
                      } else {
                        newValues.add(option.value)
                      }
                      onValuesChange(Array.from(newValues))
                    }}
                    className={cn(fullWidth && 'h-11')}
                  >
                    <div
                      className={cn(
                        'flex size-4 items-center justify-center rounded-[4px] border',
                        isSelected
                          ? 'bg-primary border-primary text-primary-foreground'
                          : 'border-input [&_svg]:invisible',
                      )}
                    >
                      <Check className="text-primary-foreground size-3.5" />
                    </div>
                    {option.icon && (
                      <option.icon className="text-muted-foreground size-4" />
                    )}
                    <span>{option.label}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedValuesSet.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => onValuesChange([])}
                    className={cn(
                      'justify-center text-center',
                      fullWidth && 'h-11',
                    )}
                  >
                    {t.clearFilters}
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
