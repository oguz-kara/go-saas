'use client'

import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@gocrm/components/ui/card'
import { Button } from '@gocrm/components/ui/button'
import { ArrowLeft, Building, Globe, Linkedin, Trash2 } from 'lucide-react'
import { EditCompanyDialog } from './edit-company-dialog'
import { DeleteCompanyAlert } from './delete-company-alert'

import type { Translations } from '@gocrm/lib/i18n/tr'
import {
  CompanyNote,
  GetCompanyWithAttributesAndNotesQuery,
} from '@gocrm/graphql/generated/hooks'
import { CompanyNotesSection } from './company-notes-section'

type Company = NonNullable<GetCompanyWithAttributesAndNotesQuery['company']>
type CompanyNotes = NonNullable<
  GetCompanyWithAttributesAndNotesQuery['companyNotes']
>

interface CompanyDetailViewProps {
  company: Company
  companyNotes: CompanyNotes
  translations: Translations
}

export const CompanyDetailView = ({
  company,
  companyNotes,
  translations,
}: CompanyDetailViewProps) => {
  const router = useRouter()

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {translations.companyDetailPage.backToCompanies}
      </Button>

      {/* Sayfa Başlığı ve Ana Eylemler */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{company.name}</h1>
        <div className="flex flex-wrap gap-2">
          {/* Edit ve Delete dialogları artık burada render edilecek */}
          <EditCompanyDialog company={company} asMenuItem={false} />
          <DeleteCompanyAlert companyId={company.id}>
            <Button variant="outline">
              <Trash2 className="mr-2 h-4 w-4" />
              {translations.companyDetailPage.deleteCompany}
            </Button>
          </DeleteCompanyAlert>
        </div>
      </div>

      {/* Şirket Bilgi Kartları */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>
              {translations.companyDetailPage.companyDetailsTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {company.industry && (
              <div className="flex items-center">
                <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{company.industry}</span>
              </div>
            )}
            {company.website && (
              <div className="flex items-center">
                <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                <a
                  href={company.website}
                  target="_blank"
                  className="text-blue-600 hover:underline truncate"
                >
                  {company.website}
                </a>
              </div>
            )}
            {company.linkedinUrl && (
              <div className="flex items-center">
                <Linkedin className="mr-2 h-4 w-4 text-muted-foreground" />
                <a
                  href={company.linkedinUrl}
                  target="_blank"
                  className="text-blue-600 hover:underline truncate"
                >
                  LinkedIn
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <CompanyNotesSection
        companyId={company.id}
        notes={companyNotes.items as CompanyNote[]}
        totalCount={companyNotes.totalCount}
      />
    </div>
  )
}
