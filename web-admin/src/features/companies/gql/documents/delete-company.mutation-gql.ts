import { gql } from "@apollo/client";

export const deleteCompanyMutation = gql`
  mutation deleteCompany($id: ID!) {
    deleteCompany(id: $id) {
      id
      deletedAt
    }
  }
`;
