import { gql } from '@apollo/client'

export const updateUserProfileMutationGql = gql`
  mutation updateUserProfile($input: UpdateUserProfileInput!) {
    updateUserProfile(input: $input) {
      id
      email
      name
      updatedAt
    }
  }
`

