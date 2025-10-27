export const loginMutationGql = `
      mutation LoginUser($input: LoginUserInput!) {
        loginUser(loginUserInput: $input) {
          token
          user { id email }
        }
      }
    `
