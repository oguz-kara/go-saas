import { gql } from '@apollo/client'

export const REVOKE_API_KEY_MUTATION = gql`
  mutation RevokeApiKey($id: ID!) {
    revokeApiKey(id: $id) {
      id
      name
      isActive
    }
  }
`

