// src/features/attributes/gql/documents/get-attribute-values.query.ts
import { gql } from '@apollo/client'

export const GET_ATTRIBUTE_QUERY = gql`
  query getAttributeValues(
    $attributeTypeId: ID!
    $parentId: ID
    $skip: Int
    $take: Int
    $searchQuery: String
  ) {
    attributeValues(
      attributeTypeId: $attributeTypeId
      parentId: $parentId
      skip: $skip
      take: $take
      searchQuery: $searchQuery
    ) {
      items {
        id
        value
        code
        attributeTypeId
      }
      totalCount
    }
  }
`

export const GET_ATTRIBUTE_VALUES_BY_CODE_QUERY = gql`
  query getAttributeValuesByCode($args: GetAttributeValuesByCodeArgs!) {
    attributeValuesByCode(args: $args) {
      items {
        id
        value
        code
        attributeTypeId
      }
      totalCount
    }
  }
`
