// src/features/attributes/gql/documents/create-attribute-type.mutation.ts
import { gql } from '@apollo/client'

export const CREATE_ATTRIBUTE_TYPE_MUTATION = gql`
  mutation createAttributeType(
    $createAttributeTypeInput: CreateAttributeTypeInput!
  ) {
    createAttributeType(createAttributeTypeInput: $createAttributeTypeInput) {
      id
      name
      channelToken
      createdAt
    }
  }
`
