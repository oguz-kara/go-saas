import { gql } from '@apollo/client'

export const GET_ATTRIBUTE_ARCHITECTURE_QUERY = gql`
  query GetAttributeArchitecture(
    $attributeTypesArgs: ListQueryArgs
    $attributeTypesIncludeSystemDefined: Boolean
    $attributeGroupsSearchQuery: String
    $attributeGroupsTake: Int
    $attributeGroupsSkip: Int
  ) {
    attributeTypes(
      args: $attributeTypesArgs
      includeSystemDefined: $attributeTypesIncludeSystemDefined
    ) {
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
        availableFor
      }
      totalCount
    }
    attributeGroups(
      searchQuery: $attributeGroupsSearchQuery
      take: $attributeGroupsTake
      skip: $attributeGroupsSkip
    ) {
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
