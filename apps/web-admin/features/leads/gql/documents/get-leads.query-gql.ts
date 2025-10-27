import { gql } from '@apollo/client'

export const GetLeadsQuery = gql`
  query GetLeads(
    $skip: Int
    $take: Int
    $searchQuery: String
    $status: [LeadStatus!]
    $source: [LeadSource!]
    $priority: [Priority!]
    $assignedToId: ID
    $startDate: String
    $endDate: String
    $sortBy: String
    $sortOrder: String
  ) {
    leads(
      skip: $skip
      take: $take
      searchQuery: $searchQuery
      status: $status
      source: $source
      priority: $priority
      assignedToId: $assignedToId
      startDate: $startDate
      endDate: $endDate
      sortBy: $sortBy
      sortOrder: $sortOrder
    ) {
      items {
        id
        createdAt
        firstName
        lastName
        email
        company
        status
        source
        productInterest
        priority
        assignedTo {
          id
          name
          email
        }
      }
      totalCount
    }
  }
`
