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
      name
      email
      website
      taxId
      description
      phoneNumber
      socialProfiles
      address
      addressAttributeCodes
      attributes {
        id
        value
        type {
          id
        }
      }
      createdAt
      deletedAt
      updatedAt
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
