import { CompaniesTable } from '@gocrm/features/companies/components/companies-table'
import { CreateCompanyDialog } from '@gocrm/features/companies/components/create-company-dialog'
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@gocrm/constants'
import { getTranslations } from '@gocrm/lib/i18n'
import { sdk } from '@gocrm/graphql'
import { withAuthProtection } from '@gocrm/lib/auth/with-auth-protection'
import { AppPagination } from '../../../components/common/app-pagination'

export default async function CompanyListPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  params?: Promise<{ locale?: string }>
}) {
  const sp = await searchParams
  const { locale } = (await params) || {}
  const api = sdk(locale)
  const translations = await getTranslations(locale)

  const getData = async () => {
    const pageInfo = {
      skip: sp?.skip ? parseInt(sp.skip as string) : DEFAULT_PAGE,
      take: sp?.take ? parseInt(sp.take as string) : DEFAULT_PAGE_SIZE,
    }

    const { companies: companiesData } = await api.getCompanies({
      skip: pageInfo.skip,
      take: pageInfo.take,
    })

    const companies = companiesData.items || []
    const totalCount = companiesData.totalCount || 0

    return { companies, totalCount, pageInfo }
  }

  const { companies, totalCount, pageInfo } = await withAuthProtection(getData)

  const currentPage = Math.floor(pageInfo.skip / pageInfo.take) + 1

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {translations?.companiesPage.title}{' '}
          <span className="text-sm font-normal text-muted-foreground">
            ({totalCount} {translations?.companiesPage.totalCountSuffix})
          </span>
        </h1>
        <div>
          <CreateCompanyDialog pageInfo={pageInfo} />
        </div>
      </div>
      <CompaniesTable companies={companies} pageInfo={pageInfo} />

      <div className="mt-auto pt-4">
        <AppPagination
          currentPage={currentPage}
          pageSize={pageInfo.take}
          totalCount={totalCount}
        />
      </div>
    </div>
  )
}
