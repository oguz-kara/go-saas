import { gql } from '@apollo/client'

export const getCompanyWithAttributesQuery = gql`
  query getCompanyWithAttributes($id: ID!) {
    company(id: $id) {
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
  }
`
