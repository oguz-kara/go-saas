// src/app/(app)/companies/[id]/page.tsx
import { notFound } from 'next/navigation'
import { sdk } from '@gocrm/graphql'
import { getTranslations } from '@gocrm/lib/i18n'
import { CompanyDetailView } from '@gocrm/features/companies/components/company-detail-view'
import { Alert, AlertDescription, AlertTitle } from '@gocrm/components/ui/alert'
import { Terminal } from 'lucide-react'

// Sayfa artık bir Server Component, bu yüzden async olabilir
export default async function CompanyDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params
  const api = sdk('tr')
  const translations = await getTranslations('tr')

  try {
    const { company } = await api.GetCompanyDetail({
      id: id,
      notesTake: 10,
      notesSkip: 0,
    })

    if (!company) {
      notFound()
    }

    return <CompanyDetailView company={company} translations={translations} />
  } catch (error) {
    console.error(`Sunucu Tarafı Hata (Şirket ${id}):`, error)

    return (
      <div className="p-8">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>{translations.companiesPage.errorTitle}</AlertTitle>
          <AlertDescription>
            Şirket detayları yüklenirken beklenmedik bir hata oluştu. Lütfen
            daha sonra tekrar deneyin.
          </AlertDescription>
        </Alert>
      </div>
    )
  }
}
