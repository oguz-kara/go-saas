'use client'

import * as React from 'react'
import {
  AttributeType as BaseAttributeType,
  AttributeDataType,
  AttributeTypeKind,
  useGetAttributeValuesByCodeQuery,
} from '@gocrm/graphql/generated/hooks'
import {
  CascadingAttributeFilter,
  HierarchyLevel,
} from '../../companies/components/cascading-attribute-filter'
import { Input } from '@gocrm/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@gocrm/components/ui/select'
import { Checkbox } from '@gocrm/components/ui/checkbox'
import { Skeleton } from '@gocrm/components/ui/skeleton'
import { Label } from '@gocrm/components/ui/label'
import { DatePicker } from '@gocrm/components/ui/date-picker'

type AttributeType = BaseAttributeType & {
  config?: { hierarchy?: HierarchyLevel[] }
}

interface AttributeFieldProps {
  attributeType: AttributeType
  value: string | number | boolean | string[]
  onChange: (value: string | number | boolean | string[]) => void
  name: string
  /**
   * hierarchy is required if attributeType.kind === 'HIERARCHIEL', otherwise optional
   */
  hierarchy?: HierarchyLevel[] // TypeScript cannot enforce conditional requiredness at the type level
}

const AttributeValueSelect = ({
  attributeTypeCode,
  value,
  onValueChange,
  placeholder,
}: {
  attributeTypeCode: string
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
}) => {
  const { data, loading } = useGetAttributeValuesByCodeQuery({
    variables: { args: { attributeTypeCode, take: 200 } },
  })

  if (loading) return <Skeleton className="h-10 w-full" />

  const attributeValues = data?.attributeValuesByCode.items || []

  return (
    <Select onValueChange={onValueChange} value={value}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder || 'Select an option'} />
      </SelectTrigger>
      <SelectContent>
        {attributeValues.map((val) => (
          <SelectItem key={val.id} value={val.code}>
            {val.value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

const AttributeValueMultiSelect = ({
  attributeTypeCode,
  value,
  onChange,
}: {
  attributeTypeCode: string
  value: string[]
  onChange: (value: string[]) => void
}) => {
  const { data, loading } = useGetAttributeValuesByCodeQuery({
    variables: { args: { attributeTypeCode, take: 200 } },
  })

  if (loading) return <Skeleton className="h-20 w-full" />

  const attributeValues = data?.attributeValuesByCode.items || []

  const handleCheckedChange = (checked: boolean, code: string) => {
    const newValue = checked
      ? [...(value || []), code]
      : (value || []).filter((v) => v !== code)
    onChange(newValue)
  }

  return (
    <div className="space-y-2 rounded-md border p-4">
      {attributeValues.map((val) => (
        <div key={val.id} className="flex items-center gap-2">
          <Checkbox
            id={`${attributeTypeCode}-${val.id}`}
            checked={(value || []).includes(val.code)}
            onCheckedChange={(checked) =>
              handleCheckedChange(Boolean(checked), val.code)
            }
          />
          <Label htmlFor={`${attributeTypeCode}-${val.id}`}>{val.value}</Label>
        </div>
      ))}
    </div>
  )
}

export const AttributeField = ({
  attributeType,
  value,
  onChange,
  name,
  hierarchy,
}: AttributeFieldProps) => {
  switch (attributeType.kind) {
    case AttributeTypeKind.Hierarchical:
      return (
        <CascadingAttributeFilter
          attributeType={attributeType}
          hierarchy={hierarchy || []}
          selectedValues={value as string[]}
          onChange={onChange}
        />
      )

    case AttributeTypeKind.Select:
      return (
        <AttributeValueSelect
          attributeTypeCode={attributeType.code}
          value={value as string}
          onValueChange={onChange}
          placeholder={`Select ${attributeType.name}`}
        />
      )

    case AttributeTypeKind.MultiSelect:
      return (
        <AttributeValueMultiSelect
          attributeTypeCode={attributeType.code}
          value={value as string[]}
          onChange={onChange}
        />
      )

    case AttributeTypeKind.Text:
      switch (attributeType.dataType) {
        case AttributeDataType.Number:
          return (
            <Input
              name={name}
              value={value as number}
              onChange={(e) => onChange(e.target.valueAsNumber)}
              type="number"
            />
          )
        case AttributeDataType.Date:
          return (
            <DatePicker
              value={value as unknown as Date}
              onChange={(date) => onChange(date as unknown as string)}
            />
          )
        case AttributeDataType.Boolean:
          return (
            <div className="flex items-center gap-2">
              <Checkbox
                checked={value as boolean}
                onCheckedChange={onChange}
                id={name}
              />
              <Label htmlFor={name}>{attributeType.name}</Label>
            </div>
          )
        case AttributeDataType.Text:
        default:
          return (
            <Input
              name={name}
              value={value as string}
              onChange={(e) => onChange(e.target.value)}
              type="text"
            />
          )
      }

    default:
      console.warn('Unknown attribute kind:', attributeType.kind)
      return (
        <Input
          name={name}
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
        />
      )
  }
}
