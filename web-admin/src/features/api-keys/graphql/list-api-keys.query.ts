import { gql } from '@apollo/client'

export const LIST_API_KEYS_QUERY = gql`
  query ListApiKeys {
    listApiKeys {
      id
      name
      prefix
      isActive
      usageCount
      lastUsedAt
      lastUsedIp
      createdAt
      updatedAt
      createdBy {
        id
        email
        name
      }
    }
  }
`

