// src/features/attributes/components/attribute-studio.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent } from '@gocrm/components/ui/card'
import { AttributeTypeList } from './attribute-type-list'
import { AttributeValueList } from './attribute-value-list'
import {
  AttributeType,
  GetAttributeArchitectureQuery,
} from '@gocrm/graphql/generated/hooks'

export const AttributeStudio = ({
  initialData,
}: {
  initialData: GetAttributeArchitectureQuery
}) => {
  const [selectedType, setSelectedType] = useState<AttributeType | null>(null)

  return (
    <Card>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-0 min-h-[70vh]">
        <div className="col-span-1 md:border-r">
          <AttributeTypeList
            initialData={initialData}
            selectedType={selectedType}
            onSelectType={setSelectedType}
          />
        </div>
        <div className="col-span-2">
          <AttributeValueList
            selectedTypeId={selectedType?.id || null}
            selectedTypeName={selectedType?.name}
          />
        </div>
      </CardContent>
    </Card>
  )
}
