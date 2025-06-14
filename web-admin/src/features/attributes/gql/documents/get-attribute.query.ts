// src/features/attributes/gql/documents/get-attribute-values.query.ts
import { gql } from '@apollo/client'

export const GET_ATTRIBUTE_QUERY = gql`
  query getAttributeValues(
    $attributeTypeId: ID!
    $skip: Int
    $take: Int
    $searchQuery: String
  ) {
    attributeValues(
      attributeTypeId: $attributeTypeId
      skip: $skip
      take: $take
      searchQuery: $searchQuery
    ) {
      items {
        id
        value
        attributeTypeId
      }
      totalCount
    }
  }
`
