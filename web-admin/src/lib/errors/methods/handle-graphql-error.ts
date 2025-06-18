import { toast } from 'sonner'

function interpolate(template: string, params: Record<string, string>): string {
  let result = template
  for (const key in params) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), params[key])
  }
  return result
}

export function handleGraphQLError(
  error: any,
  translations:
    | {
        exceptionMessages?: Record<string, string>
        entityNames?: Record<string, string>
        fieldNames?: Record<string, string>
        operationNames?: Record<string, string>
      }
    | undefined,
  fallbackMessage = 'Bilinmeyen bir hata oluştu.',
) {
  console.error('GraphQL Error:', error)

  const gqlError = error?.graphQLErrors?.[0]

  if (!gqlError || !translations?.exceptionMessages) {
    toast.error(error.message || fallbackMessage)
    return
  }

  const { exceptionMessages, entityNames, fieldNames, operationNames } =
    translations

  const code = gqlError.extensions?.code as string
  const extensions = gqlError.extensions as Record<string, unknown>

  if (code && exceptionMessages[code]) {
    const messageTemplate = exceptionMessages[code]
    const params: Record<string, string> = {}

    if (extensions?.entityName) {
      const entityName = extensions.entityName as string
      params.entityName = entityNames?.[entityName] || entityName
    }

    if (extensions?.fields) {
      const fields = (extensions.fields as string[])
        .filter((f) => f !== 'channelToken')
        .map((f) => fieldNames?.[f] || f)
        .join(', ')
      params.fields = fields
    }

    if (extensions?.parentEntity) {
      const parentEntity = extensions.parentEntity as string
      params.parentEntity = entityNames?.[parentEntity] || parentEntity
    }

    if (extensions?.childEntity) {
      const childEntity = extensions.childEntity as string
      params.childEntity = entityNames?.[childEntity] || childEntity
    }

    if (extensions?.operation) {
      const operation = extensions.operation as string
      params.operation = operationNames?.[operation] || operation
    }

    toast.error(interpolate(messageTemplate, params))
  } else {
    toast.error(gqlError.message || error.message || fallbackMessage)
  }
}
