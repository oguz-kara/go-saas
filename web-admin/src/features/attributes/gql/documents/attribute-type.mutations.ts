// src/features/attributes/gql/documents/attribute-type.mutations.ts
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

// --- YENİ EKLENEN MUTATION'LAR ---

export const UPDATE_ATTRIBUTE_TYPE_MUTATION = gql`
  mutation updateAttributeType(
    $id: ID!
    $updateAttributeTypeInput: UpdateAttributeTypeInput!
  ) {
    updateAttributeType(
      id: $id
      updateAttributeTypeInput: $updateAttributeTypeInput
    ) {
      id
      name
      updatedAt
    }
  }
`

export const DELETE_ATTRIBUTE_TYPE_MUTATION = gql`
  mutation deleteAttributeType($id: ID!) {
    deleteAttributeType(id: $id)
  }
`
