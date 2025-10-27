import { gql } from '@apollo/client'

export const UpdateActivityMutation = gql`
  mutation UpdateActivity($input: UpdateActivityInput!) {
    updateActivity(input: $input) {
      id
      createdAt
      type
      subject
      description
      scheduledAt
      completedAt
      leadId
      userId
    }
  }
`


