'use client'

import { useState } from 'react'
import { Textarea } from '@gocrm/components/ui/textarea'
import { Button } from '@gocrm/components/ui/button'
import { toast } from 'sonner'
import {
  useCreateNoteMutation,
  GetNotesDocument,
  GetNotesCountDocument,
} from '@gocrm/graphql/generated/hooks'
import { z } from 'zod'
import { useParams } from 'next/navigation'
import { useTranslations } from '@gocrm/hooks/use-translations'

export function AddNoteInline() {
  const { translations } = useTranslations()
  const t = translations?.addNote

  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [mutate] = useCreateNoteMutation()
  const params = useParams() as { id?: string }
  const schema = z.object({
    content: z.string().min(1, t?.validation_contentRequired || 'Note cannot be empty'),
  })

  const onSubmit = async () => {
    setLoading(true)
    try {
      const leadId = params?.id
      if (!leadId) throw new Error('Lead id missing')
      schema.parse({ content })
      await mutate({
        variables: { leadId, content },
        refetchQueries: [
          { query: GetNotesDocument, variables: { leadId } },
          { query: GetNotesCountDocument, variables: { leadId } },
        ],
        awaitRefetchQueries: true,
      })
      toast.success(t?.successToast || 'Note added')
      setContent('')
      window.dispatchEvent(
        new CustomEvent('lead-notes-changed', { detail: { leadId } }),
      )
    } catch (e: any) {
      toast.error(
        e?.message || t?.errorToast || 'Failed to add note',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="space-y-3">
        <Textarea
          placeholder={t?.placeholder || 'Write a note...'}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          className="resize-none"
        />
        <div className="flex justify-end">
          <Button
            size="sm"
            onClick={onSubmit}
            disabled={loading || !content.trim()}
          >
            {loading
              ? t?.addingButton || 'Adding...'
              : t?.addButton || 'Add Note'}
          </Button>
        </div>
      </div>
    </div>
  )
}
