import { gql } from "@apollo/client";

export const getCompaniesWithNotesQuery = gql`
  query companies {
    companies {
      items {
        name
        notes {
          items {
            content
          }
          totalCount
        }
      }
    }
  }
`;
