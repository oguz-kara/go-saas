import { gql } from '@apollo/client'

export const GET_ATTRIBUTE_ARCHITECTURE_QUERY = gql`
  query getAttributeGroups($searchQuery: String, $skip: Int, $take: Int) {
    attributeGroups(searchQuery: $searchQuery, skip: $skip, take: $take) {
      items {
        id
        isSystemDefined
        name
        code
        order
      }
      totalCount
    }
  }
`
