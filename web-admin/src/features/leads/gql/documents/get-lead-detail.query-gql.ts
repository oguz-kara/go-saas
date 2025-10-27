import { gql } from '@apollo/client'

export const GetLeadDetailQuery = gql`
  query GetLeadDetail($id: ID!) {
    lead(id: $id) {
      id
      createdAt
      updatedAt
      firstName
      lastName
      email
      phone
      company
      jobTitle
      website
      status
      source
      priority
      productInterest
      budget
      timeline
      companySize
      isDecisionMaker
      painPoints
      currentSolution
      lastContactedAt
      convertedAt
      lostReason
      assignedTo { id name email }
    }
  }
`


