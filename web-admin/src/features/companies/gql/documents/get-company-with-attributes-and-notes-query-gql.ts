import { gql } from '@apollo/client'

export const GET_COMPANY_WITH_ATTRIBUTES_AND_NOTES_QUERY = gql`
  query getCompanyWithAttributesAndNotes(
    $id: ID!
    $searchQuery: String
    $skip: Int
    $take: Int
  ) {
    company(id: $id) {
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
    companyNotes(
      companyId: $id
      searchQuery: $searchQuery
      skip: $skip
      take: $take
    ) {
      items {
        id
        type
        userId
        companyId
        content
        createdAt
      }
      totalCount
    }
  }
`
