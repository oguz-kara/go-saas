import { ApiKeyList } from '@gocrm/features/api-keys/components/api-key-list'
import { GenerateApiKeyDialog } from '@gocrm/features/api-keys/components/generate-api-key-dialog'
import { getTranslations } from '@gocrm/lib/i18n'
import { PageHeader } from '@gocrm/components/common/page-header'

export default async function ApiKeysPage() {
  const translations = await getTranslations()
  const t = translations?.apiKeys

  return (
    <div className="space-y-6">
      <PageHeader
        title={t?.title || 'API Keys'}
        description={
          t?.description ||
          'Manage API keys for external integrations, marketing websites, and third-party applications.'
        }
        titleSize="sm"
      >
        <GenerateApiKeyDialog />
      </PageHeader>

      <ApiKeyList />
    </div>
  )
}
