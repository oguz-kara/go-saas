import { gql } from '@apollo/client'

export const GetCompaniesWithAttributesQuery = gql`
  query getCompaniesWithAttributes(
    $skip: Int
    $take: Int
    $filters: [AttributeFilterInput!]
    $address: String
    $searchQuery: String
  ) {
    companies(
      skip: $skip
      take: $take
      filters: $filters
      address: $address
      searchQuery: $searchQuery
    ) {
      items {
        id
        address
        channelToken
        name
        website
        createdAt
        updatedAt
        deletedAt
        linkedinUrl
        attributes {
          id
          value
        }
      }
      totalCount
    }
  }
`
