import { gql } from '@apollo/client'

export const createCompanyMutation = gql`
  mutation createCompany($input: CreateCompanyInput!) {
    createCompany(createCompanyInput: $input) {
      id
      name
      industry
      website
      createdAt
    }
  }
`
