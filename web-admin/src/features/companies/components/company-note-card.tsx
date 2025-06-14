'use client'

// React and Next.js
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

// Third-party
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'

// Components
import { Badge } from '@gocrm/components/ui/badge'
import { Button } from '@gocrm/components/ui/button'
import { Card, CardContent, CardHeader } from '@gocrm/components/ui/card'
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

// Hooks and Queries
import { useTranslations } from '@gocrm/hooks/use-translations'
import {
  CompanyNoteType,
  GetCompanyWithAttributesAndNotesDocument,
  GetCompanyWithAttributesAndNotesQuery,
  useDeleteNoteMutation,
  User,
} from '@gocrm/graphql/generated/hooks'

// Local Components
import { EditNoteDialog } from './edit-note-dialog'

type CompanyNote = NonNullable<
  NonNullable<GetCompanyWithAttributesAndNotesQuery['companyNotes']>
>['items'][0]

interface NoteCardProps {
  note: CompanyNote
}

export const NoteCard = ({ note }: NoteCardProps) => {
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const { translations } = useTranslations()
  const t = translations?.noteCard
  const sessionUser = session?.user as User
  const isAuthor = sessionUser?.id === note.userId

  const [deleteNote] = useDeleteNoteMutation({
    onCompleted: () => {
      toast.success('Not başarıyla silindi.')
    },
    onError: (err) => toast.error(err.message),
    refetchQueries: [
      {
        query: GetCompanyWithAttributesAndNotesDocument,
        variables: {
          id: searchParams.get('id') as string,
          skip: searchParams.get('skip') as string,
          take: searchParams.get('take') as string,
        },
      },
    ],
  })

  const noteTypeTranslations = {
    GENERAL: 'Genel',
    MEETING: 'Toplantı',
    CALL: 'Arama',
    FOLLOW_UP: 'Takip',
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between p-4">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            {new Date(note.createdAt).toLocaleString('tr-TR', {
              dateStyle: 'long',
              timeStyle: 'short',
            })}
          </p>
          {note.type && (
            <Badge variant="outline">
              {noteTypeTranslations[note.type] || note.type}
            </Badge>
          )}
        </div>
        {isAuthor && (
          <div className="flex items-center gap-1">
            <EditNoteDialog
              note={{
                id: note.id,
                content: note.content,
                type: note.type as CompanyNoteType,
              }}
            />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t?.deleteConfirmTitle}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t?.deleteConfirmDescription}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>İptal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      deleteNote({ variables: { noteId: note.id } })
                    }
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Evet, Sil
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0 whitespace-pre-wrap">
        {note.content}
      </CardContent>
    </Card>
  )
}
