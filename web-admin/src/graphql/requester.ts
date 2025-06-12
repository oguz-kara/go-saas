// src/graphql/requester.ts
import 'server-only'
import { getSdk, Requester } from '@gocrm/graphql/generated/sdk'
import { DocumentNode } from 'graphql'
import { i18n } from '@gocrm/lib/i18n'
import { getToken } from 'next-auth/jwt'
import { headers as getHeaders } from 'next/headers'
import { NextRequest } from 'next/server'
import { OperationVariables } from '@apollo/client'
import { AuthError } from '@gocrm/lib/errors/auth-error'
import { GraphQLError } from '@gocrm/types/graphql-error.type'

const requester = async <TData, TVariables extends OperationVariables>(
  doc: DocumentNode,
  vars?: TVariables,
  locale?: string,
): Promise<TData> => {
  try {
    const nextHeaders = await getHeaders()

    const req = new NextRequest('http://dummy', { headers: nextHeaders })

    const tokenData = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    })

    const accessToken = tokenData?.accessToken as string | undefined

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept-Language': locale || i18n.defaultLocale,
    }

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`
    }

    const clientToken = process.env.NEXT_PUBLIC_CLIENT_TOKEN
    if (clientToken) {
      headers['x-client-token'] = clientToken
    }

    const apiUrl =
      process.env.NEXT_PUBLIC_ADMIN_GRAPHQL_API_URL ||
      'http://localhost:3000/admin-api'

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      cache: 'no-store',
      body: JSON.stringify({
        query: doc.loc?.source.body,
        variables: vars,
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error(
        `API request failed with status: ${response.status}`,
        errorBody,
      )
      throw new Error(`API request failed with status: ${response.status}`)
    }

    const result = await response.json()

    if (result.errors) {
      const isAccessDenied = result.errors.some(
        (err: GraphQLError) =>
          err.code === 'ACCESS_DENIED_EXCEPTION' ||
          err.code === 'UNAUTHENTICATED',
      )
      if (isAccessDenied) {
        throw new AuthError('Access denied by API.')
      }

      throw new Error(
        result.errors.map((e: { message: string }) => e.message).join('\n'),
      )
    }

    if (!result.data) {
      throw new Error('No data returned from GraphQL query.')
    }

    return result.data as TData
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Requester Error:', error.message)
    } else {
      console.error('Requester Error:', String(error))
    }
    throw error
  }
}

// sdk fabrikanızda değişiklik gerekmiyor, aynı kalabilir.
export const sdk = (locale?: string) => {
  const sdkRequester: Requester = (doc, vars) => {
    return requester(doc, vars as OperationVariables, locale)
  }
  return getSdk(sdkRequester)
}
