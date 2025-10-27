import { gql } from '@apollo/client'

export const GetNotesCountQuery = gql`
  query GetNotesCount($leadId: ID, $userId: ID, $searchQuery: String) {
    notesCount(leadId: $leadId, userId: $userId, searchQuery: $searchQuery)
  }
`


