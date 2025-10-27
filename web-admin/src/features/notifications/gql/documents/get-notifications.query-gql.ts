import { gql } from '@apollo/client'

export const GetNotificationsQuery = gql`
  query GetNotifications($skip: Int, $take: Int, $onlyUnread: Boolean) {
    notifications(skip: $skip, take: $take, onlyUnread: $onlyUnread) {
      items {
        id
        createdAt
        type
        priority
        title
        message
        isRead
        leadId
        metadata
      }
      totalCount
    }
  }
`


