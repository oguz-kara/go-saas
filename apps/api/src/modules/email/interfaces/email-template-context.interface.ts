export interface LeadData {
  firstName: string
  lastName: string
  email: string
  phone?: string | null
  company?: string | null
  jobTitle?: string | null
  website?: string | null
  status: string
  source: string
  priority: string
  productInterest?: string[] | null
  budget?: string | null
  timeline?: string | null
  companySize?: number | null
  isDecisionMaker?: boolean | null
  painPoints?: string | null
  currentSolution?: string | null
}

export interface AssignedToData {
  name?: string | null
  email?: string | null
}

export interface ChannelData {
  name: string
}

export interface CustomerEmailContext {
  lead: LeadData
  channel: ChannelData
}

export interface MarketingEmailContext {
  lead: LeadData
  channel: ChannelData
  assignedTo?: AssignedToData | null
}

export interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  text?: string
}
