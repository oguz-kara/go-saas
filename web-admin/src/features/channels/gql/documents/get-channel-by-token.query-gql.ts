import { gql } from "@apollo/client";

export const getChannelByTokenQuery = gql`
  query getChannelByToken($token: String!) {
    channelByToken(token: $token) {
      id
      name
      token
    }
  }
`;
