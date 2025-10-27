import { gql } from '@apollo/client'

export const CREATE_API_KEY_MUTATION = gql`
  mutation CreateApiKey($input: CreateApiKeyInput!) {
    createApiKey(input: $input) {
      id
      name
      prefix
      plainKey
      isActive
      createdAt
      createdBy {
        id
        email
        name
      }
    }
  }
`

