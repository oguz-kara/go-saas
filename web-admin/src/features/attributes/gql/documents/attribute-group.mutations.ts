// src/features/attributes/gql/documents/attribute-group.mutations.ts
import { gql } from '@apollo/client'

export const CREATE_ATTRIBUTE_GROUP_MUTATION = gql`
  mutation CreateAttributeGroup($input: CreateAttributeGroupInput!) {
    createAttributeGroup(createAttributeGroupInput: $input) {
      id
      name
    }
  }
`

export const UPDATE_ATTRIBUTE_GROUP_MUTATION = gql`
  mutation UpdateAttributeGroup($id: ID!, $input: UpdateAttributeGroupInput!) {
    updateAttributeGroup(id: $id, updateAttributeGroupInput: $input) {
      id
      name
    }
  }
`

export const DELETE_ATTRIBUTE_GROUP_MUTATION = gql`
  mutation DeleteAttributeGroup($id: ID!) {
    deleteAttributeGroup(id: $id)
  }
`
