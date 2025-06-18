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
  GetAttributeArchitectureQuery,
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
import { PlusCircle, Search, Pencil, Trash2 } from 'lucide-react'
import { handleGraphQLError } from '@gocrm/lib/errors/methods/handle-graphql-error'
import { AttributeTypeDialog } from './attribute-type-dialog'
import { AttributeTypeSchema } from '../schemas/attribute-type.schema'

interface AttributeTypeListProps {
  selectedType: AttributeType | null
  onSelectType: (type: AttributeType | null) => void
  initialData: GetAttributeArchitectureQuery
}

export const AttributeTypeList = ({
  selectedType,
  onSelectType,
  initialData,
}: AttributeTypeListProps) => {
  console.log({ initialList: initialData })
  const { translations } = useTranslations()
  const t = translations?.attributeStudio

  // State
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingType, setEditingType] = useState<AttributeType | null>(null)

  // Data Fetching
  const { data, loading, refetch } = useGetAttributeTypesQuery({
    variables: { args: { searchQuery: debouncedSearchTerm } },
    fetchPolicy: 'cache-and-network',
  })

  // Mutations
  const [createType, { loading: creating }] = useCreateAttributeTypeMutation({
    onCompleted: (data) => {
      const newType = data.createAttributeType
      refetch()
      onSelectType(newType as AttributeType)
      setIsDialogOpen(false)
      toast.success(
        `"${newType.name}" ${
          t?.toastTypeCreatedSuccess || 'type has been successfully created.'
        }`,
      )
    },
    onError: (error) =>
      handleGraphQLError(
        error,
        translations ?? undefined,
        translations?.attributeStudio.toastValueError,
      ),
  })

  const [updateType, { loading: updating }] = useUpdateAttributeTypeMutation({
    onCompleted: (data) => {
      const updatedType = data.updateAttributeType
      setIsDialogOpen(false)
      setEditingType(null)
      toast.success(
        `"${updatedType.name}" ${
          t?.toastTypeUpdatedSuccess || 'type has been successfully updated.'
        }`,
      )
    },
    onError: (error) =>
      handleGraphQLError(
        error,
        translations ?? undefined,
        translations?.attributeStudio.toastValueError,
      ),
  })

  const [deleteType] = useDeleteAttributeTypeMutation({
    onCompleted: (data, clientOptions) => {
      // Assuming the mutation returns a boolean. We can't get the name from the response.
      // We will show a generic success message.
      toast.success(
        t?.toastTypeDeletedSuccess || 'The type has been successfully deleted.',
      )
      if (selectedType?.id === clientOptions?.variables?.id) {
        onSelectType(null)
      }
    },
    onError: (error) =>
      handleGraphQLError(
        error,
        translations ?? undefined,
        translations?.attributeStudio.toastValueError,
      ),
    refetchQueries: [
      {
        query: GetAttributeTypesDocument,
        variables: { args: { searchQuery: debouncedSearchTerm } },
      },
    ],
  })

  // Handlers
  const handleOpenCreateDialog = () => {
    setEditingType(null)
    setIsDialogOpen(true)
  }

  const handleOpenEditDialog = (type: AttributeType) => {
    console.log({ type })
    setEditingType(type)
    setIsDialogOpen(true)
  }

  const handleDialogSubmit = (values: AttributeTypeSchema) => {
    if (editingType) {
      // Update
      updateType({
        variables: {
          id: editingType.id,
          updateAttributeTypeInput: {
            id: editingType.id,
            ...values,
            groupId: values.groupId || undefined,
          },
        },
      })
    } else {
      // Create
      createType({
        variables: {
          createAttributeTypeInput: {
            ...values,
            groupId: values.groupId || undefined,
          },
        },
      })
    }
  }

  const attributeTypes = data?.attributeTypes.items || []

  return (
    <div className="flex flex-col h-full">
      {/* Search and Title */}
      <div className="border-b p-4 space-y-2">
        <h2 className="text-lg font-semibold">{t?.typesColumnTitle}</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t?.searchTypePlaceholder || 'Search types...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* List Area */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="p-4 space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        )}
        {!loading &&
          attributeTypes.map((type) => (
            <div
              key={type.id}
              className={cn(
                'group w-full flex justify-between items-center text-left px-4 py-3 text-sm hover:bg-muted transition-colors cursor-pointer',
                {
                  'bg-accent text-accent-foreground':
                    selectedType?.id === type.id,
                },
              )}
              onClick={() => onSelectType(type as AttributeType)}
            >
              <span className="flex-1">{type.name}</span>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleOpenEditDialog(type as AttributeType)
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => e.stopPropagation()}
                    >
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
                      <AlertDialogCancel>{t?.cancel}</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() =>
                          deleteType({ variables: { id: type.id } })
                        }
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {t?.delete || 'Delete'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
      </div>

      {/* Add New Area */}
      <div className="border-t p-4">
        <Button onClick={handleOpenCreateDialog} className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" />
          {t?.addNewTypeButton || 'Add New Type'}
        </Button>
      </div>

      <AttributeTypeDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleDialogSubmit}
        isLoading={creating || updating}
        initialData={editingType}
        attributeGroups={initialData.attributeGroups.items}
      />
    </div>
  )
}
