import { gql } from '@apollo/client'

export const GetActivitiesQuery = gql`
  query GetActivities(
    $leadId: ID
    $userId: ID
    $type: String
    $startDate: String
    $endDate: String
    $isCompleted: Boolean
    $searchQuery: String
    $skip: Int
    $take: Int
  ) {
    activities(
      leadId: $leadId
      userId: $userId
      type: $type
      startDate: $startDate
      endDate: $endDate
      isCompleted: $isCompleted
      searchQuery: $searchQuery
      skip: $skip
      take: $take
    ) {
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


