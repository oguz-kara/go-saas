import {
  ApolloClient,
  ApolloLink,
  from,
  InMemoryCache,
  HttpLink,
} from '@apollo/client'
import cookies from 'js-cookie'

const httpLink = new HttpLink({
  uri:
    process.env.NEXT_PUBLIC_APP_GRAPHQL_API_URL ||
    'http://localhost:3001/api/graphql',
})

const channelMiddleware = new ApolloLink((operation, forward) => {
  const channelToken = cookies.get('channel_token')
  const { headers: existingHeaders } = operation.getContext()

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      ...existingHeaders,
      'x-channel-token': channelToken || '',
    },
  }))

  return forward(operation)
})

const link = from([channelMiddleware, httpLink])

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  connectToDevTools: process.env.NODE_ENV === 'development',
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache',
    },
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
})
