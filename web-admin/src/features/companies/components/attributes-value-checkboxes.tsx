// src/features/companies/components/attribute-value-checkboxes.tsx
'use client'

import { useGetAttributeValuesQuery } from '@gocrm/graphql/generated/hooks'
import { Skeleton } from '@gocrm/components/ui/skeleton'
import { Checkbox } from '@gocrm/components/ui/checkbox'
import { Label } from '@gocrm/components/ui/label'

interface AttributeValueCheckboxesProps {
  attributeTypeId: string
  selectedValues: string[] // URL'den gelen, bu tip için seçili olan ID'ler
  onFilterChange: (
    attributeTypeId: string,
    valueId: string,
    checked: boolean,
  ) => void
}

export const AttributeValueCheckboxes = ({
  attributeTypeId,
  selectedValues,
  onFilterChange,
}: AttributeValueCheckboxesProps) => {
  const { data, loading } = useGetAttributeValuesQuery({
    variables: {
      attributeTypeId: attributeTypeId,
      take: 200,
    },
  })

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
      </div>
    )
  }

  const values = data?.attributeValues.items || []

  if (values.length === 0) {
    return <p className="text-xs text-muted-foreground">Seçenek bulunmuyor.</p>
  }

  return (
    <div className="space-y-2">
      {values.map((value) => (
        <div className="flex items-center space-x-2" key={value.id}>
          <Checkbox
            id={value.id}
            checked={selectedValues.includes(value.id)}
            onCheckedChange={(checked) => {
              onFilterChange(attributeTypeId, value.id, !!checked)
            }}
          />
          <Label htmlFor={value.id} className="font-normal text-sm">
            {value.value}
          </Label>
        </div>
      ))}
    </div>
  )
}
