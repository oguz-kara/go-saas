// src/app/(app)/companies/[id]/page.tsx
import { notFound } from 'next/navigation'
import { sdk } from '@gocrm/graphql'
import { getTranslations } from '@gocrm/lib/i18n'
import { CompanyDetailView } from '@gocrm/features/companies/components/company-detail-view'
import { withAuthProtection } from '@gocrm/lib/auth/with-auth-protection'

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = (await params) || {}
  const api = sdk('tr')
  const translations = await getTranslations('tr')

  const { company } = await withAuthProtection(async () => {
    return await api.getCompanyDetail({
      id: id,
      notesTake: 10,
      notesSkip: 0,
    })
  })

  if (!company) {
    notFound()
  }

  return <CompanyDetailView company={company} translations={translations} />
}
