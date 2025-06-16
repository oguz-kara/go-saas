'use client'

import { useState } from 'react'
import { Button } from '@gocrm/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@gocrm/components/ui/dialog'
import { CompanyForm } from './company-form'
import { useTranslations } from '@gocrm/hooks/use-translations'
import { useCreateCompanyMutation } from '@gocrm/graphql/generated/hooks'
import { toast } from 'sonner'
import { CompanyFormValues } from '../schemas/company-form.schema'
import { GetCompaniesQuery } from '../gql/documents/get-companies-query-gql'
import { useRouter } from 'next/navigation'

export const CreateCompanyDialog = ({
  pageInfo,
}: {
  pageInfo: { skip: number; take: number }
}) => {
  const router = useRouter()
  const { translations } = useTranslations()
  const [isOpen, setIsOpen] = useState(false)

  const [createCompany, { loading }] = useCreateCompanyMutation({
    onCompleted: () => {
      toast.success(translations?.createCompanyDialog.successToast)
      setIsOpen(false)
      router.refresh()
    },
    onError: (error) => {
      toast.error(translations?.createCompanyDialog.errorToast, {
        description: error.message,
      })
    },
    refetchQueries: [
      {
        query: GetCompaniesQuery,
        variables: {
          skip: pageInfo.skip,
          take: pageInfo.take,
        },
      },
    ],
  })

  const handleSubmit = (values: CompanyFormValues) => {
    createCompany({
      variables: {
        input: {
          name: values.name,
          website: values.website || null,
          description: values.description || null,
          attributeIds: values.attributes
            ? Object.values(values.attributes).flatMap((arr) =>
                arr?.map((attribute) => attribute.id),
              )
            : [],
        },
      },
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>{translations?.createCompanyDialog.triggerButton}</Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[750px] overflow-y-auto max-h-[calc(100vh-10rem)]"
        aria-describedby={translations?.createCompanyDialog.description}
      >
        <DialogHeader>
          <DialogTitle>{translations?.createCompanyDialog.title}</DialogTitle>
          <DialogDescription>
            {translations?.createCompanyDialog.description}
          </DialogDescription>
        </DialogHeader>
        <CompanyForm onSubmit={handleSubmit} isSubmitting={loading} />
      </DialogContent>
    </Dialog>
  )
}
