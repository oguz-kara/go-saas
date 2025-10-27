import { getTranslations } from '@gocrm/lib/i18n/get-translations'
import { AttributeStudio } from '@gocrm/features/attributes/components/attribute-studio'
import { withAuthProtection } from '@gocrm/lib/auth/with-auth-protection'
import { sdk } from '@gocrm/graphql'
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@gocrm/constants'
import { PageHeader } from '@gocrm/components/common/page-header'

export default async function AttributeStudioPage({
  searchParams,
}: {
  searchParams: Promise<{
    locale: string
    attributeGroupsPage: string
    attributeTypesPage: string
  }>
}) {
  const sp = await searchParams
  const attributeGroupsPage = sp.attributeGroupsPage
  const attributeTypesPage = sp.attributeTypesPage

  const translations = await getTranslations()

  const api = sdk(sp.locale)

  const getData = async () => {
    return await api.GetAttributeArchitecture({
      attributeTypesArgs: {
        searchQuery: '',
        skip: attributeTypesPage ? parseInt(attributeTypesPage) : DEFAULT_PAGE,
        take: DEFAULT_PAGE_SIZE,
      },
      attributeTypesIncludeSystemDefined: true,
      attributeGroupsSearchQuery: '',
      attributeGroupsTake: DEFAULT_PAGE_SIZE,
      attributeGroupsSkip: attributeGroupsPage
        ? parseInt(attributeGroupsPage)
        : DEFAULT_PAGE,
    })
  }

  const initialData = await withAuthProtection(getData)

  return (
    <div className="space-y-4">
      <PageHeader
        title={translations.attributeStudio.pageTitle}
        description={translations.attributeStudio.pageDescription}
        titleSize="sm"
      />
      <AttributeStudio initialData={initialData} />
    </div>
  )
}
