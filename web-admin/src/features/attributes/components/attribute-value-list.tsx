// src/features/attributes/components/attribute-value-list.tsx
'use client'

import { useState } from 'react'
import {
  useCreateAttributeMutation,
  useDeleteAttributeMutation,
  useUpdateAttributeMutation,
  useGetAttributeValuesQuery,
} from '@gocrm/graphql/generated/hooks'
import { useTranslations } from '@gocrm/hooks/use-translations'
import { useDebounce } from '@gocrm/hooks/use-debounce'
import { Input } from '@gocrm/components/ui/input'
import { Button } from '@gocrm/components/ui/button'
import { Badge } from '@gocrm/components/ui/badge'
import { Skeleton } from '@gocrm/components/ui/skeleton'
import { Loader2, PlusCircle, X, Check, Pencil, Search } from 'lucide-react'
import { toast } from 'sonner'

interface AttributeValueListProps {
  selectedTypeId: string | null
  selectedTypeName?: string
}

export const AttributeValueList = ({
  selectedTypeId,
  selectedTypeName,
}: AttributeValueListProps) => {
  const { translations } = useTranslations()
  const t = translations?.attributeStudio

  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const [newValue, setNewValue] = useState('')
  const [editingValue, setEditingValue] = useState<{
    id: string
    text: string
  } | null>(null)

  const { data, loading, error, refetch } = useGetAttributeValuesQuery({
    variables: {
      attributeTypeId: selectedTypeId!,
      searchQuery: debouncedSearchTerm,
    },
    skip: !selectedTypeId,
    fetchPolicy: 'cache-and-network',
  })

  const [createValue, { loading: creating }] = useCreateAttributeMutation({
    onCompleted: () => {
      setNewValue('')
      refetch()
      toast.success('Değer eklendi.')
    },
    onError: (err) => toast.error(err.message),
  })

  const [deleteValue] = useDeleteAttributeMutation({
    onCompleted: () => {
      refetch()
      toast.success('Değer silindi.')
    },
    onError: (err) => toast.error(err.message),
  })

  const [updateValue] = useUpdateAttributeMutation({
    onCompleted: () => {
      setEditingValue(null)
      refetch()
      toast.success('Değer güncellendi.')
    },
    onError: (err) => toast.error(err.message),
  })

  const handleCreate = () => {
    if (!newValue.trim() || !selectedTypeId) return
    createValue({
      variables: {
        createAttributeInput: {
          value: newValue.trim(),
          attributeTypeId: selectedTypeId,
        },
      },
    })
  }

  const handleUpdate = () => {
    if (!editingValue || !editingValue.text.trim()) return
    updateValue({
      variables: {
        id: editingValue.id,
        updateAttributeInput: { value: editingValue.text.trim() },
      },
    })
  }

  if (!selectedTypeId) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground p-6">
        <p>{t?.selectTypePrompt}</p>
      </div>
    )
  }

  const values = data?.attributeValues.items || []

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4 space-y-2">
        <h2 className="text-lg font-semibold">{`"${selectedTypeName}" Değerleri`}</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Değer ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        {loading && (
          <div className="space-y-2">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-8 w-1/2" />
          </div>
        )}
        {error && <p className="text-red-600">Hata: {error.message}</p>}
        {!loading && !error && (
          <div className="flex flex-wrap gap-2">
            {values.map((val) => (
              <div key={val.id}>
                {editingValue?.id === val.id ? (
                  <div className="flex items-center gap-1">
                    <Input
                      autoFocus
                      value={editingValue.text}
                      onChange={(e) =>
                        setEditingValue({
                          ...editingValue,
                          text: e.target.value,
                        })
                      }
                      onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
                      className="h-8"
                    />
                    <Button size="icon" variant="ghost" onClick={handleUpdate}>
                      <Check className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditingValue(null)}
                    >
                      <X className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                ) : (
                  <Badge
                    variant="secondary"
                    className="group text-base font-medium p-2 pr-1 cursor-default"
                  >
                    {val.value}
                    <button
                      onClick={() =>
                        setEditingValue({ id: val.id, text: val.value })
                      }
                      className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => deleteValue({ variables: { id: val.id } })}
                      className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3 text-red-500" />
                    </button>
                  </Badge>
                )}
              </div>
            ))}
            {values.length === 0 && (
              <p className="text-sm text-muted-foreground w-full">
                {t?.noValuesFound}
              </p>
            )}
          </div>
        )}
      </div>
      <div className="border-t p-4 space-y-2 bg-muted/50">
        <div className="flex gap-2">
          <Input
            placeholder={t?.addNewValuePlaceholder}
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            disabled={creating}
          />
          <Button
            onClick={handleCreate}
            disabled={creating || !newValue.trim()}
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
