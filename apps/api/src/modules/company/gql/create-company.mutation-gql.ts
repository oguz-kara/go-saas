export const createCompanyMutation = `
        mutation CreateCompany($input: CreateCompanyInput!) {
          createCompany(createCompanyInput: $input) { id name website }
        }
      `
