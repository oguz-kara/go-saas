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
import { Textarea } from '@gocrm/components/ui/textarea'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useTranslations } from '@gocrm/hooks/use-translations'
import { useAddNoteMutation } from '@gocrm/graphql/generated/hooks'
import { GET_COMPANY_DETAIL_QUERY } from '@gocrm/features/companies/gql/documents/get-company-detail.query-gql'
import { toast } from 'sonner'
import { Loader2, PlusCircle } from 'lucide-react'

interface AddNoteFormValues {
  content: string
}

interface AddNoteDialogProps {
  companyId: string
}

export const AddNoteDialog = ({ companyId }: AddNoteDialogProps) => {
  const { translations } = useTranslations()
  const [isOpen, setIsOpen] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddNoteFormValues>()

  const [addNote, { loading }] = useAddNoteMutation({
    onCompleted: () => {
      toast.success(translations?.addNoteDialog.successToast)
      reset({ content: '' })
      setIsOpen(false)
    },
    onError: (error) => {
      toast.error(translations?.addNoteDialog.errorToast, {
        description: error.message,
      })
    },
    refetchQueries: [
      { query: GET_COMPANY_DETAIL_QUERY, variables: { id: companyId } },
    ],
  })

  const onSubmit: SubmitHandler<AddNoteFormValues> = (values) => {
    addNote({
      variables: {
        companyId,
        input: {
          content: values.content,
        },
      },
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          {translations?.companyDetailPage.addNoteButton}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{translations?.addNoteDialog.title}</DialogTitle>
          <DialogDescription>
            {translations?.addNoteDialog.description}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Textarea
            {...register('content', { required: 'Not içeriği boş olamaz.' })}
            placeholder="Notunuzu buraya yazın..."
            rows={5}
          />
          {errors.content && (
            <p className="text-sm text-red-600">{errors.content.message}</p>
          )}
          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {translations?.companyForm.submitButton}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
