// src/app/(dashboard)/settings/attributes/page.tsx
import { getTranslations } from '@gocrm/lib/i18n/get-translations'
import { AttributeStudio } from '@gocrm/features/attributes/components/attribute-studio'

export default async function AttributeStudioPage() {
  const translations = await getTranslations()

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
      <AttributeStudio />
    </div>
  )
}
