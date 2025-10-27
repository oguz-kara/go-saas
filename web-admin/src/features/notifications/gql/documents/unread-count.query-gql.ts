import { gql } from '@apollo/client'

export const UnreadCountQuery = gql`
  query UnreadCount {
    unreadCount
  }
`


