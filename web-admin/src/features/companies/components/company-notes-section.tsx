// src/features/notes/components/company-notes-section.tsx
'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { CompanyNote } from '@gocrm/graphql/generated/hooks'
import { useDebounce } from '@gocrm/hooks/use-debounce'
import { useTranslations } from '@gocrm/hooks/use-translations'
import { AddNoteDialog } from '@gocrm/features/companies/components/add-note-dialog'
import { NoteCard } from '@gocrm/features/companies/components/company-note-card'
import { Input } from '@gocrm/components/ui/input'
import { Search } from 'lucide-react'

interface CompanyNotesSectionProps {
  companyId: string
  notes: CompanyNote[]
  totalCount: number
}

export const CompanyNotesSection = ({
  companyId,
  notes,
  totalCount,
}: CompanyNotesSectionProps) => {
  const { translations } = useTranslations()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [localSearchTerm, setLocalSearchTerm] = useState(
    searchParams.get('notesSearchQuery') || '',
  )

  const debouncedSearchTerm = useDebounce(localSearchTerm, 500)

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())

    if (debouncedSearchTerm) {
      params.set('notesSearchQuery', debouncedSearchTerm)
    } else {
      params.delete('notesSearchQuery')
    }

    router.replace(`${pathname}?${params.toString()}`)
  }, [debouncedSearchTerm, pathname, router, searchParams])

  const activeSearchTerm = searchParams.get('notesSearchQuery') || ''

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-4">
        <h2 className="text-xl font-semibold">
          {translations?.companyDetailPage.notesTitle} ({totalCount})
        </h2>
        <div className="flex items-center gap-2">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Notlarda ara..."
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <AddNoteDialog companyId={companyId} />
        </div>
      </div>
      <div className="space-y-4">
        {notes.length > 0 ? (
          notes.map((note) => <NoteCard key={note.id} note={note} />)
        ) : (
          <div className="text-center py-8 px-4 border-2 border-dashed rounded-lg">
            <p className="text-sm text-muted-foreground">
              {activeSearchTerm
                ? 'Arama kriterlerinize uygun not bulunamadı.'
                : 'Bu şirket için henüz not eklenmemiş.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
