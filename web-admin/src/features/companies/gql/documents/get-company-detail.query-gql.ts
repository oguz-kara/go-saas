import { gql } from '@apollo/client'

export const GET_COMPANY_DETAIL_QUERY = gql`
  query GetCompanyDetail($id: ID!, $notesSkip: Int, $notesTake: Int) {
    company(id: $id) {
      id
      name
      website
      industry
      linkedinUrl
      address
      description
      channelToken
      createdAt
      updatedAt
      notes(skip: $notesSkip, take: $notesTake) {
        items {
          id
          content
          type
          userId
          createdAt
          updatedAt
        }
        totalCount
      }
    }
  }
`
