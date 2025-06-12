import { gql } from "@apollo/client";

export const addNoteMutation = gql`
  mutation addNote($companyId: ID!, $input: AddCompanyNoteInput!) {
    addNoteToCompany(companyId: $companyId, addCompanyNoteInput: $input) {
      id
      content
      companyId
    }
  }
`;
