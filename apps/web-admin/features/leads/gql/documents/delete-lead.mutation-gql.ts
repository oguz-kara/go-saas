import { gql } from '@apollo/client'

export const DeleteLeadMutation = gql`
  mutation DeleteLead($id: ID!) {
    deleteLead(id: $id) {
      id
    }
  }
`
