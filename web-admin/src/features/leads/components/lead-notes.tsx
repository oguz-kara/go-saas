'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  useGetNotesQuery,
  useGetNotesCountQuery,
  useUpdateLeadNoteMutation,
  useDeleteLeadNoteMutation,
} from '@gocrm/graphql/generated/hooks'
import { Card, CardContent } from '@gocrm/components/ui/card'
import { Skeleton } from '@gocrm/components/ui/skeleton'
import { Button } from '@gocrm/components/ui/button'
import { Textarea } from '@gocrm/components/ui/textarea'
import { Input } from '@gocrm/components/ui/input'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { Pencil, Trash2, Save, X } from 'lucide-react'
import { z } from 'zod'
import { useTranslations } from '@gocrm/hooks/use-translations'

export function LeadNotes({ id }: { id: string }) {
  const { translations, locale } = useTranslations()
  const t = translations?.leadNotes
  const dateLocale = locale === 'tr' ? tr : undefined

  const [searchQuery, setSearchQuery] = useState('')
  const [skip] = useState(0)
  const [take] = useState(20)
  const variables = useMemo(
    () => ({ leadId: id, searchQuery: searchQuery || undefined, skip, take }),
    [id, searchQuery, skip, take],
  )
  const { data, loading, refetch } = useGetNotesQuery({ variables })
  const { data: countData } = useGetNotesCountQuery({
    variables: { leadId: id, searchQuery: searchQuery || undefined },
  })
  const [updateNote] = useUpdateLeadNoteMutation({
    onCompleted: () => toast.success(t?.saveButton || 'Note updated'),
    onError: (e) => toast.error(e.message),
  })
  const [deleteNote] = useDeleteLeadNoteMutation({
    onCompleted: () => toast.success(t?.deleteButton || 'Note deleted'),
    onError: (e) => toast.error(e.message),
  })
  const items = data?.notes?.items || []
  const totalCount = countData?.notesCount || 0

  useEffect(() => {
    const handler = (e: any) => {
      if (e?.detail?.leadId === id) refetch()
    }
    window.addEventListener('lead-notes-changed', handler)
    return () => window.removeEventListener('lead-notes-changed', handler)
  }, [id, refetch])

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState('')
  const contentSchema = z.object({
    content: z.string().min(1, 'Note cannot be empty'),
  })

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    )
  }

  const startEdit = (noteId: string, current: string) => {
    setEditingId(noteId)
    setEditingContent(current)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingContent('')
  }

  const saveEdit = async () => {
    if (!editingId) return
    try {
      contentSchema.parse({ content: editingContent })
      await updateNote({ variables: { id: editingId, content: editingContent } })
      setEditingId(null)
      setEditingContent('')
      refetch()
    } catch (e: any) {
      if (e?.message) toast.error(e.message)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Input
            placeholder={t?.searchPlaceholder || 'Search notes...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {t?.noteCount?.replace('{{count}}', totalCount.toString()) ||
            `${totalCount} notes`}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-sm text-muted-foreground">
            {searchQuery
              ? t?.emptyFiltered || 'No notes match your search.'
              : t?.emptyState || 'No notes yet. Be the first to add one!'}
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {items.map((n) => {
            const edited =
              new Date(n.updatedAt).getTime() - new Date(n.createdAt).getTime() >
              1000
            const isEditing = editingId === n.id
            return (
              <Card key={n.id} className="shadow-sm">
                <CardContent className="p-4">
                  {isEditing ? (
                    <div className="space-y-3">
                      <Textarea
                        rows={4}
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        className="text-sm"
                      />
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={cancelEdit}>
                          <X className="mr-1 size-4" />
                          {t?.cancelButton || 'Cancel'}
                        </Button>
                        <Button size="sm" onClick={saveEdit}>
                          <Save className="mr-1 size-4" />
                          {t?.saveButton || 'Save'}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <div className="min-w-0 flex-1 space-y-2">
                        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                          {n.content}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>
                            {formatDistanceToNow(new Date(n.createdAt), {
                              locale: dateLocale,
                              addSuffix: true,
                            })}
                          </span>
                          {edited && (
                            <>
                              <span>•</span>
                              <span>{t?.edited || 'edited'}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8"
                          onClick={() => startEdit(n.id, n.content)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8"
                          onClick={() => {
                            if (
                              confirm(
                                t?.deleteConfirm ||
                                  'Delete this note?',
                              )
                            ) {
                              deleteNote({ variables: { id: n.id } }).then(() =>
                                refetch(),
                              )
                            }
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
