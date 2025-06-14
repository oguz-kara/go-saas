// src/features/attributes/components/attribute-type-list.tsx
'use client'

import { useState } from 'react'

import { PlusCircle, Loader2, Search } from 'lucide-react'
import { toast } from 'sonner'
import {
  GetAttributeTypesDocument,
  useCreateAttributeTypeMutation,
  useGetAttributeTypesQuery,
} from '@gocrm/graphql/generated/hooks'
import { useTranslations } from '@gocrm/hooks/use-translations'
import { useDebounce } from '@gocrm/hooks/use-debounce'
import { Input } from '@gocrm/components/ui/input'
import { Skeleton } from '@gocrm/components/ui/skeleton'
import { cn } from '@gocrm/lib/utils'
import { Button } from '@gocrm/components/ui/button'

type AttributeType = NonNullable<
  ReturnType<typeof useGetAttributeTypesQuery>['data']
>['attributeTypes']['items'][0]

interface AttributeTypeListProps {
  initialAttributeTypes: AttributeType[]
  selectedTypeId: string | null
  onSelectType: (id: string | null) => void
}

export const AttributeTypeList = ({
  initialAttributeTypes,
  selectedTypeId,
  onSelectType,
}: AttributeTypeListProps) => {
  const { translations } = useTranslations()
  const t = translations?.attributeStudio

  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const [newTypeName, setNewTypeName] = useState('')

  const { data, loading } = useGetAttributeTypesQuery({
    variables: {
      args: {
        searchQuery: debouncedSearchTerm,
      },
    },
  })

  const [createType, { loading: creating }] = useCreateAttributeTypeMutation({
    refetchQueries: [
      {
        query: GetAttributeTypesDocument,
        variables: { searchQuery: '' },
      },
    ],
    onCompleted: (data) => {
      const newType = data.createAttributeType
      setNewTypeName('')
      onSelectType(newType.id) // Yeni ekleneni otomatik seç
      toast.success(`"${newType.name}" tipi başarıyla oluşturuldu.`)
    },
    onError: (error) => toast.error(error.message),
  })

  const handleAddNewType = () => {
    if (!newTypeName.trim() || creating) return
    createType({
      variables: { createAttributeTypeInput: { name: newTypeName.trim() } },
    })
  }

  const attributeTypes = data?.attributeTypes.items || initialAttributeTypes

  return (
    <div className="flex flex-col h-full">
      <div className="border-b py-4 pr-4 space-y-2">
        <h2 className="text-lg font-semibold">{t?.typesColumnTitle}</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tip ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="p-4 space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        )}
        {!loading &&
          attributeTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => onSelectType(type.id)}
              className={cn(
                'w-full text-left px-4 py-3 text-sm hover:bg-muted transition-colors',
                {
                  'bg-accent text-accent-foreground':
                    selectedTypeId === type.id,
                },
              )}
            >
              {type.name}
            </button>
          ))}
        {!loading && attributeTypes.length === 0 && (
          <p className="p-4 text-sm text-center text-muted-foreground">
            {t?.noTypesFound}
          </p>
        )}
      </div>
      <div className="border-t p-4 space-y-2 bg-muted/50">
        <div className="flex gap-2">
          <Input
            placeholder={t?.addNewTypePlaceholder}
            value={newTypeName}
            onChange={(e) => setNewTypeName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddNewType()}
            disabled={creating}
          />
          <Button
            onClick={handleAddNewType}
            disabled={creating || !newTypeName.trim()}
            size="icon"
          >
            {creating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <PlusCircle className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
