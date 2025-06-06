export const getChannelsQuery = `
      query GetChannels($skip: Int, $take: Int) {
        channels(skip: $skip, take: $take) {
          items {
            id
            name
            token
          }
          totalCount
        }
      }
    `
