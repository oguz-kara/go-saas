// src/features/companies/components/edit-company-dialog.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@gocrm/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@gocrm/components/ui/dialog'
import { DropdownMenuItem } from '@gocrm/components/ui/dropdown-menu'
import { CompanyForm } from './company-form'
import { useTranslations } from '@gocrm/hooks/use-translations'
import {
  useUpdateCompanyMutation,
  GetCompaniesWithAttributesQuery,
} from '@gocrm/graphql/generated/hooks'
import { toast } from 'sonner'
import { CompanyFormValues } from '../schemas/company-form.schema'

type CompanyForEdit = GetCompaniesWithAttributesQuery['companies']['items'][0]

interface EditCompanyDialogProps {
  company: CompanyForEdit
  asMenuItem?: boolean
}

export const EditCompanyDialog = ({
  company,
  asMenuItem = true,
}: EditCompanyDialogProps) => {
  const { translations } = useTranslations()
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const [updateCompany, { loading }] = useUpdateCompanyMutation({
    onCompleted: () => {
      toast.success(translations?.editCompanyDialog.successToast)
      setIsOpen(false)
      // Değişikliklerin hem liste hem de detay sayfasında görünmesi için
      // Server Component'i yeniden veri çekmeye zorluyoruz.
      router.refresh()
    },
    onError: (error) => {
      toast.error(translations?.editCompanyDialog.errorToast, {
        description: error.message,
      })
    },
  })

  const handleSubmit = (values: CompanyFormValues) => {
    // Önemli: Formdan gelen değerlerle `updateCompanyInput`'u oluşturuyoruz.
    // Şimdilik temel alanları içeriyor, Attribute'ları bir sonraki adımda ekleyeceğiz.
    updateCompany({
      variables: {
        id: company.id,
        input: {
          name: values.name,
          website: values.website,
          industry: values.industry,
          description: values.description,
          attributeIds: values.attributes
            ? Object.values(values.attributes).flatMap((arr) =>
                arr?.map((attribute) => attribute.id),
              )
            : [],
        },
      },
    })
  }

  const TriggerComponent = asMenuItem ? DropdownMenuItem : Button

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <TriggerComponent
          onSelect={asMenuItem ? (e) => e.preventDefault() : undefined}
          variant={asMenuItem ? undefined : 'default'}
          size={asMenuItem ? undefined : 'default'}
        >
          {translations?.editCompanyDialog.triggerButton}
        </TriggerComponent>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{translations?.editCompanyDialog.title}</DialogTitle>
          <DialogDescription>
            {translations?.editCompanyDialog.description}
          </DialogDescription>
        </DialogHeader>
        <CompanyForm
          onSubmit={handleSubmit}
          isSubmitting={loading}
          initialValues={{
            ...company,
            attributes:
              company.attributes?.reduce((acc, attribute) => {
                if (!acc[attribute.attributeTypeId]) {
                  acc[attribute.attributeTypeId] = []
                }
                acc[attribute.attributeTypeId].push({
                  id: attribute.id,
                  value: attribute.value,
                })
                return acc
              }, {} as Record<string, { id: string; value: string }[]>) || {},
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
