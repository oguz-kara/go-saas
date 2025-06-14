import { toast } from 'sonner'

export function handleGraphQLError(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any,
  exceptionMessages: Record<string, string> | undefined,
  fallbackMessage = 'Bilinmeyen bir hata oluştu.',
) {
  if (!exceptionMessages) {
    toast.error(fallbackMessage)
    return
  }

  const code = error?.cause?.code
  if (code && exceptionMessages[code]) {
    toast.error(exceptionMessages[code])
  } else {
    toast.error(error.message || fallbackMessage)
  }
}
