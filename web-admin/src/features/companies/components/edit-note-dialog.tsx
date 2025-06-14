// src/features/notes/components/edit-note-dialog.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@gocrm/components/ui/dialog'
import { Button } from '@gocrm/components/ui/button'
import { Textarea } from '@gocrm/components/ui/textarea'
import { Pencil, Loader2 } from 'lucide-react'
import {
  useUpdateNoteMutation,
  CompanyNoteType,
} from '@gocrm/graphql/generated/hooks'
import { useTranslations } from '@gocrm/hooks/use-translations'

interface EditNoteFormValues {
  content: string
}

interface EditNoteDialogProps {
  note: {
    id: string
    content: string
    type: CompanyNoteType
  }
}

export const EditNoteDialog = ({ note }: EditNoteDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { register, handleSubmit } = useForm<EditNoteFormValues>({
    defaultValues: { content: note.content },
  })
  const { translations, isLoading } = useTranslations()
  const [updateNote, { loading }] = useUpdateNoteMutation({
    onCompleted: () => {
      toast.success(translations!.editNoteDialog.successToast)
      setIsOpen(false)
      router.refresh() // Detay sayfasını yenile
    },
    onError: (err) => toast.error(err.message),
  })

  if (isLoading || !translations) {
    return null
  }

  const onSubmit: SubmitHandler<EditNoteFormValues> = (values) => {
    updateNote({
      variables: {
        noteId: note.id,
        input: { content: values.content },
      },
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{translations.editNoteDialog.title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Textarea {...register('content', { required: true })} rows={6} />
          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {translations.editNoteDialog.submitButton}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
