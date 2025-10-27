export const addNoteMutation = `
      mutation AddNote($companyId: ID!, $input: AddCompanyNoteInput!) {
        addNoteToCompany(companyId: $companyId, addCompanyNoteInput: $input) {
          id
          content
          companyId
        }
      }
    `
