import { gql } from '@apollo/client'

export const GET_ATTRIBUTE_TYPES_QUERY = gql`
  query getAttributeTypes($args: ListQueryArgs) {
    attributeTypes(args: $args) {
      items {
        id
        name
        channelToken
        createdAt
      }
      totalCount
    }
  }
`
