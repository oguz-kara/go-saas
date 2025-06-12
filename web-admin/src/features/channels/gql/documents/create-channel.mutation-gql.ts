import { gql } from "@apollo/client";

export const createChannelMutation = gql`
  mutation createChannel($input: CreateChannelInput!) {
    createChannel(createChannelInput: $input) {
      id
      name
      token
      description
    }
  }
`;
