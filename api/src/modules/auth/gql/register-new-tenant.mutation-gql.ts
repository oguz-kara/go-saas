export const registerNewTenantMutationGql = `
        mutation RegisterNewTenant($input: RegisterNewTenantInput!) {
          registerNewTenant(registerNewTenantInput: $input) {
            token
            user {
              id
              email
              name
            }
          }
        }
      `
