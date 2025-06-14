import { gql } from '@apollo/client'

export const GetCompaniesWithAttributesQuery = gql`
  query getCompaniesWithAttributes($skip: Int, $take: Int) {
    companies(skip: $skip, take: $take) {
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
