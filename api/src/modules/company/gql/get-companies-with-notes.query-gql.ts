export const getCompaniesWithNotesQuery = `
        query {
          companies {
            items {
              name
              notes {
                items { content }
                totalCount
              }
            }
          }
        }
      `
