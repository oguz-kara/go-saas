import { gql } from "@apollo/client";

export const updateNoteMutation = gql`
  mutation updateNote($noteId: ID!, $input: UpdateCompanyNoteInput!) {
    updateCompanyNote(noteId: $noteId, updateCompanyNoteInput: $input) {
      id
      content
    }
  }
`;
