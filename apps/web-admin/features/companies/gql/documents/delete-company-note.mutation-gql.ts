import { gql } from "@apollo/client";

export const deleteNoteMutation = gql`
  mutation deleteNote($noteId: ID!) {
    deleteCompanyNote(noteId: $noteId) {
      id
    }
  }
`;
