import { gql } from '@apollo/client'

export const GetCompaniesQuery = gql`
  query getCompanies($skip: Int, $take: Int) {
    companies(skip: $skip, take: $take) {
      items {
        id
        name
        website
        industry
        description
        createdAt
      }
      totalCount
    }
  }
`
