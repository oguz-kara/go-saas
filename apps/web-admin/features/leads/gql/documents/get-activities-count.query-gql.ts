import { gql } from '@apollo/client'

export const GetActivitiesCountQuery = gql`
  query GetActivitiesCount(
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
    activitiesCount(
      leadId: $leadId
      userId: $userId
      type: $type
      startDate: $startDate
      endDate: $endDate
      isCompleted: $isCompleted
      searchQuery: $searchQuery
      skip: $skip
      take: $take
    )
  }
`


