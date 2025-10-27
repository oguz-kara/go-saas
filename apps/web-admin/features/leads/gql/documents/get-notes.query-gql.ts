import { gql } from '@apollo/client'

export const GetNotesQuery = gql`
  query GetNotes($leadId: ID, $userId: ID, $searchQuery: String, $skip: Float, $take: Float) {
    notes(leadId: $leadId, userId: $userId, searchQuery: $searchQuery, skip: $skip, take: $take) {
      items {
        id
        content
        leadId
        userId
        createdAt
        updatedAt
      }
      totalCount
    }
  }
`


