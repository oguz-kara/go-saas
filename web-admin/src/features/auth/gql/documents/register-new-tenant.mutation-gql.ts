import { gql } from "@apollo/client";

export const registerNewTenantMutationGql = gql`
  mutation registerNewTenant($input: RegisterNewTenantInput!) {
    registerNewTenant(registerNewTenantInput: $input) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;
