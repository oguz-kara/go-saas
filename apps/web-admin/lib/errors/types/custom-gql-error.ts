export interface CustomGraphQLError {
  cause?: {
    code?: string
  }
  message?: string
}
