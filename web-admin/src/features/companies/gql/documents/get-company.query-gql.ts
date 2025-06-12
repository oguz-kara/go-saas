import { gql } from "@apollo/client";

export const getCompanyQuery = gql`
  query getCompany($id: ID!) {
    company(id: $id) {
      id
      name
      website
      channelToken
    }
  }
`;
