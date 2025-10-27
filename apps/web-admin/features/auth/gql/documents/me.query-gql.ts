import { gql } from "@apollo/client";

export const meQueryGql = gql`
  query me {
    me {
      id
      email
      name
    }
  }
`;
