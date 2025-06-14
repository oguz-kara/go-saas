// src/features/attributes/gql/documents/attribute-value.mutations.ts
import { gql } from '@apollo/client'

export const CREATE_ATTRIBUTE_MUTATION = gql`
  mutation createAttribute(
    $createAttributeInput: CreateAttributeInput!
  ) {
    createAttribute(createAttributeInput: $createAttributeInput) {
      id
      value
      attributeTypeId
    }
  }
`

export const UPDATE_ATTRIBUTE_MUTATION = gql`
  mutation updateAttribute(
    $id: ID!
    $updateAttributeInput: UpdateAttributeInput!
  ) {
    updateAttribute(
      id: $id
      updateAttributeInput: $updateAttributeInput
    ) {
      id
      value
    }
  }
`

export const DELETE_ATTRIBUTE_MUTATION = gql`
  mutation deleteAttribute($id: ID!) {
    deleteAttribute(id: $id)
  }
`
