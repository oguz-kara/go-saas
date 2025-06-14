'use client'

// React and Next.js
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Third-party
import { useForm, SubmitHandler, Controller, FormProvider } from 'react-hook-form'
import { toast } from 'sonner'
import { Loader2, PlusCircle } from 'lucide-react'

// Components
import { Button } from '@gocrm/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@gocrm/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@gocrm/components/ui/select'
import { Textarea } from '@gocrm/components/ui/textarea'

// Hooks and Queries
import { useTranslations } from '@gocrm/hooks/use-translations'

import {
  useAddNoteMutation,
  CompanyNoteType,
} from '@gocrm/graphql/generated/hooks'
import { FormControl } from '@gocrm/components/ui/form'

interface AddNoteFormValues {
  content: string
  type: CompanyNoteType
}

interface AddNoteDialogProps {
  companyId: string
}

export const AddNoteDialog = ({ companyId }: AddNoteDialogProps) => {
  const router = useRouter()
  const { translations } = useTranslations()
  const [isOpen, setIsOpen] = useState(false)
  const methods = useForm<AddNoteFormValues>({
    defaultValues: { type: CompanyNoteType.General },
  })

  const [addNote, { loading }] = useAddNoteMutation({
    onCompleted: () => {
      toast.success(translations?.addNoteDialog.successToast)
      methods.reset({ content: '', type: CompanyNoteType.General })
      setIsOpen(false)
      router.refresh()
    },
    onError: (error) => {
      toast.error(translations?.addNoteDialog.errorToast, {
        description: error.message,
      })
    },
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
      <DialogContent
        className="sm:max-w-md"
        aria-describedby={translations?.addNoteDialog.description}
      >
        <DialogHeader>
          <DialogTitle>{translations?.addNoteDialog.title}</DialogTitle>
          <DialogDescription>
            {translations?.addNoteDialog.description}
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              control={methods.control}
              name="type"
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={translations?.addNoteDialog.typePlaceholder}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={CompanyNoteType.General}>Genel</SelectItem>
                    <SelectItem value={CompanyNoteType.Meeting}>
                      Toplantı
                    </SelectItem>
                    <SelectItem value={CompanyNoteType.Call}>Arama</SelectItem>
                    <SelectItem value={CompanyNoteType.FollowUp}>
                      Takip
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <Textarea
              {...methods.register('content', { required: 'Not içeriği boş olamaz.' })}
              placeholder="Notunuzu buraya yazın..."
              rows={5}
            />
            {methods.formState.errors.content && (
              <p className="text-sm text-red-600">{methods.formState.errors.content.message}</p>
            )}
            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {translations?.companyForm.submitButton}
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
