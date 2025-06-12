import { gql } from "@apollo/client";

export const registerUserMutationGql = gql`
  mutation registerUser($input: RegisterUserInput!, $token: String!) {
    registerUser(registerUserInput: $input, channelToken: $token) {
      token
      user {
        email
      }
    }
  }
`;
