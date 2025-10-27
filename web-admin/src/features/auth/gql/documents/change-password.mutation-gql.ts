import { gql } from '@apollo/client'

export const changePasswordMutationGql = gql`
  mutation changePassword($input: ChangePasswordInput!) {
    changePassword(input: $input) {
      success
      message
    }
  }
`

