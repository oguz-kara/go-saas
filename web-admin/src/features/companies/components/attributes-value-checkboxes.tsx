// src/features/companies/components/attribute-value-checkboxes.tsx
'use client'

import {
  AttributeType,
  useGetAttributeValuesByCodeQuery,
} from '@gocrm/graphql/generated/hooks'
import { Skeleton } from '@gocrm/components/ui/skeleton'
import { Checkbox } from '@gocrm/components/ui/checkbox'
import { Label } from '@gocrm/components/ui/label'

interface AttributeValueCheckboxesProps {
  attributeType: AttributeType
  selectedValues: string[] // URL'den gelen, bu tip için seçili olan ID'ler
  onFilterChange: (
    attributeTypeId: string,
    valueId: string,
    checked: boolean,
  ) => void
}

export const AttributeValueCheckboxes = ({
  attributeType,
  selectedValues,
  onFilterChange,
}: AttributeValueCheckboxesProps) => {
  const { data, loading } = useGetAttributeValuesByCodeQuery({
    variables: {
      args: {
        attributeTypeCode: attributeType.code,
        take: 200,
        skip: 0,
      },
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

  const values = data?.attributeValuesByCode.items || []

  if (values.length === 0) {
    return <p className="text-xs text-muted-foreground">Seçenek bulunmuyor.</p>
  }

  return (
    <div className="space-y-2">
      {values.map((value) => (
        <div className="flex items-center space-x-2" key={value.id}>
          <Checkbox
            id={value.id}
            checked={selectedValues.includes(value.code)}
            onCheckedChange={(checked) => {
              onFilterChange(attributeType.code, value.code, !!checked)
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
