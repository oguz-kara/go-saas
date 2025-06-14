// src/app/(app)/companies/[id]/page.tsx
import { notFound } from 'next/navigation'
import { sdk } from '@gocrm/graphql'
import { getTranslations } from '@gocrm/lib/i18n'
import { CompanyDetailView } from '@gocrm/features/companies/components/company-detail-view'
import { withAuthProtection } from '@gocrm/lib/auth/with-auth-protection'
import { AppPagination } from '@gocrm/components'
import { DEFAULT_PAGE_SIZE } from '@gocrm/constants'
import { DEFAULT_PAGE } from '@gocrm/constants'

export default async function CompanyDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; locale?: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const sp = await searchParams
  const { id, locale } = (await params) || {}
  const api = sdk(locale)
  const translations = await getTranslations(locale)
  const notesSearchQuery = sp?.notesSearchQuery || ''

  const pageInfo = {
    skip: sp?.skip ? parseInt(sp.skip as string) : DEFAULT_PAGE,
    take: sp?.take ? parseInt(sp.take as string) : DEFAULT_PAGE_SIZE,
  }

  const { company, companyNotes } = await withAuthProtection(async () => {
    return await api.getCompanyWithAttributesAndNotes({
      id: id,
      skip: pageInfo.skip,
      take: pageInfo.take,
      searchQuery: (notesSearchQuery as string) || undefined,
    })
  })

  if (!company) {
    notFound()
  }

  const currentPage = Math.floor(pageInfo.skip / pageInfo.take) + 1

  return (
    <>
      <CompanyDetailView
        company={company}
        companyNotes={companyNotes || { items: [], totalCount: 0 }}
        translations={translations}
      />

      <div className="mt-auto pt-4">
        <AppPagination
          currentPage={currentPage}
          pageSize={pageInfo.take}
          totalCount={companyNotes?.totalCount || 0}
        />
      </div>
    </>
  )
}
