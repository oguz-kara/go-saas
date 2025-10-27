// src/lib/auth/with-auth-protection.ts
import 'server-only'
import { redirect } from 'next/navigation'
import { AuthError } from '@gocrm/lib/errors/errors/auth-error'
import { routes } from '@gocrm/lib/routes'

export async function withAuthProtection<T>(
  dataFetcher: () => Promise<T>,
): Promise<T> {
  try {
    return await dataFetcher()
  } catch (error) {
    console.log('errorFromWithAuthProtection', error)
    if (error instanceof AuthError) redirect(routes.sessionExpired())

    throw error
  }
}
