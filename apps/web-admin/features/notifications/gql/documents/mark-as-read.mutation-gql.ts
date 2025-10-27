import { gql } from '@apollo/client'

export const MarkAsReadMutation = gql`
  mutation MarkAsRead($id: ID!) {
    markAsRead(notificationId: $id) {
      id
      isRead
      readAt
    }
  }
`


