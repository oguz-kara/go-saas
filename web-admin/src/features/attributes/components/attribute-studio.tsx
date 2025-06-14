// src/features/attributes/components/attribute-studio.tsx
'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent } from '@gocrm/components/ui/card'
import { GetAttributeTypesQuery } from '@gocrm/graphql/generated/hooks'
import { AttributeTypeList } from './attribute-type-list'
import { AttributeValueList } from './attribute-value-list'

type AttributeType = GetAttributeTypesQuery['attributeTypes']['items'][0]

interface AttributeStudioProps {
  initialAttributeTypes: AttributeType[]
}

export const AttributeStudio = ({
  initialAttributeTypes,
}: AttributeStudioProps) => {
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(
    initialAttributeTypes[0]?.id || null,
  )

  // Bu memoization, selectedTypeId değişmedikçe selectedTypeName'in yeniden hesaplanmasını önler.
  const selectedTypeName = useMemo(() => {
    return initialAttributeTypes.find((t) => t.id === selectedTypeId)?.name
  }, [selectedTypeId, initialAttributeTypes])

  return (
    <Card>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-0 min-h-[70vh]">
        <div className="col-span-1 md:border-r">
          <AttributeTypeList
            initialAttributeTypes={initialAttributeTypes}
            selectedTypeId={selectedTypeId}
            onSelectType={setSelectedTypeId}
          />
        </div>
        <div className="col-span-2">
          <AttributeValueList
            selectedTypeId={selectedTypeId}
            selectedTypeName={selectedTypeName}
          />
        </div>
      </CardContent>
    </Card>
  )
}
