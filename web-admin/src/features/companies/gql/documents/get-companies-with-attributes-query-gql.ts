import { gql } from '@apollo/client'

export const GetCompaniesWithAttributesQuery = gql`
  query getCompaniesWithAttributes(
    $skip: Int
    $take: Int
    $filters: [AttributeFilterInput!]
  ) {
    companies(skip: $skip, take: $take, filters: $filters) {
      items {
        id
        address
        channelToken
        name
        industry
        website
        createdAt
        updatedAt
        deletedAt
        linkedinUrl
        attributes {
          id
          attributeTypeId
          name
          value
        }
      }
      totalCount
    }
  }
`
