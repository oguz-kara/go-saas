import { gql } from '@apollo/client'

export const CreateLeadMutation = gql`
  mutation CreateLead($input: CreateLeadInput!) {
    createLead(createLeadInput: $input) {
      id
      firstName
      lastName
      email
    }
  }
`
