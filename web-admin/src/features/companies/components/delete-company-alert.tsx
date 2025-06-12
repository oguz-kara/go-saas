// src/features/companies/components/delete-company-alert.tsx
'use client'

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
  DropdownMenu,
  DropdownMenuTrigger,
} from '@gocrm/components/ui/dropdown-menu'
import { useTranslations } from '@gocrm/hooks/use-translations'
import { useDeleteCompanyMutation } from '@gocrm/graphql/generated/hooks'
import { GetCompaniesQuery } from '@gocrm/features/companies/gql/documents/get-companies-query-gql'
import { toast } from 'sonner'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

interface DeleteCompanyAlertProps {
  companyId: string
}

export const DeleteCompanyAlert = ({ companyId }: DeleteCompanyAlertProps) => {
  const { translations } = useTranslations()
  const [isOpen, setIsOpen] = useState(false)

  const [deleteCompany, { loading }] = useDeleteCompanyMutation({
    onCompleted: () => {
      toast.success(translations?.deleteCompanyAlert.successToast)
      setIsOpen(false)
    },
    onError: (error) => {
      toast.error(translations?.deleteCompanyAlert.errorToast, {
        description: error.message,
      })
    },
    refetchQueries: [{ query: GetCompaniesQuery }],
  })

  const handleDelete = () => {
    deleteCompany({ variables: { id: companyId } })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {translations?.deleteCompanyAlert.triggerButton}
          </DropdownMenuTrigger>
        </DropdownMenu>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {translations?.deleteCompanyAlert.title}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {translations?.deleteCompanyAlert.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            {translations?.deleteCompanyAlert.cancelButton}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {translations?.deleteCompanyAlert.confirmButton}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
