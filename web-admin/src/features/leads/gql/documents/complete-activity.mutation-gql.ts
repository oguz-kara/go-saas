import { gql } from '@apollo/client'

export const CompleteActivityMutation = gql`
  mutation CompleteActivity($id: ID!) {
    completeActivity(id: $id) {
      id
      completedAt
    }
  }
`


