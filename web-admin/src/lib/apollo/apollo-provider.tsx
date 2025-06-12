// src/lib/apollo/apollo-provider.tsx
'use client'

import { ApolloLink, HttpLink } from '@apollo/client'
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from '@apollo/client-integration-nextjs'
import { signOut } from 'next-auth/react'
import { onError } from '@apollo/client/link/error'
import { GraphQLError } from '@gocrm/types/graphql-error.type'

// makeClient fonksiyonu artık herhangi bir React hook'una bağlı değil,
// bu yüzden component'in dışında tanımlanabilir. Bu, her render'da yeniden oluşmasını engeller.
function makeClient() {
  const httpLink = new HttpLink({
    // Tüm client-side istekler Next.js proxy'sine gider.
    uri: '/api/graphql',
  })

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (
      networkError &&
      'statusCode' in networkError &&
      networkError.statusCode === 401
    ) {
      console.log('Client-side: Network error 401 detected, signing out...')
      signOut({ callbackUrl: '/login' })
    }

    const errs = graphQLErrors as GraphQLError[]

    const isAccessDenied = errs?.some(
      (err) =>
        err.code === 'ACCESS_DENIED_EXCEPTION' ||
        err.code === 'UNAUTHENTICATED',
    )
    if (isAccessDenied) {
      console.log(
        'Client-side: Auth error detected, redirecting via signOut...',
      )

      signOut({ callbackUrl: '/session-expired' })
    }
  })

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([errorLink, httpLink]),
  })
}

export function ApolloProvider({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  )
}
