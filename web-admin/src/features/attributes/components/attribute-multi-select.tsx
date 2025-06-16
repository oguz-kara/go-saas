// src/features/attributes/components/attribute-multi-select.tsx
'use client'

import * as React from 'react'
import { Check, ChevronsUpDown, PlusCircle, X } from 'lucide-react'
import { cn } from '@gocrm/lib/utils'
import { Button } from '@gocrm/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@gocrm/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@gocrm/components/ui/popover'
import { Badge } from '@gocrm/components/ui/badge'
import {
  AttributableType,
  AttributeDataType,
  AttributeTypeKind,
  useCreateAttributeTypeMutation,
  useGetAttributeValuesQuery,
} from '@gocrm/graphql/generated/hooks'
import { useDebounce } from '@gocrm/hooks/use-debounce'
import { toast } from 'sonner'

interface AttributeValue {
  id: string
  value: string
}

interface AttributeMultiSelectProps {
  attributeTypeId: string
  selectedValues: AttributeValue[]
  onSelectionChange: (newSelection: AttributeValue[]) => void
}

export const AttributeMultiSelect = ({
  attributeTypeId,
  selectedValues,
  onSelectionChange,
}: AttributeMultiSelectProps) => {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const debouncedSearch = useDebounce(searchQuery, 300)

  const { data, loading } = useGetAttributeValuesQuery({
    variables: { attributeTypeId, searchQuery: debouncedSearch },
  })

  const [createValue, { loading: creating }] = useCreateAttributeTypeMutation({
    onCompleted: (data) => {
      const newValue = data.createAttributeType
      onSelectionChange([
        ...selectedValues,
        { id: newValue.id, value: newValue.name },
      ])
      setSearchQuery('')
      toast.success(`"${newValue.name}" değeri oluşturuldu ve eklendi.`)
    },
    onError: (error) => toast.error(error.message),
  })

  const handleCreateNew = () => {
    if (!searchQuery.trim()) return
    createValue({
      variables: {
        createAttributeTypeInput: {
          name: searchQuery.trim(),
          availableFor: [AttributableType.Company],
          dataType: AttributeDataType.Text,
          kind: AttributeTypeKind.Text,
        },
      },
    })
  }

  const handleSelect = (value: AttributeValue) => {
    onSelectionChange([...selectedValues, value])
    setSearchQuery('')
  }

  const handleDeselect = (valueToRemove: AttributeValue) => {
    onSelectionChange(selectedValues.filter((v) => v.id !== valueToRemove.id))
  }

  const availableOptions =
    data?.attributeValues.items.filter(
      (option) => !selectedValues.some((selected) => selected.id === option.id),
    ) || []

  const isExactMatchFound = availableOptions.some(
    (opt) => opt.value.toLowerCase() === searchQuery.toLowerCase(),
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto min-h-10"
        >
          <div className="flex gap-1 flex-wrap">
            {selectedValues.length === 0 && (
              <span className="text-muted-foreground">Seçim yap...</span>
            )}
            {selectedValues.map((val) => (
              <Badge
                variant="secondary"
                key={val.id}
                className="mr-1"
                onClick={(e) => {
                  e.preventDefault()
                  handleDeselect(val)
                }}
              >
                {val.value}
                <X className="ml-1 h-3 w-3" />
              </Badge>
            ))}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput
            placeholder="Değer ara veya yeni oluştur..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>
              {!isExactMatchFound && searchQuery.trim() && !creating ? (
                <CommandItem
                  onSelect={handleCreateNew}
                  className="text-primary cursor-pointer"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  &quot;{searchQuery}&quot; oluştur ve ekle
                </CommandItem>
              ) : (
                'Sonuç bulunamadı.'
              )}
            </CommandEmpty>
            <CommandGroup>
              {loading && <CommandItem>Yükleniyor...</CommandItem>}
              {availableOptions.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.value}
                  onSelect={() =>
                    handleSelect({ id: option.id, value: option.value })
                  }
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedValues.some((v) => v.id === option.id)
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                  {option.value}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
