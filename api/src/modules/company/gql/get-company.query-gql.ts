export const getCompanyQuery = `
      query GetCompany($id: ID!) {
        company(id: $id) { id name website channelToken }
      }
    `
