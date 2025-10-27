export const createChannelMutation = `
      mutation CreateChannel($input: CreateChannelInput!) {
        createChannel(createChannelInput: $input) {
          id
          name
          token
          description
        }
      }
    `
