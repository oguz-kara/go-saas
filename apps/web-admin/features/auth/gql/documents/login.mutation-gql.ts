import { gql } from "@apollo/client";

export const loginMutationGql = gql`
  mutation loginUser($input: LoginUserInput!) {
    loginUser(loginUserInput: $input) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;
