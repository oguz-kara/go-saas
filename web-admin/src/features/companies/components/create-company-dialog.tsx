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
import { mapFormValuesToInput } from '../mappers/map-company-form-values-to-input'
import { handleGraphQLError } from '@gocrm/lib/errors/methods/handle-graphql-error'

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
      handleGraphQLError(
        error,
        translations ?? undefined,
        translations?.createCompanyDialog.errorToast,
      )
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

  const handleSubmit = async (values: CompanyFormValues) => {
    const input = mapFormValuesToInput(values)

    await createCompany({
      variables: {
        input,
      },
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>{translations?.createCompanyDialog.triggerButton}</Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[750px] overflow-y-auto h-[calc(100vh-5rem)] lg:h-[calc(100vh-10rem)] flex flex-col gap-4"
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
