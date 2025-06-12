// src/features/companies/components/edit-company-dialog.tsx
'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@gocrm/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@gocrm/components/ui/dropdown-menu' // Dropdown menü elemanı olarak kullanılacak
import { CompanyForm } from './company-form'
import { useTranslations } from '@gocrm/hooks/use-translations'
import {
  useUpdateCompanyMutation,
  GetCompaniesQuery,
} from '@gocrm/graphql/generated/hooks'
import { toast } from 'sonner'
import { CompanyFormValues } from '../schemas/company-form.schema'
import { useRouter } from 'next/navigation'

type CompanyItem = GetCompaniesQuery['companies']['items'][0]

interface EditCompanyDialogProps {
  company: CompanyItem
}

export const EditCompanyDialog = ({ company }: EditCompanyDialogProps) => {
  const router = useRouter()
  const { translations } = useTranslations()
  const [isOpen, setIsOpen] = useState(false)

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
    updateCompany({
      variables: {
        id: company.id,
        input: {
          name: values.name,
          website: values.website,
          industry: values.industry,
          description: values.description,
        },
      },
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {/* DropdownMenuItem, Dialog'u tetikleyecek */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {translations?.editCompanyDialog.triggerButton}
          </DropdownMenuTrigger>
        </DropdownMenu>
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
          initialValues={company}
        />
      </DialogContent>
    </Dialog>
  )
}
