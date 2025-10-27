import { registerEnumType } from '@nestjs/graphql'

export enum LeadStatusEnum {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED',
  PROPOSAL_SENT = 'PROPOSAL_SENT',
  NEGOTIATION = 'NEGOTIATION',
  CONVERTED = 'CONVERTED',
  LOST = 'LOST',
  UNQUALIFIED = 'UNQUALIFIED',
}

export enum LeadSourceEnum {
  WEBSITE = 'WEBSITE',
  REFERRAL = 'REFERRAL',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  EMAIL_CAMPAIGN = 'EMAIL_CAMPAIGN',
  PAID_ADS = 'PAID_ADS',
  COLD_OUTREACH = 'COLD_OUTREACH',
  EVENT = 'EVENT',
  PARTNER = 'PARTNER',
  OTHER = 'OTHER',
  ADMIN = 'ADMIN',
  GOOGLE_ADS = 'GOOGLE_ADS',
  FACEBOOK_ADS = 'FACEBOOK_ADS',
  LINKEDIN_ADS = 'LINKEDIN_ADS',
  ORGANIC_SEARCH = 'ORGANIC_SEARCH',
  DIRECT_TRAFFIC = 'DIRECT_TRAFFIC',
}

export enum ProductInterestEnum {
  SAAS = 'SAAS',
  MOBILE_APP = 'MOBILE_APP',
  WEB_APP = 'WEB_APP',
  CUSTOM_SOFTWARE = 'CUSTOM_SOFTWARE',
  API_INTEGRATION = 'API_INTEGRATION',
  CONSULTING = 'CONSULTING',
  OTHER = 'OTHER',
}

export enum PriorityEnum {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

registerEnumType(LeadStatusEnum, { name: 'LeadStatus' })
registerEnumType(LeadSourceEnum, { name: 'LeadSource' })
registerEnumType(ProductInterestEnum, { name: 'ProductInterest' })
registerEnumType(PriorityEnum, { name: 'Priority' })
