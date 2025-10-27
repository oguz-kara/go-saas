// src/features/attributes/gql/documents/attribute-value.mutations.ts
import { gql } from '@apollo/client'

export const CREATE_ATTRIBUTE_VALUE_MUTATION = gql`
  mutation createAttributeValue(
    $createAttributeValueInput: CreateAttributeInput!
  ) {
    createAttributeValue(createAttributeValueInput: $createAttributeValueInput) {
      id
      value
      attributeTypeId
    }
  }
`

export const UPDATE_ATTRIBUTE_VALUE_MUTATION = gql`
  mutation updateAttributeValue(
    $id: ID!
    $updateAttributeValueInput: UpdateAttributeInput!
  ) {
    updateAttributeValue(
      id: $id
      updateAttributeValueInput: $updateAttributeValueInput
    ) {
      id
      value
    }
  }
`

export const DELETE_ATTRIBUTE_VALUE_MUTATION = gql`
  mutation deleteAttributeValue($id: ID!) {
    deleteAttributeValue(id: $id)
  }
`
