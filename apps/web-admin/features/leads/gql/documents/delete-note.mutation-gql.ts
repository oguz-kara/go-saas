import { gql } from '@apollo/client'

export const DeleteNoteMutation = gql`
  mutation DeleteLeadNote($id: ID!) {
    deleteNote(id: $id) {
      id
    }
  }
`


