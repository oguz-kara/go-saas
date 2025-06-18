// src/lib/auth/with-auth-protection.ts
import 'server-only'
import { redirect } from 'next/navigation'
import { AuthError } from '@gocrm/lib/errors/errors/auth-error'

export async function withAuthProtection<T>(
  dataFetcher: () => Promise<T>,
): Promise<T> {
  try {
    return await dataFetcher()
  } catch (error) {
    console.log('errorFromWithAuthProtection', error)
    if (error instanceof AuthError) redirect('/session-expired')

    throw error
  }
}
