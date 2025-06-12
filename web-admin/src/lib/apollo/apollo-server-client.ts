// src/lib/apollo/apollo-server-client.ts
import 'server-only'
import { ApolloLink, HttpLink } from '@apollo/client'

import {
  registerApolloClient,
  ApolloClient,
  InMemoryCache,
} from '@apollo/client-integration-nextjs'
import { i18n } from '@gocrm/lib/i18n'

export const { getClient } = registerApolloClient(async () => {
  const httpLink = new HttpLink({
    uri:
      process.env.NEXT_PUBLIC_ADMIN_GRAPHQL_API_URL ||
      'http://localhost:3001/api/graphql',
  })

  const middlewareLink = new ApolloLink((operation, forward) => {
    const existingHeaders = operation.getContext().headers || {}

    operation.setContext({
      headers: {
        ...existingHeaders,
        'Accept-Language':
          existingHeaders['Accept-Language'] || i18n.defaultLocale,
      },
    })
    return forward(operation)
  })

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: middlewareLink.concat(httpLink),
  })
})
