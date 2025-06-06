export const updateNoteMutation = `
        mutation UpdateNote($noteId: ID!, $input: UpdateCompanyNoteInput!) {
          updateCompanyNote(noteId: $noteId, updateCompanyNoteInput: $input) {
            id
            content
          }
        }
      `
