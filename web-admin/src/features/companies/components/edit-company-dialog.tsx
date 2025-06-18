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
import { mapApiDataToFormValues } from '../mappers/map-api-data-to-form-values'
import { mapFormValuesToInput } from '../mappers/map-company-form-values-to-input'

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

  console.log(company)

  const [updateCompany, { loading }] = useUpdateCompanyMutation({
    onCompleted: () => {
      toast.success(translations?.editCompanyDialog.successToast)
      setIsOpen(false)
      router.refresh()
    },
    onError: (error) => {
      toast.error(translations?.editCompanyDialog.errorToast, {
        description: error.message,
      })
    },
  })

  const handleSubmit = (values: CompanyFormValues) => {
    const input = mapFormValuesToInput(values)

    updateCompany({
      variables: {
        id: company.id,
        input,
      },
    })
  }

  const formInitialValues = mapApiDataToFormValues(company)

  console.log(formInitialValues.addressAttributeCodes)

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
      <DialogContent
        className="sm:max-w-[750px] overflow-y-auto h-[calc(100vh-5rem)] lg:h-[calc(100vh-10rem)] flex flex-col gap-4"
        aria-describedby={translations?.editCompanyDialog.description}
      >
        <DialogHeader>
          <DialogTitle>{translations?.editCompanyDialog.title}</DialogTitle>
          <DialogDescription>
            {translations?.editCompanyDialog.description}
          </DialogDescription>
        </DialogHeader>
        <CompanyForm
          onSubmit={handleSubmit}
          isSubmitting={loading}
          initialValues={formInitialValues}
        />
      </DialogContent>
    </Dialog>
  )
}
