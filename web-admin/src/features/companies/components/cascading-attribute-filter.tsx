'use client'

import { AttributeType } from '@gocrm/graphql/generated/hooks'
import { AttributeSelect } from './attribute-select' // Make sure the path is correct

/**
 * Defines the structure for each level in the hierarchy.
 */
export interface HierarchyLevel {
  level: number
  label: string
}

interface CascadingAttributeFilterProps {
  attributeType: AttributeType
  hierarchy: HierarchyLevel[]
  selectedValues: string[]
  onChange: (values: string[]) => void
}

export const CascadingAttributeFilter = ({
  attributeType,
  hierarchy,
  selectedValues,
  onChange,
}: CascadingAttributeFilterProps) => {
  const handleSelect = (level: number, value: string) => {
    const newValues = [...selectedValues.slice(0, level), value]
    onChange(newValues)
  }

  const handleClear = (level: number) => {
    console.log({ level })
    const newValues = selectedValues.slice(0, level)
    console.log('newValues', newValues)
    onChange(newValues)
  }

  const levelsToShow = Math.min(selectedValues.length + 1, hierarchy.length)

  return (
    <div className="border border-border rounded-md shadow-sm">
      {hierarchy.slice(0, levelsToShow).map((levelConfig, index) => {
        const parentId = index > 0 ? selectedValues[index - 1] : null
        const isDisabled = index > 0 && !parentId

        return (
          <AttributeSelect
            key={levelConfig.level}
            attributeTypeCode={attributeType.code}
            parentId={parentId}
            label={levelConfig.label}
            value={selectedValues[index] ?? ''}
            onValueChange={(value) => handleSelect(index, value)}
            onClear={() => handleClear(index)}
            isDisabled={isDisabled}
          />
        )
      })}
    </div>
  )
}
