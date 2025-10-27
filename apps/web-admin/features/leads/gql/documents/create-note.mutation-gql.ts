import { gql } from '@apollo/client'

export const CreateNoteMutation = gql`
  mutation CreateNote($leadId: ID!, $content: String!) {
    createNote(leadId: $leadId, content: $content) {
      id
      content
      leadId
      userId
      createdAt
      updatedAt
    }
  }
`


