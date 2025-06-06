export const deleteNoteMutation = `
        mutation DeleteNote($noteId: ID!) {
          deleteCompanyNote(noteId: $noteId) { id }
        }
      `
