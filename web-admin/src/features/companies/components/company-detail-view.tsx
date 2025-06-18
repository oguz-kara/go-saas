'use client'

import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@gocrm/components/ui/card'
import { Button } from '@gocrm/components/ui/button'
import {
  ArrowLeft,
  Globe,
  Hash,
  MapPin,
  Phone,
  Trash2,
  Twitter,
} from 'lucide-react'
import { Mail } from 'lucide-react'
import { EditCompanyDialog } from './edit-company-dialog'
import { DeleteCompanyAlert } from './delete-company-alert'

import type { Translations } from '@gocrm/lib/i18n/tr'
import {
  CompanyNote,
  GetCompanyWithAttributesAndNotesQuery,
} from '@gocrm/graphql/generated/hooks'
import { CompanyNotesSection } from './company-notes-section'
import { Separator } from '@gocrm/components/ui/separator'

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
            {/* Mevcut alanlar aynı kalıyor */}
            <div className="flex items-center">
              <Mail className="mr-2 h-4 w-4 text-muted-foreground" />{' '}
              <a
                href={`mailto:${company.email}`}
                className="text-primary hover:underline"
              >
                {company.email || '-'}
              </a>
            </div>
            <div className="flex items-center">
              <Phone className="mr-2 h-4 w-4 text-muted-foreground" />{' '}
              <span>{company.phoneNumber || '-'}</span>
            </div>
            <div className="flex items-center">
              <Globe className="mr-2 h-4 w-4 text-muted-foreground" />{' '}
              <a
                href={company.website || '#'}
                target="_blank"
                className="text-primary hover:underline"
              >
                {company.website || '-'}
              </a>
            </div>

            {/* --- YENİ EKLENEN ALANLAR --- */}
            {company.taxId && (
              <div className="flex items-center">
                <Hash className="mr-2 h-4 w-4 text-muted-foreground" />{' '}
                <span>Vergi No: {company.taxId}</span>
              </div>
            )}

            {company.socialProfiles?.twitter && (
              <div className="flex items-center">
                <Twitter className="mr-2 h-4 w-4 text-muted-foreground" />{' '}
                <a
                  href={company.socialProfiles.twitter}
                  target="_blank"
                  className="text-primary hover:underline"
                >
                  Twitter Profili
                </a>
              </div>
            )}
            {company.socialProfiles?.facebook && (
              <div className="flex items-center">
                <Globe className="mr-2 h-4 w-4 text-muted-foreground" />{' '}
                <a
                  href={company.socialProfiles.facebook}
                  target="_blank"
                  className="text-primary hover:underline"
                >
                  Facebook Sayfası
                </a>
              </div>
            )}
            {/* --- YENİ EKLENEN ALANLAR BİTİŞ --- */}

            <Separator className="my-4" />
            <div className="flex flex-col items-start">
              <MapPin className="mr-2 mt-1 h-4 w-4 text-muted-foreground flex-shrink-0" />{' '}
              <p>
                {[
                  company.address?.line1,
                  company.address?.line2,
                  company.address?.postalCode,
                ]
                  .filter(Boolean)
                  .join(', ') || 'Adres bilgisi girilmemiş.'}
              </p>
              <br />
              <p>
                {company.addressAttributeCodes?.map((atc) => atc).join(', ')}
              </p>
            </div>
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
