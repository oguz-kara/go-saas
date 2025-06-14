// src/app/(app)/companies/[id]/page.tsx
import { notFound } from 'next/navigation'
import { sdk } from '@gocrm/graphql'
import { getTranslations } from '@gocrm/lib/i18n'
import { CompanyDetailView } from '@gocrm/features/companies/components/company-detail-view'
import { withAuthProtection } from '@gocrm/lib/auth/with-auth-protection'

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale?: string }>
}) {
  const { id, locale } = (await params) || {}
  const api = sdk(locale)
  const translations = await getTranslations(locale)

  const { company } = await withAuthProtection(async () => {
    return await api.getCompanyWithAttributes({
      id: id,
    })
  })

  if (!company) {
    notFound()
  }

  return <CompanyDetailView company={company} translations={translations} />
}
