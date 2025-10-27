import { gql } from '@apollo/client'

export const CreateActivityMutation = gql`
  mutation CreateActivity($input: CreateActivityInput!) {
    createActivity(input: $input) {
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


