import { gql } from '@apollo/client'

export const UpdateNoteMutation = gql`
  mutation UpdateLeadNote($id: ID!, $content: String) {
    updateNote(id: $id, content: $content) {
      id
      content
      updatedAt
    }
  }
`


