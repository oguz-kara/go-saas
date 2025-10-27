export const updateMutation = `
        mutation UpdateCompany($id: ID!, $input: UpdateCompanyInput!) {
          updateCompany(id: $id, updateCompanyInput: $input) { name }
        }
      `
