import { gql } from '@apollo/client'

export const GetUsersQuery = gql`
  query Users($skip: Int, $take: Int) {
    getUsers(skip: $skip, take: $take) {
      items {
        id
        name
        email
      }
      totalCount
    }
  }
`
