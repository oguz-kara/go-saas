'use client'

import {
  AttributeType,
  GetAttributeArchitectureQuery,
} from '@gocrm/graphql/generated/hooks'
import { useTranslations } from '@gocrm/hooks/use-translations'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@gocrm/components/ui/dialog'
import { AttributeTypeForm } from './attribute-type-form'
import { AttributeTypeSchema } from '../schemas/attribute-type.schema'

interface AttributeTypeDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (values: AttributeTypeSchema) => void
  isLoading: boolean
  initialData?: AttributeType | null
  attributeGroups: GetAttributeArchitectureQuery['attributeGroups']['items']
}

export const AttributeTypeDialog = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialData,
  attributeGroups,
}: AttributeTypeDialogProps) => {
  const { translations } = useTranslations()
  const t = translations?.attributeStudio

  const isEditMode = !!initialData

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode
              ? t?.editTypeTitle || 'Edit Type'
              : t?.createTypeTitle || 'Create New Type'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? t?.editTypeDescription ||
                'Change the details of the attribute type below.'
              : t?.createTypeDescription ||
                'Fill in the details below to create a new attribute type.'}
          </DialogDescription>
        </DialogHeader>
        <AttributeTypeForm
          onSubmit={onSubmit}
          onCancel={onClose}
          isLoading={isLoading}
          initialData={initialData}
          attributeGroups={attributeGroups}
          isEditMode={isEditMode}
        />
      </DialogContent>
    </Dialog>
  )
}
