export const deleteCompanyMutation = `
        mutation DeleteCompany($id: ID!) {
          deleteCompany(id: $id) { id deletedAt }
        }
      `
