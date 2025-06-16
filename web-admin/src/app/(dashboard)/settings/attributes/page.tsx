// src/app/(dashboard)/settings/attributes/page.tsx
import { getTranslations } from '@gocrm/lib/i18n/get-translations'
import { AttributeStudio } from '@gocrm/features/attributes/components/attribute-studio'
import { withAuthProtection } from '@gocrm/lib/auth/with-auth-protection'
import { sdk } from '@gocrm/graphql'

export default async function AttributeStudioPage({
  searchParams,
}: {
  searchParams: Promise<{ locale: string }>
}) {
  const sp = await searchParams

  const translations = await getTranslations()

  const api = sdk(sp.locale)

  const getData = async () => {
    return await api.GetAttributeArchitecture()
  }

  const initialData = await withAuthProtection(getData)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">
          {translations.attributeStudio.pageTitle}
        </h1>
        <p className="text-muted-foreground">
          {translations.attributeStudio.pageDescription}
        </p>
      </div>
      <AttributeStudio initialData={initialData} />
    </div>
  )
}
