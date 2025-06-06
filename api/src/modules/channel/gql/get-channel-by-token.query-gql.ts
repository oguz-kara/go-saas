export const getChannelByTokenQuery = `
      query GetChannelByToken($token: String!) {
        channelByToken(token: $token) {
          id
          name
          token
        }
      }
    `
