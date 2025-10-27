import { gql } from "@apollo/client";

export const getChannelsQuery = gql`
  query getChannels($skip: Int, $take: Int) {
    channels(skip: $skip, take: $take) {
      items {
        id
        name
        token
      }
      totalCount
    }
  }
`;
