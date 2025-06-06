export const registerUserMutationGql = `
        mutation RegisterUser($input: RegisterUserInput!, $token: String!) {
          registerUser(registerUserInput: $input, channelToken: $token) {
            token
            user { email }
          }
        }
      `
