import { gql } from "@apollo/client";

export const logoutMutationGql = gql`
  mutation logoutUser {
    logoutUser {
      success
    }
  }
`;
