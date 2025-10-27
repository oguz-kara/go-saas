import { gql } from '@apollo/client'

export const GetActivityQuery = gql`
  query GetActivity($id: ID!) {
    activity(id: $id) {
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


