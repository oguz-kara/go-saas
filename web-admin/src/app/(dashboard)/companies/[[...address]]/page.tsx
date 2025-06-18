import { CreateCompanyDialog } from '@gocrm/features/companies/components/create-company-dialog'
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@gocrm/constants'
import { getTranslations } from '@gocrm/lib/i18n'
import { sdk } from '@gocrm/graphql'
import { withAuthProtection } from '@gocrm/lib/auth/with-auth-protection'
import { AppPagination } from '../../../../components/common/app-pagination'
import { CompaniesList } from '@gocrm/features/companies/components/companies-list'
import { AttributeFilterInput } from '@gocrm/graphql/generated/hooks'
import { CompanyFilterSidebar } from '@gocrm/features/companies/components/company-filter-sidebar'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@gocrm/components/ui/sheet'
import { Button } from '@gocrm/components/ui/button'
import { Filter } from 'lucide-react'

export default async function CompanyListPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined
    skip: string
    take: string
  }>
  params: Promise<{ locale?: string; address?: string[] }>
}) {
  const sp = await searchParams
  const { locale, address } = (await params) || {}

  const searchQuery = sp?.searchQuery
  const addressSlug = address?.[0]
  const addressParts = addressSlug ? addressSlug.split('-') : []
  const api = sdk(locale)
  const translations = await getTranslations(locale)

  const getData = async () => {
    const pageInfo = {
      skip: sp?.skip ? parseInt(sp.skip as string) : DEFAULT_PAGE,
      take: sp?.take ? parseInt(sp.take as string) : DEFAULT_PAGE_SIZE,
    }

    const filters: AttributeFilterInput[] = []
    Object.entries(sp).forEach(([key, value]) => {
      if (key !== 'skip' && key !== 'take' && key !== 'searchQuery' && value) {
        filters.push({
          attributeTypeId: key,
          valueIds: Array.isArray(value) ? value : value.split(','),
        })
      }
    })

    const { companies: companiesData } = await withAuthProtection(async () => {
      return api.getCompaniesWithAttributes({
        skip: pageInfo.skip,
        take: pageInfo.take,
        filters,
        address: addressSlug,
        searchQuery: searchQuery as string,
      })
    })

    const companies = companiesData.items || []
    const totalCount = companiesData.totalCount || 0

    return { companies, totalCount, pageInfo }
  }

  const { companies, totalCount, pageInfo } = await withAuthProtection(getData)

  const currentPage = Math.floor(pageInfo.skip / pageInfo.take) + 1

  return (
    <div className="flex flex-col lg:flex-row lg:gap-8">
      <aside className="hidden lg:block lg:w-64">
        <CompanyFilterSidebar address={addressParts} />
      </aside>

      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            {translations?.companiesPage.title}{' '}
            <span className="text-sm font-normal text-muted-foreground">
              ({totalCount} {translations?.companiesPage.totalCountSuffix})
            </span>
          </h1>
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">
                    {translations?.companiesPage.openFiltersButton}
                  </span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-4">
                <SheetTitle>
                  {translations?.companiesPage?.title || 'Filtreler'}
                </SheetTitle>
                <SheetDescription>
                  {translations?.companiesPage.filterDescription}
                </SheetDescription>
                <CompanyFilterSidebar address={addressParts} />
              </SheetContent>
            </Sheet>
            <CreateCompanyDialog pageInfo={pageInfo} />
          </div>
        </div>
        <CompaniesList companies={companies} pageInfo={pageInfo} />

        <div className="mt-auto pt-4">
          <AppPagination
            currentPage={currentPage}
            pageSize={pageInfo.take}
            totalCount={totalCount}
          />
        </div>
      </div>
    </div>
  )
}
