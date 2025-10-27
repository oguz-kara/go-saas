import { gql } from '@apollo/client'

export const UpdateLeadMutation = gql`
  mutation UpdateLead($input: UpdateLeadInput!) {
    updateLead(updateLeadInput: $input) {
      id
      firstName
      lastName
      email
      status
      priority
    }
  }
`
