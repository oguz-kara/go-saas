// src/features/attributes/components/attribute-type-list.tsx
'use client'

import { useState } from 'react'
import {
  useGetAttributeTypesQuery,
  useCreateAttributeTypeMutation,
  useUpdateAttributeTypeMutation,
  useDeleteAttributeTypeMutation,
  GetAttributeTypesDocument,
  AttributeType,
} from '@gocrm/graphql/generated/hooks'
import { useTranslations } from '@gocrm/hooks/use-translations'
import { useDebounce } from '@gocrm/hooks/use-debounce'
import { cn } from '@gocrm/lib/utils'
import { toast } from 'sonner'

import { Input } from '@gocrm/components/ui/input'
import { Button } from '@gocrm/components/ui/button'
import { Skeleton } from '@gocrm/components/ui/skeleton'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@gocrm/components/ui/alert-dialog'
import {
  PlusCircle,
  Loader2,
  Search,
  Pencil,
  Trash2,
  Check,
  X,
} from 'lucide-react'
import { handleGraphQLError } from '@gocrm/lib/errors/methods/handle-graphql-error'

interface AttributeTypeListProps {
  selectedType: AttributeType | null
  onSelectType: (type: AttributeType | null) => void
}

export const AttributeTypeList = ({
  selectedType,
  onSelectType,
}: AttributeTypeListProps) => {
  const { translations } = useTranslations()
  const t = translations?.attributeStudio

  // State'ler
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const [newTypeName, setNewTypeName] = useState('')
  const [editingState, setEditingState] = useState<{
    id: string
    name: string
  } | null>(null)

  // Data Fetching
  const { data, loading, refetch } = useGetAttributeTypesQuery({
    variables: { args: { searchQuery: debouncedSearchTerm } },
  })

  // Mutations
  const [createType, { loading: creating }] = useCreateAttributeTypeMutation({
    onCompleted: (data) => {
      const newType = data.createAttributeType
      setNewTypeName('')
      refetch() // Listeyi yeniden çekerek anında güncelle
      onSelectType(newType)
      toast.success(`"${newType.name}" tipi başarıyla oluşturuldu.`)
    },
    onError: (error) => toast.error(error.message),
  })

  const [updateType, { loading: updating }] = useUpdateAttributeTypeMutation({
    onCompleted: () => {
      setEditingState(null) // Düzenleme modundan çık
      toast.success('Tip başarıyla güncellendi.')
    },
    onError: (error) => toast.error(error.message),
  })

  const [deleteType] = useDeleteAttributeTypeMutation({
    onCompleted: () => {
      toast.success('Tip başarıyla silindi.')
      if (selectedType?.id === editingState?.id || selectedType) {
        onSelectType(null)
      }
    },
    onError: (error) =>
      handleGraphQLError(error, translations?.exceptionMessages),
    refetchQueries: [
      {
        query: GetAttributeTypesDocument,
        variables: { args: { searchQuery: debouncedSearchTerm } },
      },
    ],
  })

  // Handlers
  const handleAddNewType = () => {
    if (!newTypeName.trim() || creating) return
    createType({
      variables: { createAttributeTypeInput: { name: newTypeName.trim() } },
    })
  }

  const handleUpdate = () => {
    if (!editingState || !editingState.name.trim() || updating) return
    updateType({
      variables: {
        id: editingState.id,
        updateAttributeTypeInput: { name: editingState.name.trim() },
      },
    })
  }

  const attributeTypes = data?.attributeTypes.items || []

  return (
    <div className="flex flex-col h-full">
      {/* Arama ve Başlık Alanı */}
      <div className="border-b p-4 space-y-2">
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

      {/* Liste Alanı */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="p-4 space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        )}
        {!loading &&
          attributeTypes.map((type) =>
            editingState?.id === type.id ? (
              // DÜZENLEME MODU
              <div
                key={type.id}
                className="flex items-center gap-2 p-2 bg-muted"
              >
                <Input
                  autoFocus
                  value={editingState.name}
                  onChange={(e) =>
                    setEditingState({ ...editingState, name: e.target.value })
                  }
                  onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
                  className="h-9"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleUpdate}
                  disabled={updating}
                >
                  <Check className="h-4 w-4 text-green-600" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setEditingState(null)}
                >
                  <X className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            ) : (
              // GÖRÜNTÜLEME MODU
              <div
                key={type.id}
                className={cn(
                  'group w-full flex justify-between items-center text-left px-4 py-3 text-sm hover:bg-muted transition-colors',
                  {
                    'bg-accent text-accent-foreground':
                      selectedType?.id === type.id,
                  },
                )}
              >
                <button
                  className="flex-1 text-left"
                  onClick={() => onSelectType(type)}
                >
                  {type.name}
                </button>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() =>
                      setEditingState({ id: type.id, name: type.name })
                    }
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {t?.deleteTypeConfirmTitle}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {t?.deleteTypeConfirmDescription}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            deleteType({ variables: { id: type.id } })
                          }
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Evet, Sil
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ),
          )}
      </div>

      {/* Yeni Ekleme Alanı */}
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
