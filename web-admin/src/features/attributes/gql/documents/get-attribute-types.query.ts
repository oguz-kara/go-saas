import { gql } from '@apollo/client'

export const GET_ATTRIBUTE_TYPES_QUERY = gql`
  query getAttributeTypes(
    $args: ListQueryArgs
    $includeSystemDefined: Boolean
  ) {
    attributeTypes(args: $args, includeSystemDefined: $includeSystemDefined) {
      items {
        id
        name
        code
        channelToken
        kind
        dataType
        createdAt
        isSystemDefined
        groupId
      }
      totalCount
    }
  }
`
