import { gql } from '@apollo/client'

export const GET_COMPANY_NOTES_QUERY = gql`
  query getCompanyNotes(
    $companyId: ID!
    $searchQuery: String
    $skip: Int
    $take: Int
  ) {
    companyNotes(
      companyId: $companyId
      searchQuery: $searchQuery
      skip: $skip
      take: $take
    ) {
      items {
        id
        type
        companyId
        content
        createdAt
      }
      totalCount
    }
  }
`
