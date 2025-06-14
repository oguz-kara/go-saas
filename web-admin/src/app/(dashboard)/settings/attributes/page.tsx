// src/app/(dashboard)/settings/attributes/page.tsx
import { sdk } from '@gocrm/graphql/requester'
import { getTranslations } from '@gocrm/lib/i18n/get-translations'
import { withAuthProtection } from '@gocrm/lib/auth/with-auth-protection'
import { AttributeStudio } from '@gocrm/features/attributes/components/attribute-studio'

export default async function AttributeStudioPage() {
  const translations = await getTranslations()
  const api = sdk()

  const getData = async () => {
    const { attributeTypes } = await api.getAttributeTypes({
      args: { take: 100 },
    })
    return { initialAttributeTypes: attributeTypes.items }
  }

  const { initialAttributeTypes } = await withAuthProtection(getData)

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
      <AttributeStudio initialAttributeTypes={initialAttributeTypes} />
    </div>
  )
}
