import { gql } from '@apollo/client'

export const DeleteActivityMutation = gql`
  mutation DeleteActivity($id: ID!) {
    deleteActivity(id: $id) {
      id
    }
  }
`


