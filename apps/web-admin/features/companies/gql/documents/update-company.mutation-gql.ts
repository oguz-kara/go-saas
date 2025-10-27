import { gql } from '@apollo/client'

export const updateMutation = gql`
  mutation updateCompany($id: ID!, $input: UpdateCompanyInput!) {
    updateCompany(id: $id, updateCompanyInput: $input) {
      id
      name
      website
      updatedAt
    }
  }
`
