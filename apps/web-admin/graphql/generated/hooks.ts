import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

export type AddCompanyNoteInput = {
  content: Scalars['String']['input'];
  type?: InputMaybe<Scalars['String']['input']>;
};

export type ApiKey = {
  __typename?: 'ApiKey';
  channelToken: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  createdBy?: Maybe<User>;
  expiresAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  lastUsedAt?: Maybe<Scalars['DateTime']['output']>;
  lastUsedIp?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  prefix: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  usageCount: Scalars['Float']['output'];
};

/** The type of attributable entity */
export enum AttributableType {
  Company = 'COMPANY'
}

/** The data type of the attribute */
export enum AttributeDataType {
  Boolean = 'BOOLEAN',
  Date = 'DATE',
  Number = 'NUMBER',
  Text = 'TEXT'
}

export type AttributeFilterInput = {
  attributeTypeId: Scalars['ID']['input'];
  valueIds: Array<Scalars['ID']['input']>;
};

export type AttributeGroup = {
  __typename?: 'AttributeGroup';
  code: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isSystemDefined: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  order?: Maybe<Scalars['Int']['output']>;
};

export type AttributeGroupConnection = {
  __typename?: 'AttributeGroupConnection';
  items: Array<AttributeGroup>;
  totalCount: Scalars['Int']['output'];
};

export type AttributeType = {
  __typename?: 'AttributeType';
  availableFor: Array<AttributableType>;
  channelToken: Scalars['String']['output'];
  code: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  dataType: AttributeDataType;
  group?: Maybe<AttributeGroup>;
  groupId?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isSystemDefined: Scalars['Boolean']['output'];
  kind: AttributeTypeKind;
  name: Scalars['String']['output'];
  order: Scalars['Int']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type AttributeTypeConnection = {
  __typename?: 'AttributeTypeConnection';
  items: Array<AttributeType>;
  totalCount: Scalars['Int']['output'];
};

/** The kind of attribute type */
export enum AttributeTypeKind {
  Hierarchical = 'HIERARCHICAL',
  MultiSelect = 'MULTI_SELECT',
  Select = 'SELECT',
  Text = 'TEXT'
}

export type AttributeValue = {
  __typename?: 'AttributeValue';
  attributeTypeId: Scalars['ID']['output'];
  code: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  meta?: Maybe<Scalars['JSON']['output']>;
  parentId?: Maybe<Scalars['ID']['output']>;
  type?: Maybe<AttributeType>;
  value: Scalars['String']['output'];
};

export type AttributeValueConnection = {
  __typename?: 'AttributeValueConnection';
  items: Array<AttributeValue>;
  totalCount: Scalars['Int']['output'];
};

export type AuthenticationPayload = {
  __typename?: 'AuthenticationPayload';
  token: Scalars['String']['output'];
  user: User;
};

export type ChangePasswordInput = {
  confirmPassword: Scalars['String']['input'];
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};

export type ChangePasswordOutput = {
  __typename?: 'ChangePasswordOutput';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type Channel = {
  __typename?: 'Channel';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  token: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ChannelConnection = {
  __typename?: 'ChannelConnection';
  items: Array<Channel>;
  totalCount: Scalars['Int']['output'];
};

export type Company = {
  __typename?: 'Company';
  address?: Maybe<Scalars['JSON']['output']>;
  addressAttributeCodes?: Maybe<Array<Scalars['String']['output']>>;
  attributes?: Maybe<Array<AttributeValue>>;
  channelToken?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  linkedinUrl?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  notes: CompanyConnectionNotes;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  socialProfiles?: Maybe<Scalars['JSON']['output']>;
  taxId?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  website?: Maybe<Scalars['String']['output']>;
};


export type CompanyNotesArgs = {
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type CompanyConnection = {
  __typename?: 'CompanyConnection';
  items: Array<Company>;
  totalCount: Scalars['Int']['output'];
};

export type CompanyConnectionNotes = {
  __typename?: 'CompanyConnectionNotes';
  items: Array<CompanyNote>;
  totalCount: Scalars['Int']['output'];
};

export type CompanyNote = {
  __typename?: 'CompanyNote';
  channelToken: Scalars['ID']['output'];
  companyId: Scalars['ID']['output'];
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  type?: Maybe<CompanyNoteType>;
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['ID']['output'];
};

export enum CompanyNoteType {
  Call = 'CALL',
  FollowUp = 'FOLLOW_UP',
  General = 'GENERAL',
  Meeting = 'MEETING'
}

export type CreateActivityInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  leadId: Scalars['ID']['input'];
  scheduledAt?: InputMaybe<Scalars['String']['input']>;
  subject: Scalars['String']['input'];
  type: Scalars['String']['input'];
};

export type CreateApiKeyInput = {
  name: Scalars['String']['input'];
};

export type CreateAttributeGroupInput = {
  name: Scalars['String']['input'];
};

export type CreateAttributeInput = {
  attributeTypeId: Scalars['ID']['input'];
  meta?: InputMaybe<Scalars['JSON']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  value: Scalars['String']['input'];
};

export type CreateAttributeTypeInput = {
  availableFor: Array<AttributableType>;
  config?: InputMaybe<Scalars['JSON']['input']>;
  dataType: AttributeDataType;
  groupId?: InputMaybe<Scalars['ID']['input']>;
  kind: AttributeTypeKind;
  name: Scalars['String']['input'];
};

export type CreateChannelInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  token?: InputMaybe<Scalars['String']['input']>;
};

export type CreateCompanyInput = {
  address?: InputMaybe<Scalars['JSON']['input']>;
  /** Hiyerarşik adres değerlerinin kodları (örn: ["turkiye", "izmir", "bornova"]) */
  addressAttributeCodes?: InputMaybe<Array<Scalars['String']['input']>>;
  attributeIds?: InputMaybe<Array<Scalars['String']['input']>>;
  description?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  linkedinUrl?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  socialProfiles?: InputMaybe<Scalars['JSON']['input']>;
  taxId?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type CreateLeadInput = {
  assignedToId?: InputMaybe<Scalars['ID']['input']>;
  budget?: InputMaybe<Scalars['String']['input']>;
  company?: InputMaybe<Scalars['String']['input']>;
  companySize?: InputMaybe<Scalars['Float']['input']>;
  currentSolution?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  isDecisionMaker?: InputMaybe<Scalars['Boolean']['input']>;
  jobTitle?: InputMaybe<Scalars['String']['input']>;
  lastName: Scalars['String']['input'];
  painPoints?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Priority>;
  productInterest?: InputMaybe<Array<ProductInterest>>;
  source: LeadSource;
  status?: InputMaybe<LeadStatus>;
  timeline?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type GeneratedApiKey = {
  __typename?: 'GeneratedApiKey';
  channelToken: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  createdBy?: Maybe<User>;
  expiresAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  lastUsedAt?: Maybe<Scalars['DateTime']['output']>;
  lastUsedIp?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  plainKey: Scalars['String']['output'];
  prefix: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  usageCount: Scalars['Float']['output'];
};

export type GetAttributeValuesByCodeArgs = {
  attributeTypeCode: Scalars['String']['input'];
  parentCode?: InputMaybe<Scalars['String']['input']>;
  /** Search query */
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  /** Number of items to skip */
  skip?: InputMaybe<Scalars['Int']['input']>;
  /** Number of items to take */
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type Lead = {
  __typename?: 'Lead';
  activities: Array<LeadActivity>;
  activitiesCount: Scalars['Float']['output'];
  assignedTo?: Maybe<User>;
  assignedToId?: Maybe<Scalars['String']['output']>;
  budget?: Maybe<Scalars['String']['output']>;
  company?: Maybe<Scalars['String']['output']>;
  companySize?: Maybe<Scalars['Float']['output']>;
  convertedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  currentSolution?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isDecisionMaker: Scalars['Boolean']['output'];
  jobTitle?: Maybe<Scalars['String']['output']>;
  lastContactedAt?: Maybe<Scalars['DateTime']['output']>;
  lastName: Scalars['String']['output'];
  lostReason?: Maybe<Scalars['String']['output']>;
  notes: Array<LeadNote>;
  notesCount: Scalars['Float']['output'];
  painPoints?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  priority: Priority;
  productInterest: Array<ProductInterest>;
  source: LeadSource;
  status: LeadStatus;
  tags: Array<Tag>;
  tagsCount: Scalars['Float']['output'];
  timeline?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  website?: Maybe<Scalars['String']['output']>;
};


export type LeadActivitiesArgs = {
  skip?: InputMaybe<Scalars['Float']['input']>;
  take?: InputMaybe<Scalars['Float']['input']>;
};


export type LeadNotesArgs = {
  skip?: InputMaybe<Scalars['Float']['input']>;
  take?: InputMaybe<Scalars['Float']['input']>;
};

export type LeadActivity = {
  __typename?: 'LeadActivity';
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  leadId: Scalars['String']['output'];
  scheduledAt?: Maybe<Scalars['DateTime']['output']>;
  subject: Scalars['String']['output'];
  type: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type LeadConnection = {
  __typename?: 'LeadConnection';
  items: Array<Lead>;
  totalCount: Scalars['Int']['output'];
};

export type LeadNote = {
  __typename?: 'LeadNote';
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  leadId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['String']['output'];
};

export enum LeadSource {
  Admin = 'ADMIN',
  ColdOutreach = 'COLD_OUTREACH',
  DirectTraffic = 'DIRECT_TRAFFIC',
  EmailCampaign = 'EMAIL_CAMPAIGN',
  Event = 'EVENT',
  FacebookAds = 'FACEBOOK_ADS',
  GoogleAds = 'GOOGLE_ADS',
  LinkedinAds = 'LINKEDIN_ADS',
  OrganicSearch = 'ORGANIC_SEARCH',
  Other = 'OTHER',
  PaidAds = 'PAID_ADS',
  Partner = 'PARTNER',
  Referral = 'REFERRAL',
  SocialMedia = 'SOCIAL_MEDIA',
  Website = 'WEBSITE'
}

export enum LeadStatus {
  Contacted = 'CONTACTED',
  Converted = 'CONVERTED',
  Lost = 'LOST',
  Negotiation = 'NEGOTIATION',
  New = 'NEW',
  ProposalSent = 'PROPOSAL_SENT',
  Qualified = 'QUALIFIED',
  Unqualified = 'UNQUALIFIED'
}

export type ListQueryArgs = {
  /** Search query */
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  /** Number of items to skip */
  skip?: InputMaybe<Scalars['Int']['input']>;
  /** Number of items to take */
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type LoginUserInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type LogoutOutput = {
  __typename?: 'LogoutOutput';
  success: Scalars['Boolean']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addNoteToCompany: CompanyNote;
  changePassword: ChangePasswordOutput;
  completeActivity: LeadActivity;
  createActivity: LeadActivity;
  createApiKey: GeneratedApiKey;
  createAttributeGroup: AttributeGroup;
  createAttributeType: AttributeType;
  createAttributeValue: AttributeValue;
  createChannel: Channel;
  createCompany: Company;
  createLead: Lead;
  createNote: LeadNote;
  deleteActivity: LeadActivity;
  deleteAttributeGroup: Scalars['Boolean']['output'];
  deleteAttributeType: Scalars['Boolean']['output'];
  deleteAttributeValue: Scalars['Boolean']['output'];
  deleteCompany: Company;
  deleteCompanyNote: CompanyNote;
  deleteLead: Lead;
  deleteNote: LeadNote;
  loginUser: AuthenticationPayload;
  logoutUser: LogoutOutput;
  markAllAsRead: Scalars['Float']['output'];
  markAsRead: Notification;
  registerNewTenant: AuthenticationPayload;
  registerUser: AuthenticationPayload;
  revokeApiKey: ApiKey;
  updateActivity: LeadActivity;
  updateAttributeGroup: AttributeGroup;
  updateAttributeType: AttributeType;
  updateAttributeValue: AttributeValue;
  updateCompany: Company;
  updateCompanyNote: CompanyNote;
  updateLead: Lead;
  updateNote: LeadNote;
  updateUserProfile: User;
};


export type MutationAddNoteToCompanyArgs = {
  addCompanyNoteInput: AddCompanyNoteInput;
  companyId: Scalars['ID']['input'];
};


export type MutationChangePasswordArgs = {
  input: ChangePasswordInput;
};


export type MutationCompleteActivityArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCreateActivityArgs = {
  input: CreateActivityInput;
};


export type MutationCreateApiKeyArgs = {
  input: CreateApiKeyInput;
};


export type MutationCreateAttributeGroupArgs = {
  createAttributeGroupInput: CreateAttributeGroupInput;
};


export type MutationCreateAttributeTypeArgs = {
  createAttributeTypeInput: CreateAttributeTypeInput;
};


export type MutationCreateAttributeValueArgs = {
  createAttributeValueInput: CreateAttributeInput;
};


export type MutationCreateChannelArgs = {
  createChannelInput: CreateChannelInput;
};


export type MutationCreateCompanyArgs = {
  createCompanyInput: CreateCompanyInput;
};


export type MutationCreateLeadArgs = {
  createLeadInput: CreateLeadInput;
};


export type MutationCreateNoteArgs = {
  content: Scalars['String']['input'];
  leadId: Scalars['ID']['input'];
};


export type MutationDeleteActivityArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteAttributeGroupArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteAttributeTypeArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteAttributeValueArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCompanyArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCompanyNoteArgs = {
  noteId: Scalars['ID']['input'];
};


export type MutationDeleteLeadArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteNoteArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLoginUserArgs = {
  loginUserInput: LoginUserInput;
};


export type MutationMarkAsReadArgs = {
  notificationId: Scalars['ID']['input'];
};


export type MutationRegisterNewTenantArgs = {
  registerNewTenantInput: RegisterNewTenantInput;
};


export type MutationRegisterUserArgs = {
  channelToken: Scalars['String']['input'];
  registerUserInput: RegisterUserInput;
};


export type MutationRevokeApiKeyArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateActivityArgs = {
  input: UpdateActivityInput;
};


export type MutationUpdateAttributeGroupArgs = {
  id: Scalars['ID']['input'];
  updateAttributeGroupInput: UpdateAttributeGroupInput;
};


export type MutationUpdateAttributeTypeArgs = {
  id: Scalars['ID']['input'];
  updateAttributeTypeInput: UpdateAttributeTypeInput;
};


export type MutationUpdateAttributeValueArgs = {
  id: Scalars['ID']['input'];
  updateAttributeValueInput: UpdateAttributeInput;
};


export type MutationUpdateCompanyArgs = {
  id: Scalars['ID']['input'];
  updateCompanyInput: UpdateCompanyInput;
};


export type MutationUpdateCompanyNoteArgs = {
  noteId: Scalars['ID']['input'];
  updateCompanyNoteInput: UpdateCompanyNoteInput;
};


export type MutationUpdateLeadArgs = {
  updateLeadInput: UpdateLeadInput;
};


export type MutationUpdateNoteArgs = {
  content?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};


export type MutationUpdateUserProfileArgs = {
  input: UpdateUserProfileInput;
};

export type NoteConnection = {
  __typename?: 'NoteConnection';
  items: Array<LeadNote>;
  totalCount: Scalars['Int']['output'];
};

export type Notification = {
  __typename?: 'Notification';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isRead: Scalars['Boolean']['output'];
  leadId?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  metadata?: Maybe<Scalars['JSON']['output']>;
  priority: NotificationPriority;
  readAt?: Maybe<Scalars['DateTime']['output']>;
  title: Scalars['String']['output'];
  type: NotificationType;
  userId?: Maybe<Scalars['String']['output']>;
};

export type NotificationConnection = {
  __typename?: 'NotificationConnection';
  items: Array<Notification>;
  totalCount: Scalars['Int']['output'];
};

export enum NotificationPriority {
  High = 'HIGH',
  Low = 'LOW',
  Medium = 'MEDIUM'
}

export enum NotificationType {
  ActivityDue = 'ACTIVITY_DUE',
  LeadAssigned = 'LEAD_ASSIGNED',
  LeadStatusChanged = 'LEAD_STATUS_CHANGED',
  NewLead = 'NEW_LEAD'
}

export enum Priority {
  High = 'HIGH',
  Low = 'LOW',
  Medium = 'MEDIUM',
  Urgent = 'URGENT'
}

export enum ProductInterest {
  ApiIntegration = 'API_INTEGRATION',
  Consulting = 'CONSULTING',
  CustomSoftware = 'CUSTOM_SOFTWARE',
  MobileApp = 'MOBILE_APP',
  Other = 'OTHER',
  Saas = 'SAAS',
  WebApp = 'WEB_APP'
}

export type Query = {
  __typename?: 'Query';
  activities: Array<LeadActivity>;
  activitiesCount: Scalars['Float']['output'];
  activity?: Maybe<LeadActivity>;
  apiKey?: Maybe<ApiKey>;
  attributeGroups: AttributeGroupConnection;
  attributeTypes: AttributeTypeConnection;
  attributeValues: AttributeValueConnection;
  attributeValuesByCode: AttributeValueConnection;
  channelByToken?: Maybe<Channel>;
  channels: ChannelConnection;
  companies: CompanyConnection;
  company?: Maybe<Company>;
  companyNotes?: Maybe<CompanyConnectionNotes>;
  getUser: User;
  getUserByEmail: User;
  getUsers: UserConnection;
  lead?: Maybe<Lead>;
  leads: LeadConnection;
  listApiKeys: Array<ApiKey>;
  me?: Maybe<User>;
  note?: Maybe<LeadNote>;
  notes: NoteConnection;
  notesCount: Scalars['Float']['output'];
  notifications: NotificationConnection;
  unreadCount: Scalars['Float']['output'];
};


export type QueryActivitiesArgs = {
  endDate?: InputMaybe<Scalars['String']['input']>;
  isCompleted?: InputMaybe<Scalars['Boolean']['input']>;
  leadId?: InputMaybe<Scalars['ID']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryActivitiesCountArgs = {
  endDate?: InputMaybe<Scalars['String']['input']>;
  isCompleted?: InputMaybe<Scalars['Boolean']['input']>;
  leadId?: InputMaybe<Scalars['ID']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryActivityArgs = {
  id: Scalars['ID']['input'];
};


export type QueryApiKeyArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAttributeGroupsArgs = {
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAttributeTypesArgs = {
  args?: InputMaybe<ListQueryArgs>;
  includeSystemDefined?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryAttributeValuesArgs = {
  attributeTypeId: Scalars['ID']['input'];
  parentId?: InputMaybe<Scalars['ID']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAttributeValuesByCodeArgs = {
  args: GetAttributeValuesByCodeArgs;
};


export type QueryChannelByTokenArgs = {
  token: Scalars['String']['input'];
};


export type QueryChannelsArgs = {
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryCompaniesArgs = {
  address?: InputMaybe<Scalars['String']['input']>;
  channelToken?: InputMaybe<Scalars['ID']['input']>;
  filters?: InputMaybe<Array<AttributeFilterInput>>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryCompanyArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCompanyNotesArgs = {
  companyId: Scalars['ID']['input'];
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetUserArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetUserByEmailArgs = {
  email: Scalars['String']['input'];
};


export type QueryGetUsersArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryLeadArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLeadsArgs = {
  assignedToId?: InputMaybe<Scalars['ID']['input']>;
  channelToken?: InputMaybe<Scalars['ID']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Array<Priority>>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['String']['input']>;
  source?: InputMaybe<Array<LeadSource>>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Array<LeadStatus>>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryNoteArgs = {
  id: Scalars['ID']['input'];
};


export type QueryNotesArgs = {
  leadId?: InputMaybe<Scalars['ID']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Float']['input']>;
  take?: InputMaybe<Scalars['Float']['input']>;
  userId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryNotesCountArgs = {
  leadId?: InputMaybe<Scalars['ID']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryNotificationsArgs = {
  onlyUnread?: InputMaybe<Scalars['Boolean']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type RegisterNewTenantInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  tenantDescription?: InputMaybe<Scalars['String']['input']>;
  tenantName: Scalars['String']['input'];
  userName: Scalars['String']['input'];
};

export type RegisterUserInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Tag = {
  __typename?: 'Tag';
  color?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type UpdateActivityInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  scheduledAt?: InputMaybe<Scalars['String']['input']>;
  subject?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateAttributeGroupInput = {
  name: Scalars['String']['input'];
};

export type UpdateAttributeInput = {
  attributeTypeId?: InputMaybe<Scalars['ID']['input']>;
  meta?: InputMaybe<Scalars['JSON']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateAttributeTypeInput = {
  availableFor: Array<AttributableType>;
  config?: InputMaybe<Scalars['JSON']['input']>;
  dataType: AttributeDataType;
  groupId?: InputMaybe<Scalars['ID']['input']>;
  id: Scalars['ID']['input'];
  kind: AttributeTypeKind;
  name: Scalars['String']['input'];
};

export type UpdateCompanyInput = {
  address?: InputMaybe<Scalars['JSON']['input']>;
  /** Hiyerarşik adres değerlerinin kodları (örn: ["turkiye", "izmir", "bornova"]) */
  addressAttributeCodes?: InputMaybe<Array<Scalars['String']['input']>>;
  attributeIds?: InputMaybe<Array<Scalars['String']['input']>>;
  description?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  linkedinUrl?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  socialProfiles?: InputMaybe<Scalars['JSON']['input']>;
  taxId?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCompanyNoteInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateLeadInput = {
  assignedToId?: InputMaybe<Scalars['ID']['input']>;
  budget?: InputMaybe<Scalars['String']['input']>;
  company?: InputMaybe<Scalars['String']['input']>;
  companySize?: InputMaybe<Scalars['Float']['input']>;
  currentSolution?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  isDecisionMaker?: InputMaybe<Scalars['Boolean']['input']>;
  jobTitle?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  painPoints?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Priority>;
  productInterest?: InputMaybe<Array<ProductInterest>>;
  source?: InputMaybe<LeadSource>;
  status?: InputMaybe<LeadStatus>;
  timeline?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserProfileInput = {
  name: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type UserConnection = {
  __typename?: 'UserConnection';
  items: Array<User>;
  totalCount: Scalars['Int']['output'];
};

export type CreateApiKeyMutationVariables = Exact<{
  input: CreateApiKeyInput;
}>;


export type CreateApiKeyMutation = { createApiKey: { __typename?: 'GeneratedApiKey', id: string, name: string, prefix: string, plainKey: string, isActive: boolean, createdAt: any, createdBy?: { __typename?: 'User', id: string, email: string, name?: string | null } | null } };

export type ListApiKeysQueryVariables = Exact<{ [key: string]: never; }>;


export type ListApiKeysQuery = { listApiKeys: Array<{ __typename?: 'ApiKey', id: string, name: string, prefix: string, isActive: boolean, usageCount: number, lastUsedAt?: any | null, lastUsedIp?: string | null, createdAt: any, updatedAt: any, createdBy?: { __typename?: 'User', id: string, email: string, name?: string | null } | null }> };

export type RevokeApiKeyMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RevokeApiKeyMutation = { revokeApiKey: { __typename?: 'ApiKey', id: string, name: string, isActive: boolean } };

export type CreateAttributeGroupMutationVariables = Exact<{
  input: CreateAttributeGroupInput;
}>;


export type CreateAttributeGroupMutation = { createAttributeGroup: { __typename?: 'AttributeGroup', id: string, name: string } };

export type UpdateAttributeGroupMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateAttributeGroupInput;
}>;


export type UpdateAttributeGroupMutation = { updateAttributeGroup: { __typename?: 'AttributeGroup', id: string, name: string } };

export type DeleteAttributeGroupMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteAttributeGroupMutation = { deleteAttributeGroup: boolean };

export type GetAttributeGroupsQueryVariables = Exact<{
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetAttributeGroupsQuery = { attributeGroups: { __typename?: 'AttributeGroupConnection', totalCount: number, items: Array<{ __typename?: 'AttributeGroup', id: string, isSystemDefined: boolean, name: string, code: string, order?: number | null }> } };

export type CreateAttributeTypeMutationVariables = Exact<{
  createAttributeTypeInput: CreateAttributeTypeInput;
}>;


export type CreateAttributeTypeMutation = { createAttributeType: { __typename?: 'AttributeType', id: string, name: string, kind: AttributeTypeKind, dataType: AttributeDataType, isSystemDefined: boolean, order: number, channelToken: string, createdAt?: any | null } };

export type UpdateAttributeTypeMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  updateAttributeTypeInput: UpdateAttributeTypeInput;
}>;


export type UpdateAttributeTypeMutation = { updateAttributeType: { __typename?: 'AttributeType', id: string, name: string, kind: AttributeTypeKind, dataType: AttributeDataType, isSystemDefined: boolean, order: number, channelToken: string, createdAt?: any | null } };

export type DeleteAttributeTypeMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteAttributeTypeMutation = { deleteAttributeType: boolean };

export type CreateAttributeValueMutationVariables = Exact<{
  createAttributeValueInput: CreateAttributeInput;
}>;


export type CreateAttributeValueMutation = { createAttributeValue: { __typename?: 'AttributeValue', id: string, value: string, attributeTypeId: string } };

export type UpdateAttributeValueMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  updateAttributeValueInput: UpdateAttributeInput;
}>;


export type UpdateAttributeValueMutation = { updateAttributeValue: { __typename?: 'AttributeValue', id: string, value: string } };

export type DeleteAttributeValueMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteAttributeValueMutation = { deleteAttributeValue: boolean };

export type GetAttributeArchitectureQueryVariables = Exact<{
  attributeTypesArgs?: InputMaybe<ListQueryArgs>;
  attributeTypesIncludeSystemDefined?: InputMaybe<Scalars['Boolean']['input']>;
  attributeGroupsSearchQuery?: InputMaybe<Scalars['String']['input']>;
  attributeGroupsTake?: InputMaybe<Scalars['Int']['input']>;
  attributeGroupsSkip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetAttributeArchitectureQuery = { attributeTypes: { __typename?: 'AttributeTypeConnection', totalCount: number, items: Array<{ __typename?: 'AttributeType', id: string, name: string, code: string, channelToken: string, kind: AttributeTypeKind, dataType: AttributeDataType, createdAt?: any | null, isSystemDefined: boolean, groupId?: string | null, availableFor: Array<AttributableType> }> }, attributeGroups: { __typename?: 'AttributeGroupConnection', totalCount: number, items: Array<{ __typename?: 'AttributeGroup', id: string, isSystemDefined: boolean, name: string, code: string, order?: number | null }> } };

export type GetAttributeTypesQueryVariables = Exact<{
  args?: InputMaybe<ListQueryArgs>;
  includeSystemDefined?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetAttributeTypesQuery = { attributeTypes: { __typename?: 'AttributeTypeConnection', totalCount: number, items: Array<{ __typename?: 'AttributeType', id: string, name: string, code: string, channelToken: string, kind: AttributeTypeKind, dataType: AttributeDataType, createdAt?: any | null, isSystemDefined: boolean, groupId?: string | null, availableFor: Array<AttributableType> }> } };

export type GetAttributeValuesQueryVariables = Exact<{
  attributeTypeId: Scalars['ID']['input'];
  parentId?: InputMaybe<Scalars['ID']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAttributeValuesQuery = { attributeValues: { __typename?: 'AttributeValueConnection', totalCount: number, items: Array<{ __typename?: 'AttributeValue', id: string, value: string, code: string, attributeTypeId: string }> } };

export type GetAttributeValuesByCodeQueryVariables = Exact<{
  args: GetAttributeValuesByCodeArgs;
}>;


export type GetAttributeValuesByCodeQuery = { attributeValuesByCode: { __typename?: 'AttributeValueConnection', totalCount: number, items: Array<{ __typename?: 'AttributeValue', id: string, value: string, code: string, attributeTypeId: string }> } };

export type ChangePasswordMutationVariables = Exact<{
  input: ChangePasswordInput;
}>;


export type ChangePasswordMutation = { changePassword: { __typename?: 'ChangePasswordOutput', success: boolean, message?: string | null } };

export type UsersQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
}>;


export type UsersQuery = { getUsers: { __typename?: 'UserConnection', totalCount: number, items: Array<{ __typename?: 'User', id: string, name?: string | null, email: string }> } };

export type LoginUserMutationVariables = Exact<{
  input: LoginUserInput;
}>;


export type LoginUserMutation = { loginUser: { __typename?: 'AuthenticationPayload', token: string, user: { __typename?: 'User', id: string, email: string, name?: string | null } } };

export type LogoutUserMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutUserMutation = { logoutUser: { __typename?: 'LogoutOutput', success: boolean } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { me?: { __typename?: 'User', id: string, email: string, name?: string | null } | null };

export type RegisterNewTenantMutationVariables = Exact<{
  input: RegisterNewTenantInput;
}>;


export type RegisterNewTenantMutation = { registerNewTenant: { __typename?: 'AuthenticationPayload', token: string, user: { __typename?: 'User', id: string, email: string, name?: string | null } } };

export type RegisterUserMutationVariables = Exact<{
  input: RegisterUserInput;
  token: Scalars['String']['input'];
}>;


export type RegisterUserMutation = { registerUser: { __typename?: 'AuthenticationPayload', token: string, user: { __typename?: 'User', email: string } } };

export type UpdateUserProfileMutationVariables = Exact<{
  input: UpdateUserProfileInput;
}>;


export type UpdateUserProfileMutation = { updateUserProfile: { __typename?: 'User', id: string, email: string, name?: string | null, updatedAt?: any | null } };

export type CreateChannelMutationVariables = Exact<{
  input: CreateChannelInput;
}>;


export type CreateChannelMutation = { createChannel: { __typename?: 'Channel', id: string, name: string, token: string, description?: string | null } };

export type GetChannelByTokenQueryVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type GetChannelByTokenQuery = { channelByToken?: { __typename?: 'Channel', id: string, name: string, token: string } | null };

export type GetChannelsQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetChannelsQuery = { channels: { __typename?: 'ChannelConnection', totalCount: number, items: Array<{ __typename?: 'Channel', id: string, name: string, token: string }> } };

export type AddNoteMutationVariables = Exact<{
  companyId: Scalars['ID']['input'];
  input: AddCompanyNoteInput;
}>;


export type AddNoteMutation = { addNoteToCompany: { __typename?: 'CompanyNote', id: string, content: string, type?: CompanyNoteType | null, userId: string, createdAt: any, updatedAt: any } };

export type CreateCompanyMutationVariables = Exact<{
  input: CreateCompanyInput;
}>;


export type CreateCompanyMutation = { createCompany: { __typename?: 'Company', id: string, name: string, website?: string | null, createdAt: any } };

export type DeleteNoteMutationVariables = Exact<{
  noteId: Scalars['ID']['input'];
}>;


export type DeleteNoteMutation = { deleteCompanyNote: { __typename?: 'CompanyNote', id: string } };

export type DeleteCompanyMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteCompanyMutation = { deleteCompany: { __typename?: 'Company', id: string, deletedAt?: any | null } };

export type GetCompaniesQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetCompaniesQuery = { companies: { __typename?: 'CompanyConnection', totalCount: number, items: Array<{ __typename?: 'Company', id: string, name: string, website?: string | null, description?: string | null, createdAt: any }> } };

export type GetCompaniesWithAttributesQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  filters?: InputMaybe<Array<AttributeFilterInput> | AttributeFilterInput>;
  address?: InputMaybe<Scalars['String']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetCompaniesWithAttributesQuery = { companies: { __typename?: 'CompanyConnection', totalCount: number, items: Array<{ __typename?: 'Company', id: string, address?: any | null, channelToken?: string | null, name: string, website?: string | null, createdAt: any, updatedAt: any, deletedAt?: any | null, linkedinUrl?: string | null, attributes?: Array<{ __typename?: 'AttributeValue', id: string, value: string }> | null }> } };

export type CompaniesQueryVariables = Exact<{ [key: string]: never; }>;


export type CompaniesQuery = { companies: { __typename?: 'CompanyConnection', items: Array<{ __typename?: 'Company', name: string, notes: { __typename?: 'CompanyConnectionNotes', totalCount: number, items: Array<{ __typename?: 'CompanyNote', content: string }> } }> } };

export type GetCompanyDetailQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  notesSkip?: InputMaybe<Scalars['Int']['input']>;
  notesTake?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetCompanyDetailQuery = { company?: { __typename?: 'Company', id: string, name: string, website?: string | null, linkedinUrl?: string | null, address?: any | null, description?: string | null, channelToken?: string | null, createdAt: any, updatedAt: any, notes: { __typename?: 'CompanyConnectionNotes', totalCount: number, items: Array<{ __typename?: 'CompanyNote', id: string, content: string, type?: CompanyNoteType | null, userId: string, createdAt: any, updatedAt: any }> } } | null };

export type GetCompanyNotesQueryVariables = Exact<{
  companyId: Scalars['ID']['input'];
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetCompanyNotesQuery = { companyNotes?: { __typename?: 'CompanyConnectionNotes', totalCount: number, items: Array<{ __typename?: 'CompanyNote', id: string, type?: CompanyNoteType | null, companyId: string, content: string, createdAt: any }> } | null };

export type GetCompanyWithAttributesAndNotesQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetCompanyWithAttributesAndNotesQuery = { company?: { __typename?: 'Company', id: string, name: string, email?: string | null, website?: string | null, taxId?: string | null, description?: string | null, phoneNumber?: string | null, socialProfiles?: any | null, address?: any | null, addressAttributeCodes?: Array<string> | null, createdAt: any, deletedAt?: any | null, updatedAt: any, attributes?: Array<{ __typename?: 'AttributeValue', id: string, value: string, type?: { __typename?: 'AttributeType', id: string } | null }> | null } | null, companyNotes?: { __typename?: 'CompanyConnectionNotes', totalCount: number, items: Array<{ __typename?: 'CompanyNote', id: string, type?: CompanyNoteType | null, userId: string, companyId: string, content: string, createdAt: any }> } | null };

export type GetCompanyWithAttributesQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetCompanyWithAttributesQuery = { company?: { __typename?: 'Company', id: string, address?: any | null, channelToken?: string | null, name: string, website?: string | null, createdAt: any, updatedAt: any, deletedAt?: any | null, linkedinUrl?: string | null, attributes?: Array<{ __typename?: 'AttributeValue', id: string, value: string }> | null } | null };

export type GetCompanyQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetCompanyQuery = { company?: { __typename?: 'Company', address?: any | null, channelToken?: string | null, name: string, website?: string | null } | null };

export type UpdateCompanyMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateCompanyInput;
}>;


export type UpdateCompanyMutation = { updateCompany: { __typename?: 'Company', id: string, name: string, website?: string | null, updatedAt: any } };

export type UpdateNoteMutationVariables = Exact<{
  noteId: Scalars['ID']['input'];
  input: UpdateCompanyNoteInput;
}>;


export type UpdateNoteMutation = { updateCompanyNote: { __typename?: 'CompanyNote', id: string, content: string, type?: CompanyNoteType | null, updatedAt: any } };

export type CompleteActivityMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type CompleteActivityMutation = { completeActivity: { __typename?: 'LeadActivity', id: string, completedAt?: any | null } };

export type CreateActivityMutationVariables = Exact<{
  input: CreateActivityInput;
}>;


export type CreateActivityMutation = { createActivity: { __typename?: 'LeadActivity', id: string, createdAt: any, type: string, subject: string, description?: string | null, scheduledAt?: any | null, completedAt?: any | null, leadId: string, userId: string } };

export type CreateLeadMutationVariables = Exact<{
  input: CreateLeadInput;
}>;


export type CreateLeadMutation = { createLead: { __typename?: 'Lead', id: string, firstName: string, lastName: string, email: string } };

export type CreateNoteMutationVariables = Exact<{
  leadId: Scalars['ID']['input'];
  content: Scalars['String']['input'];
}>;


export type CreateNoteMutation = { createNote: { __typename?: 'LeadNote', id: string, content: string, leadId: string, userId: string, createdAt: any, updatedAt: any } };

export type DeleteActivityMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteActivityMutation = { deleteActivity: { __typename?: 'LeadActivity', id: string } };

export type DeleteLeadMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteLeadMutation = { deleteLead: { __typename?: 'Lead', id: string } };

export type DeleteLeadNoteMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteLeadNoteMutation = { deleteNote: { __typename?: 'LeadNote', id: string } };

export type GetActivitiesCountQueryVariables = Exact<{
  leadId?: InputMaybe<Scalars['ID']['input']>;
  userId?: InputMaybe<Scalars['ID']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  isCompleted?: InputMaybe<Scalars['Boolean']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetActivitiesCountQuery = { activitiesCount: number };

export type GetActivitiesQueryVariables = Exact<{
  leadId?: InputMaybe<Scalars['ID']['input']>;
  userId?: InputMaybe<Scalars['ID']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  isCompleted?: InputMaybe<Scalars['Boolean']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetActivitiesQuery = { activities: Array<{ __typename?: 'LeadActivity', id: string, createdAt: any, type: string, subject: string, description?: string | null, scheduledAt?: any | null, completedAt?: any | null, leadId: string, userId: string }> };

export type GetActivityQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetActivityQuery = { activity?: { __typename?: 'LeadActivity', id: string, createdAt: any, type: string, subject: string, description?: string | null, scheduledAt?: any | null, completedAt?: any | null, leadId: string, userId: string } | null };

export type GetLeadDetailQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetLeadDetailQuery = { lead?: { __typename?: 'Lead', id: string, createdAt: any, updatedAt: any, firstName: string, lastName: string, email: string, phone?: string | null, company?: string | null, jobTitle?: string | null, website?: string | null, status: LeadStatus, source: LeadSource, priority: Priority, productInterest: Array<ProductInterest>, budget?: string | null, timeline?: string | null, companySize?: number | null, isDecisionMaker: boolean, painPoints?: string | null, currentSolution?: string | null, lastContactedAt?: any | null, convertedAt?: any | null, lostReason?: string | null, assignedTo?: { __typename?: 'User', id: string, name?: string | null, email: string } | null } | null };

export type GetLeadsQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Array<LeadStatus> | LeadStatus>;
  source?: InputMaybe<Array<LeadSource> | LeadSource>;
  priority?: InputMaybe<Array<Priority> | Priority>;
  assignedToId?: InputMaybe<Scalars['ID']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetLeadsQuery = { leads: { __typename?: 'LeadConnection', totalCount: number, items: Array<{ __typename?: 'Lead', id: string, createdAt: any, firstName: string, lastName: string, email: string, company?: string | null, status: LeadStatus, source: LeadSource, productInterest: Array<ProductInterest>, priority: Priority, assignedTo?: { __typename?: 'User', id: string, name?: string | null, email: string } | null }> } };

export type GetNotesCountQueryVariables = Exact<{
  leadId?: InputMaybe<Scalars['ID']['input']>;
  userId?: InputMaybe<Scalars['ID']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetNotesCountQuery = { notesCount: number };

export type GetNotesQueryVariables = Exact<{
  leadId?: InputMaybe<Scalars['ID']['input']>;
  userId?: InputMaybe<Scalars['ID']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Float']['input']>;
  take?: InputMaybe<Scalars['Float']['input']>;
}>;


export type GetNotesQuery = { notes: { __typename?: 'NoteConnection', totalCount: number, items: Array<{ __typename?: 'LeadNote', id: string, content: string, leadId: string, userId: string, createdAt: any, updatedAt: any }> } };

export type UpdateActivityMutationVariables = Exact<{
  input: UpdateActivityInput;
}>;


export type UpdateActivityMutation = { updateActivity: { __typename?: 'LeadActivity', id: string, createdAt: any, type: string, subject: string, description?: string | null, scheduledAt?: any | null, completedAt?: any | null, leadId: string, userId: string } };

export type UpdateLeadMutationVariables = Exact<{
  input: UpdateLeadInput;
}>;


export type UpdateLeadMutation = { updateLead: { __typename?: 'Lead', id: string, firstName: string, lastName: string, email: string, status: LeadStatus, priority: Priority } };

export type UpdateLeadNoteMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  content?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateLeadNoteMutation = { updateNote: { __typename?: 'LeadNote', id: string, content: string, updatedAt: any } };

export type GetNotificationsQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  onlyUnread?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetNotificationsQuery = { notifications: { __typename?: 'NotificationConnection', totalCount: number, items: Array<{ __typename?: 'Notification', id: string, createdAt: any, type: NotificationType, priority: NotificationPriority, title: string, message: string, isRead: boolean, leadId?: string | null, metadata?: any | null }> } };

export type MarkAllAsReadMutationVariables = Exact<{ [key: string]: never; }>;


export type MarkAllAsReadMutation = { markAllAsRead: number };

export type MarkAsReadMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type MarkAsReadMutation = { markAsRead: { __typename?: 'Notification', id: string, isRead: boolean, readAt?: any | null } };

export type UnreadCountQueryVariables = Exact<{ [key: string]: never; }>;


export type UnreadCountQuery = { unreadCount: number };


export const CreateApiKeyDocument = gql`
    mutation CreateApiKey($input: CreateApiKeyInput!) {
  createApiKey(input: $input) {
    id
    name
    prefix
    plainKey
    isActive
    createdAt
    createdBy {
      id
      email
      name
    }
  }
}
    `;
export type CreateApiKeyMutationFn = Apollo.MutationFunction<CreateApiKeyMutation, CreateApiKeyMutationVariables>;
export function useCreateApiKeyMutation(baseOptions?: Apollo.MutationHookOptions<CreateApiKeyMutation, CreateApiKeyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateApiKeyMutation, CreateApiKeyMutationVariables>(CreateApiKeyDocument, options);
      }
export type CreateApiKeyMutationHookResult = ReturnType<typeof useCreateApiKeyMutation>;
export type CreateApiKeyMutationResult = Apollo.MutationResult<CreateApiKeyMutation>;
export type CreateApiKeyMutationOptions = Apollo.BaseMutationOptions<CreateApiKeyMutation, CreateApiKeyMutationVariables>;
export const ListApiKeysDocument = gql`
    query ListApiKeys {
  listApiKeys {
    id
    name
    prefix
    isActive
    usageCount
    lastUsedAt
    lastUsedIp
    createdAt
    updatedAt
    createdBy {
      id
      email
      name
    }
  }
}
    `;
export function useListApiKeysQuery(baseOptions?: Apollo.QueryHookOptions<ListApiKeysQuery, ListApiKeysQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListApiKeysQuery, ListApiKeysQueryVariables>(ListApiKeysDocument, options);
      }
export function useListApiKeysLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListApiKeysQuery, ListApiKeysQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListApiKeysQuery, ListApiKeysQueryVariables>(ListApiKeysDocument, options);
        }
export function useListApiKeysSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListApiKeysQuery, ListApiKeysQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListApiKeysQuery, ListApiKeysQueryVariables>(ListApiKeysDocument, options);
        }
export type ListApiKeysQueryHookResult = ReturnType<typeof useListApiKeysQuery>;
export type ListApiKeysLazyQueryHookResult = ReturnType<typeof useListApiKeysLazyQuery>;
export type ListApiKeysSuspenseQueryHookResult = ReturnType<typeof useListApiKeysSuspenseQuery>;
export type ListApiKeysQueryResult = Apollo.QueryResult<ListApiKeysQuery, ListApiKeysQueryVariables>;
export const RevokeApiKeyDocument = gql`
    mutation RevokeApiKey($id: ID!) {
  revokeApiKey(id: $id) {
    id
    name
    isActive
  }
}
    `;
export type RevokeApiKeyMutationFn = Apollo.MutationFunction<RevokeApiKeyMutation, RevokeApiKeyMutationVariables>;
export function useRevokeApiKeyMutation(baseOptions?: Apollo.MutationHookOptions<RevokeApiKeyMutation, RevokeApiKeyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RevokeApiKeyMutation, RevokeApiKeyMutationVariables>(RevokeApiKeyDocument, options);
      }
export type RevokeApiKeyMutationHookResult = ReturnType<typeof useRevokeApiKeyMutation>;
export type RevokeApiKeyMutationResult = Apollo.MutationResult<RevokeApiKeyMutation>;
export type RevokeApiKeyMutationOptions = Apollo.BaseMutationOptions<RevokeApiKeyMutation, RevokeApiKeyMutationVariables>;
export const CreateAttributeGroupDocument = gql`
    mutation CreateAttributeGroup($input: CreateAttributeGroupInput!) {
  createAttributeGroup(createAttributeGroupInput: $input) {
    id
    name
  }
}
    `;
export type CreateAttributeGroupMutationFn = Apollo.MutationFunction<CreateAttributeGroupMutation, CreateAttributeGroupMutationVariables>;
export function useCreateAttributeGroupMutation(baseOptions?: Apollo.MutationHookOptions<CreateAttributeGroupMutation, CreateAttributeGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAttributeGroupMutation, CreateAttributeGroupMutationVariables>(CreateAttributeGroupDocument, options);
      }
export type CreateAttributeGroupMutationHookResult = ReturnType<typeof useCreateAttributeGroupMutation>;
export type CreateAttributeGroupMutationResult = Apollo.MutationResult<CreateAttributeGroupMutation>;
export type CreateAttributeGroupMutationOptions = Apollo.BaseMutationOptions<CreateAttributeGroupMutation, CreateAttributeGroupMutationVariables>;
export const UpdateAttributeGroupDocument = gql`
    mutation UpdateAttributeGroup($id: ID!, $input: UpdateAttributeGroupInput!) {
  updateAttributeGroup(id: $id, updateAttributeGroupInput: $input) {
    id
    name
  }
}
    `;
export type UpdateAttributeGroupMutationFn = Apollo.MutationFunction<UpdateAttributeGroupMutation, UpdateAttributeGroupMutationVariables>;
export function useUpdateAttributeGroupMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAttributeGroupMutation, UpdateAttributeGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAttributeGroupMutation, UpdateAttributeGroupMutationVariables>(UpdateAttributeGroupDocument, options);
      }
export type UpdateAttributeGroupMutationHookResult = ReturnType<typeof useUpdateAttributeGroupMutation>;
export type UpdateAttributeGroupMutationResult = Apollo.MutationResult<UpdateAttributeGroupMutation>;
export type UpdateAttributeGroupMutationOptions = Apollo.BaseMutationOptions<UpdateAttributeGroupMutation, UpdateAttributeGroupMutationVariables>;
export const DeleteAttributeGroupDocument = gql`
    mutation DeleteAttributeGroup($id: ID!) {
  deleteAttributeGroup(id: $id)
}
    `;
export type DeleteAttributeGroupMutationFn = Apollo.MutationFunction<DeleteAttributeGroupMutation, DeleteAttributeGroupMutationVariables>;
export function useDeleteAttributeGroupMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAttributeGroupMutation, DeleteAttributeGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAttributeGroupMutation, DeleteAttributeGroupMutationVariables>(DeleteAttributeGroupDocument, options);
      }
export type DeleteAttributeGroupMutationHookResult = ReturnType<typeof useDeleteAttributeGroupMutation>;
export type DeleteAttributeGroupMutationResult = Apollo.MutationResult<DeleteAttributeGroupMutation>;
export type DeleteAttributeGroupMutationOptions = Apollo.BaseMutationOptions<DeleteAttributeGroupMutation, DeleteAttributeGroupMutationVariables>;
export const GetAttributeGroupsDocument = gql`
    query getAttributeGroups($searchQuery: String, $skip: Int, $take: Int) {
  attributeGroups(searchQuery: $searchQuery, skip: $skip, take: $take) {
    items {
      id
      isSystemDefined
      name
      code
      order
    }
    totalCount
  }
}
    `;
export function useGetAttributeGroupsQuery(baseOptions?: Apollo.QueryHookOptions<GetAttributeGroupsQuery, GetAttributeGroupsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAttributeGroupsQuery, GetAttributeGroupsQueryVariables>(GetAttributeGroupsDocument, options);
      }
export function useGetAttributeGroupsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAttributeGroupsQuery, GetAttributeGroupsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAttributeGroupsQuery, GetAttributeGroupsQueryVariables>(GetAttributeGroupsDocument, options);
        }
export function useGetAttributeGroupsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAttributeGroupsQuery, GetAttributeGroupsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAttributeGroupsQuery, GetAttributeGroupsQueryVariables>(GetAttributeGroupsDocument, options);
        }
export type GetAttributeGroupsQueryHookResult = ReturnType<typeof useGetAttributeGroupsQuery>;
export type GetAttributeGroupsLazyQueryHookResult = ReturnType<typeof useGetAttributeGroupsLazyQuery>;
export type GetAttributeGroupsSuspenseQueryHookResult = ReturnType<typeof useGetAttributeGroupsSuspenseQuery>;
export type GetAttributeGroupsQueryResult = Apollo.QueryResult<GetAttributeGroupsQuery, GetAttributeGroupsQueryVariables>;
export const CreateAttributeTypeDocument = gql`
    mutation createAttributeType($createAttributeTypeInput: CreateAttributeTypeInput!) {
  createAttributeType(createAttributeTypeInput: $createAttributeTypeInput) {
    id
    name
    kind
    dataType
    isSystemDefined
    order
    channelToken
    createdAt
  }
}
    `;
export type CreateAttributeTypeMutationFn = Apollo.MutationFunction<CreateAttributeTypeMutation, CreateAttributeTypeMutationVariables>;
export function useCreateAttributeTypeMutation(baseOptions?: Apollo.MutationHookOptions<CreateAttributeTypeMutation, CreateAttributeTypeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAttributeTypeMutation, CreateAttributeTypeMutationVariables>(CreateAttributeTypeDocument, options);
      }
export type CreateAttributeTypeMutationHookResult = ReturnType<typeof useCreateAttributeTypeMutation>;
export type CreateAttributeTypeMutationResult = Apollo.MutationResult<CreateAttributeTypeMutation>;
export type CreateAttributeTypeMutationOptions = Apollo.BaseMutationOptions<CreateAttributeTypeMutation, CreateAttributeTypeMutationVariables>;
export const UpdateAttributeTypeDocument = gql`
    mutation updateAttributeType($id: ID!, $updateAttributeTypeInput: UpdateAttributeTypeInput!) {
  updateAttributeType(
    id: $id
    updateAttributeTypeInput: $updateAttributeTypeInput
  ) {
    id
    name
    kind
    dataType
    isSystemDefined
    order
    channelToken
    createdAt
  }
}
    `;
export type UpdateAttributeTypeMutationFn = Apollo.MutationFunction<UpdateAttributeTypeMutation, UpdateAttributeTypeMutationVariables>;
export function useUpdateAttributeTypeMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAttributeTypeMutation, UpdateAttributeTypeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAttributeTypeMutation, UpdateAttributeTypeMutationVariables>(UpdateAttributeTypeDocument, options);
      }
export type UpdateAttributeTypeMutationHookResult = ReturnType<typeof useUpdateAttributeTypeMutation>;
export type UpdateAttributeTypeMutationResult = Apollo.MutationResult<UpdateAttributeTypeMutation>;
export type UpdateAttributeTypeMutationOptions = Apollo.BaseMutationOptions<UpdateAttributeTypeMutation, UpdateAttributeTypeMutationVariables>;
export const DeleteAttributeTypeDocument = gql`
    mutation deleteAttributeType($id: ID!) {
  deleteAttributeType(id: $id)
}
    `;
export type DeleteAttributeTypeMutationFn = Apollo.MutationFunction<DeleteAttributeTypeMutation, DeleteAttributeTypeMutationVariables>;
export function useDeleteAttributeTypeMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAttributeTypeMutation, DeleteAttributeTypeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAttributeTypeMutation, DeleteAttributeTypeMutationVariables>(DeleteAttributeTypeDocument, options);
      }
export type DeleteAttributeTypeMutationHookResult = ReturnType<typeof useDeleteAttributeTypeMutation>;
export type DeleteAttributeTypeMutationResult = Apollo.MutationResult<DeleteAttributeTypeMutation>;
export type DeleteAttributeTypeMutationOptions = Apollo.BaseMutationOptions<DeleteAttributeTypeMutation, DeleteAttributeTypeMutationVariables>;
export const CreateAttributeValueDocument = gql`
    mutation createAttributeValue($createAttributeValueInput: CreateAttributeInput!) {
  createAttributeValue(createAttributeValueInput: $createAttributeValueInput) {
    id
    value
    attributeTypeId
  }
}
    `;
export type CreateAttributeValueMutationFn = Apollo.MutationFunction<CreateAttributeValueMutation, CreateAttributeValueMutationVariables>;
export function useCreateAttributeValueMutation(baseOptions?: Apollo.MutationHookOptions<CreateAttributeValueMutation, CreateAttributeValueMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAttributeValueMutation, CreateAttributeValueMutationVariables>(CreateAttributeValueDocument, options);
      }
export type CreateAttributeValueMutationHookResult = ReturnType<typeof useCreateAttributeValueMutation>;
export type CreateAttributeValueMutationResult = Apollo.MutationResult<CreateAttributeValueMutation>;
export type CreateAttributeValueMutationOptions = Apollo.BaseMutationOptions<CreateAttributeValueMutation, CreateAttributeValueMutationVariables>;
export const UpdateAttributeValueDocument = gql`
    mutation updateAttributeValue($id: ID!, $updateAttributeValueInput: UpdateAttributeInput!) {
  updateAttributeValue(
    id: $id
    updateAttributeValueInput: $updateAttributeValueInput
  ) {
    id
    value
  }
}
    `;
export type UpdateAttributeValueMutationFn = Apollo.MutationFunction<UpdateAttributeValueMutation, UpdateAttributeValueMutationVariables>;
export function useUpdateAttributeValueMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAttributeValueMutation, UpdateAttributeValueMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAttributeValueMutation, UpdateAttributeValueMutationVariables>(UpdateAttributeValueDocument, options);
      }
export type UpdateAttributeValueMutationHookResult = ReturnType<typeof useUpdateAttributeValueMutation>;
export type UpdateAttributeValueMutationResult = Apollo.MutationResult<UpdateAttributeValueMutation>;
export type UpdateAttributeValueMutationOptions = Apollo.BaseMutationOptions<UpdateAttributeValueMutation, UpdateAttributeValueMutationVariables>;
export const DeleteAttributeValueDocument = gql`
    mutation deleteAttributeValue($id: ID!) {
  deleteAttributeValue(id: $id)
}
    `;
export type DeleteAttributeValueMutationFn = Apollo.MutationFunction<DeleteAttributeValueMutation, DeleteAttributeValueMutationVariables>;
export function useDeleteAttributeValueMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAttributeValueMutation, DeleteAttributeValueMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAttributeValueMutation, DeleteAttributeValueMutationVariables>(DeleteAttributeValueDocument, options);
      }
export type DeleteAttributeValueMutationHookResult = ReturnType<typeof useDeleteAttributeValueMutation>;
export type DeleteAttributeValueMutationResult = Apollo.MutationResult<DeleteAttributeValueMutation>;
export type DeleteAttributeValueMutationOptions = Apollo.BaseMutationOptions<DeleteAttributeValueMutation, DeleteAttributeValueMutationVariables>;
export const GetAttributeArchitectureDocument = gql`
    query GetAttributeArchitecture($attributeTypesArgs: ListQueryArgs, $attributeTypesIncludeSystemDefined: Boolean, $attributeGroupsSearchQuery: String, $attributeGroupsTake: Int, $attributeGroupsSkip: Int) {
  attributeTypes(
    args: $attributeTypesArgs
    includeSystemDefined: $attributeTypesIncludeSystemDefined
  ) {
    items {
      id
      name
      code
      channelToken
      kind
      dataType
      createdAt
      isSystemDefined
      groupId
      availableFor
    }
    totalCount
  }
  attributeGroups(
    searchQuery: $attributeGroupsSearchQuery
    take: $attributeGroupsTake
    skip: $attributeGroupsSkip
  ) {
    items {
      id
      isSystemDefined
      name
      code
      order
    }
    totalCount
  }
}
    `;
export function useGetAttributeArchitectureQuery(baseOptions?: Apollo.QueryHookOptions<GetAttributeArchitectureQuery, GetAttributeArchitectureQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAttributeArchitectureQuery, GetAttributeArchitectureQueryVariables>(GetAttributeArchitectureDocument, options);
      }
export function useGetAttributeArchitectureLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAttributeArchitectureQuery, GetAttributeArchitectureQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAttributeArchitectureQuery, GetAttributeArchitectureQueryVariables>(GetAttributeArchitectureDocument, options);
        }
export function useGetAttributeArchitectureSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAttributeArchitectureQuery, GetAttributeArchitectureQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAttributeArchitectureQuery, GetAttributeArchitectureQueryVariables>(GetAttributeArchitectureDocument, options);
        }
export type GetAttributeArchitectureQueryHookResult = ReturnType<typeof useGetAttributeArchitectureQuery>;
export type GetAttributeArchitectureLazyQueryHookResult = ReturnType<typeof useGetAttributeArchitectureLazyQuery>;
export type GetAttributeArchitectureSuspenseQueryHookResult = ReturnType<typeof useGetAttributeArchitectureSuspenseQuery>;
export type GetAttributeArchitectureQueryResult = Apollo.QueryResult<GetAttributeArchitectureQuery, GetAttributeArchitectureQueryVariables>;
export const GetAttributeTypesDocument = gql`
    query getAttributeTypes($args: ListQueryArgs, $includeSystemDefined: Boolean) {
  attributeTypes(args: $args, includeSystemDefined: $includeSystemDefined) {
    items {
      id
      name
      code
      channelToken
      kind
      dataType
      createdAt
      isSystemDefined
      groupId
      availableFor
    }
    totalCount
  }
}
    `;
export function useGetAttributeTypesQuery(baseOptions?: Apollo.QueryHookOptions<GetAttributeTypesQuery, GetAttributeTypesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAttributeTypesQuery, GetAttributeTypesQueryVariables>(GetAttributeTypesDocument, options);
      }
export function useGetAttributeTypesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAttributeTypesQuery, GetAttributeTypesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAttributeTypesQuery, GetAttributeTypesQueryVariables>(GetAttributeTypesDocument, options);
        }
export function useGetAttributeTypesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAttributeTypesQuery, GetAttributeTypesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAttributeTypesQuery, GetAttributeTypesQueryVariables>(GetAttributeTypesDocument, options);
        }
export type GetAttributeTypesQueryHookResult = ReturnType<typeof useGetAttributeTypesQuery>;
export type GetAttributeTypesLazyQueryHookResult = ReturnType<typeof useGetAttributeTypesLazyQuery>;
export type GetAttributeTypesSuspenseQueryHookResult = ReturnType<typeof useGetAttributeTypesSuspenseQuery>;
export type GetAttributeTypesQueryResult = Apollo.QueryResult<GetAttributeTypesQuery, GetAttributeTypesQueryVariables>;
export const GetAttributeValuesDocument = gql`
    query getAttributeValues($attributeTypeId: ID!, $parentId: ID, $skip: Int, $take: Int, $searchQuery: String) {
  attributeValues(
    attributeTypeId: $attributeTypeId
    parentId: $parentId
    skip: $skip
    take: $take
    searchQuery: $searchQuery
  ) {
    items {
      id
      value
      code
      attributeTypeId
    }
    totalCount
  }
}
    `;
export function useGetAttributeValuesQuery(baseOptions: Apollo.QueryHookOptions<GetAttributeValuesQuery, GetAttributeValuesQueryVariables> & ({ variables: GetAttributeValuesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAttributeValuesQuery, GetAttributeValuesQueryVariables>(GetAttributeValuesDocument, options);
      }
export function useGetAttributeValuesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAttributeValuesQuery, GetAttributeValuesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAttributeValuesQuery, GetAttributeValuesQueryVariables>(GetAttributeValuesDocument, options);
        }
export function useGetAttributeValuesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAttributeValuesQuery, GetAttributeValuesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAttributeValuesQuery, GetAttributeValuesQueryVariables>(GetAttributeValuesDocument, options);
        }
export type GetAttributeValuesQueryHookResult = ReturnType<typeof useGetAttributeValuesQuery>;
export type GetAttributeValuesLazyQueryHookResult = ReturnType<typeof useGetAttributeValuesLazyQuery>;
export type GetAttributeValuesSuspenseQueryHookResult = ReturnType<typeof useGetAttributeValuesSuspenseQuery>;
export type GetAttributeValuesQueryResult = Apollo.QueryResult<GetAttributeValuesQuery, GetAttributeValuesQueryVariables>;
export const GetAttributeValuesByCodeDocument = gql`
    query getAttributeValuesByCode($args: GetAttributeValuesByCodeArgs!) {
  attributeValuesByCode(args: $args) {
    items {
      id
      value
      code
      attributeTypeId
    }
    totalCount
  }
}
    `;
export function useGetAttributeValuesByCodeQuery(baseOptions: Apollo.QueryHookOptions<GetAttributeValuesByCodeQuery, GetAttributeValuesByCodeQueryVariables> & ({ variables: GetAttributeValuesByCodeQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAttributeValuesByCodeQuery, GetAttributeValuesByCodeQueryVariables>(GetAttributeValuesByCodeDocument, options);
      }
export function useGetAttributeValuesByCodeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAttributeValuesByCodeQuery, GetAttributeValuesByCodeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAttributeValuesByCodeQuery, GetAttributeValuesByCodeQueryVariables>(GetAttributeValuesByCodeDocument, options);
        }
export function useGetAttributeValuesByCodeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAttributeValuesByCodeQuery, GetAttributeValuesByCodeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAttributeValuesByCodeQuery, GetAttributeValuesByCodeQueryVariables>(GetAttributeValuesByCodeDocument, options);
        }
export type GetAttributeValuesByCodeQueryHookResult = ReturnType<typeof useGetAttributeValuesByCodeQuery>;
export type GetAttributeValuesByCodeLazyQueryHookResult = ReturnType<typeof useGetAttributeValuesByCodeLazyQuery>;
export type GetAttributeValuesByCodeSuspenseQueryHookResult = ReturnType<typeof useGetAttributeValuesByCodeSuspenseQuery>;
export type GetAttributeValuesByCodeQueryResult = Apollo.QueryResult<GetAttributeValuesByCodeQuery, GetAttributeValuesByCodeQueryVariables>;
export const ChangePasswordDocument = gql`
    mutation changePassword($input: ChangePasswordInput!) {
  changePassword(input: $input) {
    success
    message
  }
}
    `;
export type ChangePasswordMutationFn = Apollo.MutationFunction<ChangePasswordMutation, ChangePasswordMutationVariables>;
export function useChangePasswordMutation(baseOptions?: Apollo.MutationHookOptions<ChangePasswordMutation, ChangePasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument, options);
      }
export type ChangePasswordMutationHookResult = ReturnType<typeof useChangePasswordMutation>;
export type ChangePasswordMutationResult = Apollo.MutationResult<ChangePasswordMutation>;
export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const UsersDocument = gql`
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
    `;
export function useUsersQuery(baseOptions?: Apollo.QueryHookOptions<UsersQuery, UsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
      }
export function useUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersQuery, UsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
        }
export function useUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<UsersQuery, UsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
        }
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersLazyQueryHookResult = ReturnType<typeof useUsersLazyQuery>;
export type UsersSuspenseQueryHookResult = ReturnType<typeof useUsersSuspenseQuery>;
export type UsersQueryResult = Apollo.QueryResult<UsersQuery, UsersQueryVariables>;
export const LoginUserDocument = gql`
    mutation loginUser($input: LoginUserInput!) {
  loginUser(loginUserInput: $input) {
    token
    user {
      id
      email
      name
    }
  }
}
    `;
export type LoginUserMutationFn = Apollo.MutationFunction<LoginUserMutation, LoginUserMutationVariables>;
export function useLoginUserMutation(baseOptions?: Apollo.MutationHookOptions<LoginUserMutation, LoginUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginUserMutation, LoginUserMutationVariables>(LoginUserDocument, options);
      }
export type LoginUserMutationHookResult = ReturnType<typeof useLoginUserMutation>;
export type LoginUserMutationResult = Apollo.MutationResult<LoginUserMutation>;
export type LoginUserMutationOptions = Apollo.BaseMutationOptions<LoginUserMutation, LoginUserMutationVariables>;
export const LogoutUserDocument = gql`
    mutation logoutUser {
  logoutUser {
    success
  }
}
    `;
export type LogoutUserMutationFn = Apollo.MutationFunction<LogoutUserMutation, LogoutUserMutationVariables>;
export function useLogoutUserMutation(baseOptions?: Apollo.MutationHookOptions<LogoutUserMutation, LogoutUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutUserMutation, LogoutUserMutationVariables>(LogoutUserDocument, options);
      }
export type LogoutUserMutationHookResult = ReturnType<typeof useLogoutUserMutation>;
export type LogoutUserMutationResult = Apollo.MutationResult<LogoutUserMutation>;
export type LogoutUserMutationOptions = Apollo.BaseMutationOptions<LogoutUserMutation, LogoutUserMutationVariables>;
export const MeDocument = gql`
    query me {
  me {
    id
    email
    name
  }
}
    `;
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export function useMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeSuspenseQueryHookResult = ReturnType<typeof useMeSuspenseQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const RegisterNewTenantDocument = gql`
    mutation registerNewTenant($input: RegisterNewTenantInput!) {
  registerNewTenant(registerNewTenantInput: $input) {
    token
    user {
      id
      email
      name
    }
  }
}
    `;
export type RegisterNewTenantMutationFn = Apollo.MutationFunction<RegisterNewTenantMutation, RegisterNewTenantMutationVariables>;
export function useRegisterNewTenantMutation(baseOptions?: Apollo.MutationHookOptions<RegisterNewTenantMutation, RegisterNewTenantMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterNewTenantMutation, RegisterNewTenantMutationVariables>(RegisterNewTenantDocument, options);
      }
export type RegisterNewTenantMutationHookResult = ReturnType<typeof useRegisterNewTenantMutation>;
export type RegisterNewTenantMutationResult = Apollo.MutationResult<RegisterNewTenantMutation>;
export type RegisterNewTenantMutationOptions = Apollo.BaseMutationOptions<RegisterNewTenantMutation, RegisterNewTenantMutationVariables>;
export const RegisterUserDocument = gql`
    mutation registerUser($input: RegisterUserInput!, $token: String!) {
  registerUser(registerUserInput: $input, channelToken: $token) {
    token
    user {
      email
    }
  }
}
    `;
export type RegisterUserMutationFn = Apollo.MutationFunction<RegisterUserMutation, RegisterUserMutationVariables>;
export function useRegisterUserMutation(baseOptions?: Apollo.MutationHookOptions<RegisterUserMutation, RegisterUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterUserMutation, RegisterUserMutationVariables>(RegisterUserDocument, options);
      }
export type RegisterUserMutationHookResult = ReturnType<typeof useRegisterUserMutation>;
export type RegisterUserMutationResult = Apollo.MutationResult<RegisterUserMutation>;
export type RegisterUserMutationOptions = Apollo.BaseMutationOptions<RegisterUserMutation, RegisterUserMutationVariables>;
export const UpdateUserProfileDocument = gql`
    mutation updateUserProfile($input: UpdateUserProfileInput!) {
  updateUserProfile(input: $input) {
    id
    email
    name
    updatedAt
  }
}
    `;
export type UpdateUserProfileMutationFn = Apollo.MutationFunction<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>;
export function useUpdateUserProfileMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>(UpdateUserProfileDocument, options);
      }
export type UpdateUserProfileMutationHookResult = ReturnType<typeof useUpdateUserProfileMutation>;
export type UpdateUserProfileMutationResult = Apollo.MutationResult<UpdateUserProfileMutation>;
export type UpdateUserProfileMutationOptions = Apollo.BaseMutationOptions<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>;
export const CreateChannelDocument = gql`
    mutation createChannel($input: CreateChannelInput!) {
  createChannel(createChannelInput: $input) {
    id
    name
    token
    description
  }
}
    `;
export type CreateChannelMutationFn = Apollo.MutationFunction<CreateChannelMutation, CreateChannelMutationVariables>;
export function useCreateChannelMutation(baseOptions?: Apollo.MutationHookOptions<CreateChannelMutation, CreateChannelMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateChannelMutation, CreateChannelMutationVariables>(CreateChannelDocument, options);
      }
export type CreateChannelMutationHookResult = ReturnType<typeof useCreateChannelMutation>;
export type CreateChannelMutationResult = Apollo.MutationResult<CreateChannelMutation>;
export type CreateChannelMutationOptions = Apollo.BaseMutationOptions<CreateChannelMutation, CreateChannelMutationVariables>;
export const GetChannelByTokenDocument = gql`
    query getChannelByToken($token: String!) {
  channelByToken(token: $token) {
    id
    name
    token
  }
}
    `;
export function useGetChannelByTokenQuery(baseOptions: Apollo.QueryHookOptions<GetChannelByTokenQuery, GetChannelByTokenQueryVariables> & ({ variables: GetChannelByTokenQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetChannelByTokenQuery, GetChannelByTokenQueryVariables>(GetChannelByTokenDocument, options);
      }
export function useGetChannelByTokenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetChannelByTokenQuery, GetChannelByTokenQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetChannelByTokenQuery, GetChannelByTokenQueryVariables>(GetChannelByTokenDocument, options);
        }
export function useGetChannelByTokenSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetChannelByTokenQuery, GetChannelByTokenQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetChannelByTokenQuery, GetChannelByTokenQueryVariables>(GetChannelByTokenDocument, options);
        }
export type GetChannelByTokenQueryHookResult = ReturnType<typeof useGetChannelByTokenQuery>;
export type GetChannelByTokenLazyQueryHookResult = ReturnType<typeof useGetChannelByTokenLazyQuery>;
export type GetChannelByTokenSuspenseQueryHookResult = ReturnType<typeof useGetChannelByTokenSuspenseQuery>;
export type GetChannelByTokenQueryResult = Apollo.QueryResult<GetChannelByTokenQuery, GetChannelByTokenQueryVariables>;
export const GetChannelsDocument = gql`
    query getChannels($skip: Int, $take: Int) {
  channels(skip: $skip, take: $take) {
    items {
      id
      name
      token
    }
    totalCount
  }
}
    `;
export function useGetChannelsQuery(baseOptions?: Apollo.QueryHookOptions<GetChannelsQuery, GetChannelsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetChannelsQuery, GetChannelsQueryVariables>(GetChannelsDocument, options);
      }
export function useGetChannelsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetChannelsQuery, GetChannelsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetChannelsQuery, GetChannelsQueryVariables>(GetChannelsDocument, options);
        }
export function useGetChannelsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetChannelsQuery, GetChannelsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetChannelsQuery, GetChannelsQueryVariables>(GetChannelsDocument, options);
        }
export type GetChannelsQueryHookResult = ReturnType<typeof useGetChannelsQuery>;
export type GetChannelsLazyQueryHookResult = ReturnType<typeof useGetChannelsLazyQuery>;
export type GetChannelsSuspenseQueryHookResult = ReturnType<typeof useGetChannelsSuspenseQuery>;
export type GetChannelsQueryResult = Apollo.QueryResult<GetChannelsQuery, GetChannelsQueryVariables>;
export const AddNoteDocument = gql`
    mutation addNote($companyId: ID!, $input: AddCompanyNoteInput!) {
  addNoteToCompany(companyId: $companyId, addCompanyNoteInput: $input) {
    id
    content
    type
    userId
    createdAt
    updatedAt
  }
}
    `;
export type AddNoteMutationFn = Apollo.MutationFunction<AddNoteMutation, AddNoteMutationVariables>;
export function useAddNoteMutation(baseOptions?: Apollo.MutationHookOptions<AddNoteMutation, AddNoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddNoteMutation, AddNoteMutationVariables>(AddNoteDocument, options);
      }
export type AddNoteMutationHookResult = ReturnType<typeof useAddNoteMutation>;
export type AddNoteMutationResult = Apollo.MutationResult<AddNoteMutation>;
export type AddNoteMutationOptions = Apollo.BaseMutationOptions<AddNoteMutation, AddNoteMutationVariables>;
export const CreateCompanyDocument = gql`
    mutation createCompany($input: CreateCompanyInput!) {
  createCompany(createCompanyInput: $input) {
    id
    name
    website
    createdAt
  }
}
    `;
export type CreateCompanyMutationFn = Apollo.MutationFunction<CreateCompanyMutation, CreateCompanyMutationVariables>;
export function useCreateCompanyMutation(baseOptions?: Apollo.MutationHookOptions<CreateCompanyMutation, CreateCompanyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCompanyMutation, CreateCompanyMutationVariables>(CreateCompanyDocument, options);
      }
export type CreateCompanyMutationHookResult = ReturnType<typeof useCreateCompanyMutation>;
export type CreateCompanyMutationResult = Apollo.MutationResult<CreateCompanyMutation>;
export type CreateCompanyMutationOptions = Apollo.BaseMutationOptions<CreateCompanyMutation, CreateCompanyMutationVariables>;
export const DeleteNoteDocument = gql`
    mutation deleteNote($noteId: ID!) {
  deleteCompanyNote(noteId: $noteId) {
    id
  }
}
    `;
export type DeleteNoteMutationFn = Apollo.MutationFunction<DeleteNoteMutation, DeleteNoteMutationVariables>;
export function useDeleteNoteMutation(baseOptions?: Apollo.MutationHookOptions<DeleteNoteMutation, DeleteNoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteNoteMutation, DeleteNoteMutationVariables>(DeleteNoteDocument, options);
      }
export type DeleteNoteMutationHookResult = ReturnType<typeof useDeleteNoteMutation>;
export type DeleteNoteMutationResult = Apollo.MutationResult<DeleteNoteMutation>;
export type DeleteNoteMutationOptions = Apollo.BaseMutationOptions<DeleteNoteMutation, DeleteNoteMutationVariables>;
export const DeleteCompanyDocument = gql`
    mutation deleteCompany($id: ID!) {
  deleteCompany(id: $id) {
    id
    deletedAt
  }
}
    `;
export type DeleteCompanyMutationFn = Apollo.MutationFunction<DeleteCompanyMutation, DeleteCompanyMutationVariables>;
export function useDeleteCompanyMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCompanyMutation, DeleteCompanyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCompanyMutation, DeleteCompanyMutationVariables>(DeleteCompanyDocument, options);
      }
export type DeleteCompanyMutationHookResult = ReturnType<typeof useDeleteCompanyMutation>;
export type DeleteCompanyMutationResult = Apollo.MutationResult<DeleteCompanyMutation>;
export type DeleteCompanyMutationOptions = Apollo.BaseMutationOptions<DeleteCompanyMutation, DeleteCompanyMutationVariables>;
export const GetCompaniesDocument = gql`
    query getCompanies($skip: Int, $take: Int) {
  companies(skip: $skip, take: $take) {
    items {
      id
      name
      website
      description
      createdAt
    }
    totalCount
  }
}
    `;
export function useGetCompaniesQuery(baseOptions?: Apollo.QueryHookOptions<GetCompaniesQuery, GetCompaniesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCompaniesQuery, GetCompaniesQueryVariables>(GetCompaniesDocument, options);
      }
export function useGetCompaniesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCompaniesQuery, GetCompaniesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCompaniesQuery, GetCompaniesQueryVariables>(GetCompaniesDocument, options);
        }
export function useGetCompaniesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCompaniesQuery, GetCompaniesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCompaniesQuery, GetCompaniesQueryVariables>(GetCompaniesDocument, options);
        }
export type GetCompaniesQueryHookResult = ReturnType<typeof useGetCompaniesQuery>;
export type GetCompaniesLazyQueryHookResult = ReturnType<typeof useGetCompaniesLazyQuery>;
export type GetCompaniesSuspenseQueryHookResult = ReturnType<typeof useGetCompaniesSuspenseQuery>;
export type GetCompaniesQueryResult = Apollo.QueryResult<GetCompaniesQuery, GetCompaniesQueryVariables>;
export const GetCompaniesWithAttributesDocument = gql`
    query getCompaniesWithAttributes($skip: Int, $take: Int, $filters: [AttributeFilterInput!], $address: String, $searchQuery: String) {
  companies(
    skip: $skip
    take: $take
    filters: $filters
    address: $address
    searchQuery: $searchQuery
  ) {
    items {
      id
      address
      channelToken
      name
      website
      createdAt
      updatedAt
      deletedAt
      linkedinUrl
      attributes {
        id
        value
      }
    }
    totalCount
  }
}
    `;
export function useGetCompaniesWithAttributesQuery(baseOptions?: Apollo.QueryHookOptions<GetCompaniesWithAttributesQuery, GetCompaniesWithAttributesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCompaniesWithAttributesQuery, GetCompaniesWithAttributesQueryVariables>(GetCompaniesWithAttributesDocument, options);
      }
export function useGetCompaniesWithAttributesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCompaniesWithAttributesQuery, GetCompaniesWithAttributesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCompaniesWithAttributesQuery, GetCompaniesWithAttributesQueryVariables>(GetCompaniesWithAttributesDocument, options);
        }
export function useGetCompaniesWithAttributesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCompaniesWithAttributesQuery, GetCompaniesWithAttributesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCompaniesWithAttributesQuery, GetCompaniesWithAttributesQueryVariables>(GetCompaniesWithAttributesDocument, options);
        }
export type GetCompaniesWithAttributesQueryHookResult = ReturnType<typeof useGetCompaniesWithAttributesQuery>;
export type GetCompaniesWithAttributesLazyQueryHookResult = ReturnType<typeof useGetCompaniesWithAttributesLazyQuery>;
export type GetCompaniesWithAttributesSuspenseQueryHookResult = ReturnType<typeof useGetCompaniesWithAttributesSuspenseQuery>;
export type GetCompaniesWithAttributesQueryResult = Apollo.QueryResult<GetCompaniesWithAttributesQuery, GetCompaniesWithAttributesQueryVariables>;
export const CompaniesDocument = gql`
    query companies {
  companies {
    items {
      name
      notes {
        items {
          content
        }
        totalCount
      }
    }
  }
}
    `;
export function useCompaniesQuery(baseOptions?: Apollo.QueryHookOptions<CompaniesQuery, CompaniesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CompaniesQuery, CompaniesQueryVariables>(CompaniesDocument, options);
      }
export function useCompaniesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CompaniesQuery, CompaniesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CompaniesQuery, CompaniesQueryVariables>(CompaniesDocument, options);
        }
export function useCompaniesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CompaniesQuery, CompaniesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CompaniesQuery, CompaniesQueryVariables>(CompaniesDocument, options);
        }
export type CompaniesQueryHookResult = ReturnType<typeof useCompaniesQuery>;
export type CompaniesLazyQueryHookResult = ReturnType<typeof useCompaniesLazyQuery>;
export type CompaniesSuspenseQueryHookResult = ReturnType<typeof useCompaniesSuspenseQuery>;
export type CompaniesQueryResult = Apollo.QueryResult<CompaniesQuery, CompaniesQueryVariables>;
export const GetCompanyDetailDocument = gql`
    query getCompanyDetail($id: ID!, $notesSkip: Int, $notesTake: Int) {
  company(id: $id) {
    id
    name
    website
    linkedinUrl
    address
    description
    channelToken
    createdAt
    updatedAt
    notes(skip: $notesSkip, take: $notesTake) {
      items {
        id
        content
        type
        userId
        createdAt
        updatedAt
      }
      totalCount
    }
  }
}
    `;
export function useGetCompanyDetailQuery(baseOptions: Apollo.QueryHookOptions<GetCompanyDetailQuery, GetCompanyDetailQueryVariables> & ({ variables: GetCompanyDetailQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCompanyDetailQuery, GetCompanyDetailQueryVariables>(GetCompanyDetailDocument, options);
      }
export function useGetCompanyDetailLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCompanyDetailQuery, GetCompanyDetailQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCompanyDetailQuery, GetCompanyDetailQueryVariables>(GetCompanyDetailDocument, options);
        }
export function useGetCompanyDetailSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCompanyDetailQuery, GetCompanyDetailQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCompanyDetailQuery, GetCompanyDetailQueryVariables>(GetCompanyDetailDocument, options);
        }
export type GetCompanyDetailQueryHookResult = ReturnType<typeof useGetCompanyDetailQuery>;
export type GetCompanyDetailLazyQueryHookResult = ReturnType<typeof useGetCompanyDetailLazyQuery>;
export type GetCompanyDetailSuspenseQueryHookResult = ReturnType<typeof useGetCompanyDetailSuspenseQuery>;
export type GetCompanyDetailQueryResult = Apollo.QueryResult<GetCompanyDetailQuery, GetCompanyDetailQueryVariables>;
export const GetCompanyNotesDocument = gql`
    query getCompanyNotes($companyId: ID!, $searchQuery: String, $skip: Int, $take: Int) {
  companyNotes(
    companyId: $companyId
    searchQuery: $searchQuery
    skip: $skip
    take: $take
  ) {
    items {
      id
      type
      companyId
      content
      createdAt
    }
    totalCount
  }
}
    `;
export function useGetCompanyNotesQuery(baseOptions: Apollo.QueryHookOptions<GetCompanyNotesQuery, GetCompanyNotesQueryVariables> & ({ variables: GetCompanyNotesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCompanyNotesQuery, GetCompanyNotesQueryVariables>(GetCompanyNotesDocument, options);
      }
export function useGetCompanyNotesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCompanyNotesQuery, GetCompanyNotesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCompanyNotesQuery, GetCompanyNotesQueryVariables>(GetCompanyNotesDocument, options);
        }
export function useGetCompanyNotesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCompanyNotesQuery, GetCompanyNotesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCompanyNotesQuery, GetCompanyNotesQueryVariables>(GetCompanyNotesDocument, options);
        }
export type GetCompanyNotesQueryHookResult = ReturnType<typeof useGetCompanyNotesQuery>;
export type GetCompanyNotesLazyQueryHookResult = ReturnType<typeof useGetCompanyNotesLazyQuery>;
export type GetCompanyNotesSuspenseQueryHookResult = ReturnType<typeof useGetCompanyNotesSuspenseQuery>;
export type GetCompanyNotesQueryResult = Apollo.QueryResult<GetCompanyNotesQuery, GetCompanyNotesQueryVariables>;
export const GetCompanyWithAttributesAndNotesDocument = gql`
    query getCompanyWithAttributesAndNotes($id: ID!, $searchQuery: String, $skip: Int, $take: Int) {
  company(id: $id) {
    id
    name
    email
    website
    taxId
    description
    phoneNumber
    socialProfiles
    address
    addressAttributeCodes
    attributes {
      id
      value
      type {
        id
      }
    }
    createdAt
    deletedAt
    updatedAt
  }
  companyNotes(
    companyId: $id
    searchQuery: $searchQuery
    skip: $skip
    take: $take
  ) {
    items {
      id
      type
      userId
      companyId
      content
      createdAt
    }
    totalCount
  }
}
    `;
export function useGetCompanyWithAttributesAndNotesQuery(baseOptions: Apollo.QueryHookOptions<GetCompanyWithAttributesAndNotesQuery, GetCompanyWithAttributesAndNotesQueryVariables> & ({ variables: GetCompanyWithAttributesAndNotesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCompanyWithAttributesAndNotesQuery, GetCompanyWithAttributesAndNotesQueryVariables>(GetCompanyWithAttributesAndNotesDocument, options);
      }
export function useGetCompanyWithAttributesAndNotesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCompanyWithAttributesAndNotesQuery, GetCompanyWithAttributesAndNotesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCompanyWithAttributesAndNotesQuery, GetCompanyWithAttributesAndNotesQueryVariables>(GetCompanyWithAttributesAndNotesDocument, options);
        }
export function useGetCompanyWithAttributesAndNotesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCompanyWithAttributesAndNotesQuery, GetCompanyWithAttributesAndNotesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCompanyWithAttributesAndNotesQuery, GetCompanyWithAttributesAndNotesQueryVariables>(GetCompanyWithAttributesAndNotesDocument, options);
        }
export type GetCompanyWithAttributesAndNotesQueryHookResult = ReturnType<typeof useGetCompanyWithAttributesAndNotesQuery>;
export type GetCompanyWithAttributesAndNotesLazyQueryHookResult = ReturnType<typeof useGetCompanyWithAttributesAndNotesLazyQuery>;
export type GetCompanyWithAttributesAndNotesSuspenseQueryHookResult = ReturnType<typeof useGetCompanyWithAttributesAndNotesSuspenseQuery>;
export type GetCompanyWithAttributesAndNotesQueryResult = Apollo.QueryResult<GetCompanyWithAttributesAndNotesQuery, GetCompanyWithAttributesAndNotesQueryVariables>;
export const GetCompanyWithAttributesDocument = gql`
    query getCompanyWithAttributes($id: ID!) {
  company(id: $id) {
    id
    address
    channelToken
    name
    website
    createdAt
    updatedAt
    deletedAt
    linkedinUrl
    attributes {
      id
      value
    }
  }
}
    `;
export function useGetCompanyWithAttributesQuery(baseOptions: Apollo.QueryHookOptions<GetCompanyWithAttributesQuery, GetCompanyWithAttributesQueryVariables> & ({ variables: GetCompanyWithAttributesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCompanyWithAttributesQuery, GetCompanyWithAttributesQueryVariables>(GetCompanyWithAttributesDocument, options);
      }
export function useGetCompanyWithAttributesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCompanyWithAttributesQuery, GetCompanyWithAttributesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCompanyWithAttributesQuery, GetCompanyWithAttributesQueryVariables>(GetCompanyWithAttributesDocument, options);
        }
export function useGetCompanyWithAttributesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCompanyWithAttributesQuery, GetCompanyWithAttributesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCompanyWithAttributesQuery, GetCompanyWithAttributesQueryVariables>(GetCompanyWithAttributesDocument, options);
        }
export type GetCompanyWithAttributesQueryHookResult = ReturnType<typeof useGetCompanyWithAttributesQuery>;
export type GetCompanyWithAttributesLazyQueryHookResult = ReturnType<typeof useGetCompanyWithAttributesLazyQuery>;
export type GetCompanyWithAttributesSuspenseQueryHookResult = ReturnType<typeof useGetCompanyWithAttributesSuspenseQuery>;
export type GetCompanyWithAttributesQueryResult = Apollo.QueryResult<GetCompanyWithAttributesQuery, GetCompanyWithAttributesQueryVariables>;
export const GetCompanyDocument = gql`
    query getCompany($id: ID!) {
  company(id: $id) {
    address
    channelToken
    name
    website
  }
}
    `;
export function useGetCompanyQuery(baseOptions: Apollo.QueryHookOptions<GetCompanyQuery, GetCompanyQueryVariables> & ({ variables: GetCompanyQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCompanyQuery, GetCompanyQueryVariables>(GetCompanyDocument, options);
      }
export function useGetCompanyLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCompanyQuery, GetCompanyQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCompanyQuery, GetCompanyQueryVariables>(GetCompanyDocument, options);
        }
export function useGetCompanySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCompanyQuery, GetCompanyQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCompanyQuery, GetCompanyQueryVariables>(GetCompanyDocument, options);
        }
export type GetCompanyQueryHookResult = ReturnType<typeof useGetCompanyQuery>;
export type GetCompanyLazyQueryHookResult = ReturnType<typeof useGetCompanyLazyQuery>;
export type GetCompanySuspenseQueryHookResult = ReturnType<typeof useGetCompanySuspenseQuery>;
export type GetCompanyQueryResult = Apollo.QueryResult<GetCompanyQuery, GetCompanyQueryVariables>;
export const UpdateCompanyDocument = gql`
    mutation updateCompany($id: ID!, $input: UpdateCompanyInput!) {
  updateCompany(id: $id, updateCompanyInput: $input) {
    id
    name
    website
    updatedAt
  }
}
    `;
export type UpdateCompanyMutationFn = Apollo.MutationFunction<UpdateCompanyMutation, UpdateCompanyMutationVariables>;
export function useUpdateCompanyMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCompanyMutation, UpdateCompanyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCompanyMutation, UpdateCompanyMutationVariables>(UpdateCompanyDocument, options);
      }
export type UpdateCompanyMutationHookResult = ReturnType<typeof useUpdateCompanyMutation>;
export type UpdateCompanyMutationResult = Apollo.MutationResult<UpdateCompanyMutation>;
export type UpdateCompanyMutationOptions = Apollo.BaseMutationOptions<UpdateCompanyMutation, UpdateCompanyMutationVariables>;
export const UpdateNoteDocument = gql`
    mutation updateNote($noteId: ID!, $input: UpdateCompanyNoteInput!) {
  updateCompanyNote(noteId: $noteId, updateCompanyNoteInput: $input) {
    id
    content
    type
    updatedAt
  }
}
    `;
export type UpdateNoteMutationFn = Apollo.MutationFunction<UpdateNoteMutation, UpdateNoteMutationVariables>;
export function useUpdateNoteMutation(baseOptions?: Apollo.MutationHookOptions<UpdateNoteMutation, UpdateNoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateNoteMutation, UpdateNoteMutationVariables>(UpdateNoteDocument, options);
      }
export type UpdateNoteMutationHookResult = ReturnType<typeof useUpdateNoteMutation>;
export type UpdateNoteMutationResult = Apollo.MutationResult<UpdateNoteMutation>;
export type UpdateNoteMutationOptions = Apollo.BaseMutationOptions<UpdateNoteMutation, UpdateNoteMutationVariables>;
export const CompleteActivityDocument = gql`
    mutation CompleteActivity($id: ID!) {
  completeActivity(id: $id) {
    id
    completedAt
  }
}
    `;
export type CompleteActivityMutationFn = Apollo.MutationFunction<CompleteActivityMutation, CompleteActivityMutationVariables>;
export function useCompleteActivityMutation(baseOptions?: Apollo.MutationHookOptions<CompleteActivityMutation, CompleteActivityMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CompleteActivityMutation, CompleteActivityMutationVariables>(CompleteActivityDocument, options);
      }
export type CompleteActivityMutationHookResult = ReturnType<typeof useCompleteActivityMutation>;
export type CompleteActivityMutationResult = Apollo.MutationResult<CompleteActivityMutation>;
export type CompleteActivityMutationOptions = Apollo.BaseMutationOptions<CompleteActivityMutation, CompleteActivityMutationVariables>;
export const CreateActivityDocument = gql`
    mutation CreateActivity($input: CreateActivityInput!) {
  createActivity(input: $input) {
    id
    createdAt
    type
    subject
    description
    scheduledAt
    completedAt
    leadId
    userId
  }
}
    `;
export type CreateActivityMutationFn = Apollo.MutationFunction<CreateActivityMutation, CreateActivityMutationVariables>;
export function useCreateActivityMutation(baseOptions?: Apollo.MutationHookOptions<CreateActivityMutation, CreateActivityMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateActivityMutation, CreateActivityMutationVariables>(CreateActivityDocument, options);
      }
export type CreateActivityMutationHookResult = ReturnType<typeof useCreateActivityMutation>;
export type CreateActivityMutationResult = Apollo.MutationResult<CreateActivityMutation>;
export type CreateActivityMutationOptions = Apollo.BaseMutationOptions<CreateActivityMutation, CreateActivityMutationVariables>;
export const CreateLeadDocument = gql`
    mutation CreateLead($input: CreateLeadInput!) {
  createLead(createLeadInput: $input) {
    id
    firstName
    lastName
    email
  }
}
    `;
export type CreateLeadMutationFn = Apollo.MutationFunction<CreateLeadMutation, CreateLeadMutationVariables>;
export function useCreateLeadMutation(baseOptions?: Apollo.MutationHookOptions<CreateLeadMutation, CreateLeadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateLeadMutation, CreateLeadMutationVariables>(CreateLeadDocument, options);
      }
export type CreateLeadMutationHookResult = ReturnType<typeof useCreateLeadMutation>;
export type CreateLeadMutationResult = Apollo.MutationResult<CreateLeadMutation>;
export type CreateLeadMutationOptions = Apollo.BaseMutationOptions<CreateLeadMutation, CreateLeadMutationVariables>;
export const CreateNoteDocument = gql`
    mutation CreateNote($leadId: ID!, $content: String!) {
  createNote(leadId: $leadId, content: $content) {
    id
    content
    leadId
    userId
    createdAt
    updatedAt
  }
}
    `;
export type CreateNoteMutationFn = Apollo.MutationFunction<CreateNoteMutation, CreateNoteMutationVariables>;
export function useCreateNoteMutation(baseOptions?: Apollo.MutationHookOptions<CreateNoteMutation, CreateNoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateNoteMutation, CreateNoteMutationVariables>(CreateNoteDocument, options);
      }
export type CreateNoteMutationHookResult = ReturnType<typeof useCreateNoteMutation>;
export type CreateNoteMutationResult = Apollo.MutationResult<CreateNoteMutation>;
export type CreateNoteMutationOptions = Apollo.BaseMutationOptions<CreateNoteMutation, CreateNoteMutationVariables>;
export const DeleteActivityDocument = gql`
    mutation DeleteActivity($id: ID!) {
  deleteActivity(id: $id) {
    id
  }
}
    `;
export type DeleteActivityMutationFn = Apollo.MutationFunction<DeleteActivityMutation, DeleteActivityMutationVariables>;
export function useDeleteActivityMutation(baseOptions?: Apollo.MutationHookOptions<DeleteActivityMutation, DeleteActivityMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteActivityMutation, DeleteActivityMutationVariables>(DeleteActivityDocument, options);
      }
export type DeleteActivityMutationHookResult = ReturnType<typeof useDeleteActivityMutation>;
export type DeleteActivityMutationResult = Apollo.MutationResult<DeleteActivityMutation>;
export type DeleteActivityMutationOptions = Apollo.BaseMutationOptions<DeleteActivityMutation, DeleteActivityMutationVariables>;
export const DeleteLeadDocument = gql`
    mutation DeleteLead($id: ID!) {
  deleteLead(id: $id) {
    id
  }
}
    `;
export type DeleteLeadMutationFn = Apollo.MutationFunction<DeleteLeadMutation, DeleteLeadMutationVariables>;
export function useDeleteLeadMutation(baseOptions?: Apollo.MutationHookOptions<DeleteLeadMutation, DeleteLeadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteLeadMutation, DeleteLeadMutationVariables>(DeleteLeadDocument, options);
      }
export type DeleteLeadMutationHookResult = ReturnType<typeof useDeleteLeadMutation>;
export type DeleteLeadMutationResult = Apollo.MutationResult<DeleteLeadMutation>;
export type DeleteLeadMutationOptions = Apollo.BaseMutationOptions<DeleteLeadMutation, DeleteLeadMutationVariables>;
export const DeleteLeadNoteDocument = gql`
    mutation DeleteLeadNote($id: ID!) {
  deleteNote(id: $id) {
    id
  }
}
    `;
export type DeleteLeadNoteMutationFn = Apollo.MutationFunction<DeleteLeadNoteMutation, DeleteLeadNoteMutationVariables>;
export function useDeleteLeadNoteMutation(baseOptions?: Apollo.MutationHookOptions<DeleteLeadNoteMutation, DeleteLeadNoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteLeadNoteMutation, DeleteLeadNoteMutationVariables>(DeleteLeadNoteDocument, options);
      }
export type DeleteLeadNoteMutationHookResult = ReturnType<typeof useDeleteLeadNoteMutation>;
export type DeleteLeadNoteMutationResult = Apollo.MutationResult<DeleteLeadNoteMutation>;
export type DeleteLeadNoteMutationOptions = Apollo.BaseMutationOptions<DeleteLeadNoteMutation, DeleteLeadNoteMutationVariables>;
export const GetActivitiesCountDocument = gql`
    query GetActivitiesCount($leadId: ID, $userId: ID, $type: String, $startDate: String, $endDate: String, $isCompleted: Boolean, $searchQuery: String, $skip: Int, $take: Int) {
  activitiesCount(
    leadId: $leadId
    userId: $userId
    type: $type
    startDate: $startDate
    endDate: $endDate
    isCompleted: $isCompleted
    searchQuery: $searchQuery
    skip: $skip
    take: $take
  )
}
    `;
export function useGetActivitiesCountQuery(baseOptions?: Apollo.QueryHookOptions<GetActivitiesCountQuery, GetActivitiesCountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetActivitiesCountQuery, GetActivitiesCountQueryVariables>(GetActivitiesCountDocument, options);
      }
export function useGetActivitiesCountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetActivitiesCountQuery, GetActivitiesCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetActivitiesCountQuery, GetActivitiesCountQueryVariables>(GetActivitiesCountDocument, options);
        }
export function useGetActivitiesCountSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetActivitiesCountQuery, GetActivitiesCountQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetActivitiesCountQuery, GetActivitiesCountQueryVariables>(GetActivitiesCountDocument, options);
        }
export type GetActivitiesCountQueryHookResult = ReturnType<typeof useGetActivitiesCountQuery>;
export type GetActivitiesCountLazyQueryHookResult = ReturnType<typeof useGetActivitiesCountLazyQuery>;
export type GetActivitiesCountSuspenseQueryHookResult = ReturnType<typeof useGetActivitiesCountSuspenseQuery>;
export type GetActivitiesCountQueryResult = Apollo.QueryResult<GetActivitiesCountQuery, GetActivitiesCountQueryVariables>;
export const GetActivitiesDocument = gql`
    query GetActivities($leadId: ID, $userId: ID, $type: String, $startDate: String, $endDate: String, $isCompleted: Boolean, $searchQuery: String, $skip: Int, $take: Int) {
  activities(
    leadId: $leadId
    userId: $userId
    type: $type
    startDate: $startDate
    endDate: $endDate
    isCompleted: $isCompleted
    searchQuery: $searchQuery
    skip: $skip
    take: $take
  ) {
    id
    createdAt
    type
    subject
    description
    scheduledAt
    completedAt
    leadId
    userId
  }
}
    `;
export function useGetActivitiesQuery(baseOptions?: Apollo.QueryHookOptions<GetActivitiesQuery, GetActivitiesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetActivitiesQuery, GetActivitiesQueryVariables>(GetActivitiesDocument, options);
      }
export function useGetActivitiesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetActivitiesQuery, GetActivitiesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetActivitiesQuery, GetActivitiesQueryVariables>(GetActivitiesDocument, options);
        }
export function useGetActivitiesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetActivitiesQuery, GetActivitiesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetActivitiesQuery, GetActivitiesQueryVariables>(GetActivitiesDocument, options);
        }
export type GetActivitiesQueryHookResult = ReturnType<typeof useGetActivitiesQuery>;
export type GetActivitiesLazyQueryHookResult = ReturnType<typeof useGetActivitiesLazyQuery>;
export type GetActivitiesSuspenseQueryHookResult = ReturnType<typeof useGetActivitiesSuspenseQuery>;
export type GetActivitiesQueryResult = Apollo.QueryResult<GetActivitiesQuery, GetActivitiesQueryVariables>;
export const GetActivityDocument = gql`
    query GetActivity($id: ID!) {
  activity(id: $id) {
    id
    createdAt
    type
    subject
    description
    scheduledAt
    completedAt
    leadId
    userId
  }
}
    `;
export function useGetActivityQuery(baseOptions: Apollo.QueryHookOptions<GetActivityQuery, GetActivityQueryVariables> & ({ variables: GetActivityQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetActivityQuery, GetActivityQueryVariables>(GetActivityDocument, options);
      }
export function useGetActivityLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetActivityQuery, GetActivityQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetActivityQuery, GetActivityQueryVariables>(GetActivityDocument, options);
        }
export function useGetActivitySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetActivityQuery, GetActivityQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetActivityQuery, GetActivityQueryVariables>(GetActivityDocument, options);
        }
export type GetActivityQueryHookResult = ReturnType<typeof useGetActivityQuery>;
export type GetActivityLazyQueryHookResult = ReturnType<typeof useGetActivityLazyQuery>;
export type GetActivitySuspenseQueryHookResult = ReturnType<typeof useGetActivitySuspenseQuery>;
export type GetActivityQueryResult = Apollo.QueryResult<GetActivityQuery, GetActivityQueryVariables>;
export const GetLeadDetailDocument = gql`
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
    assignedTo {
      id
      name
      email
    }
  }
}
    `;
export function useGetLeadDetailQuery(baseOptions: Apollo.QueryHookOptions<GetLeadDetailQuery, GetLeadDetailQueryVariables> & ({ variables: GetLeadDetailQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLeadDetailQuery, GetLeadDetailQueryVariables>(GetLeadDetailDocument, options);
      }
export function useGetLeadDetailLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLeadDetailQuery, GetLeadDetailQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLeadDetailQuery, GetLeadDetailQueryVariables>(GetLeadDetailDocument, options);
        }
export function useGetLeadDetailSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLeadDetailQuery, GetLeadDetailQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetLeadDetailQuery, GetLeadDetailQueryVariables>(GetLeadDetailDocument, options);
        }
export type GetLeadDetailQueryHookResult = ReturnType<typeof useGetLeadDetailQuery>;
export type GetLeadDetailLazyQueryHookResult = ReturnType<typeof useGetLeadDetailLazyQuery>;
export type GetLeadDetailSuspenseQueryHookResult = ReturnType<typeof useGetLeadDetailSuspenseQuery>;
export type GetLeadDetailQueryResult = Apollo.QueryResult<GetLeadDetailQuery, GetLeadDetailQueryVariables>;
export const GetLeadsDocument = gql`
    query GetLeads($skip: Int, $take: Int, $searchQuery: String, $status: [LeadStatus!], $source: [LeadSource!], $priority: [Priority!], $assignedToId: ID, $startDate: String, $endDate: String, $sortBy: String, $sortOrder: String) {
  leads(
    skip: $skip
    take: $take
    searchQuery: $searchQuery
    status: $status
    source: $source
    priority: $priority
    assignedToId: $assignedToId
    startDate: $startDate
    endDate: $endDate
    sortBy: $sortBy
    sortOrder: $sortOrder
  ) {
    items {
      id
      createdAt
      firstName
      lastName
      email
      company
      status
      source
      productInterest
      priority
      assignedTo {
        id
        name
        email
      }
    }
    totalCount
  }
}
    `;
export function useGetLeadsQuery(baseOptions?: Apollo.QueryHookOptions<GetLeadsQuery, GetLeadsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLeadsQuery, GetLeadsQueryVariables>(GetLeadsDocument, options);
      }
export function useGetLeadsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLeadsQuery, GetLeadsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLeadsQuery, GetLeadsQueryVariables>(GetLeadsDocument, options);
        }
export function useGetLeadsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLeadsQuery, GetLeadsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetLeadsQuery, GetLeadsQueryVariables>(GetLeadsDocument, options);
        }
export type GetLeadsQueryHookResult = ReturnType<typeof useGetLeadsQuery>;
export type GetLeadsLazyQueryHookResult = ReturnType<typeof useGetLeadsLazyQuery>;
export type GetLeadsSuspenseQueryHookResult = ReturnType<typeof useGetLeadsSuspenseQuery>;
export type GetLeadsQueryResult = Apollo.QueryResult<GetLeadsQuery, GetLeadsQueryVariables>;
export const GetNotesCountDocument = gql`
    query GetNotesCount($leadId: ID, $userId: ID, $searchQuery: String) {
  notesCount(leadId: $leadId, userId: $userId, searchQuery: $searchQuery)
}
    `;
export function useGetNotesCountQuery(baseOptions?: Apollo.QueryHookOptions<GetNotesCountQuery, GetNotesCountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetNotesCountQuery, GetNotesCountQueryVariables>(GetNotesCountDocument, options);
      }
export function useGetNotesCountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetNotesCountQuery, GetNotesCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetNotesCountQuery, GetNotesCountQueryVariables>(GetNotesCountDocument, options);
        }
export function useGetNotesCountSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetNotesCountQuery, GetNotesCountQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetNotesCountQuery, GetNotesCountQueryVariables>(GetNotesCountDocument, options);
        }
export type GetNotesCountQueryHookResult = ReturnType<typeof useGetNotesCountQuery>;
export type GetNotesCountLazyQueryHookResult = ReturnType<typeof useGetNotesCountLazyQuery>;
export type GetNotesCountSuspenseQueryHookResult = ReturnType<typeof useGetNotesCountSuspenseQuery>;
export type GetNotesCountQueryResult = Apollo.QueryResult<GetNotesCountQuery, GetNotesCountQueryVariables>;
export const GetNotesDocument = gql`
    query GetNotes($leadId: ID, $userId: ID, $searchQuery: String, $skip: Float, $take: Float) {
  notes(
    leadId: $leadId
    userId: $userId
    searchQuery: $searchQuery
    skip: $skip
    take: $take
  ) {
    items {
      id
      content
      leadId
      userId
      createdAt
      updatedAt
    }
    totalCount
  }
}
    `;
export function useGetNotesQuery(baseOptions?: Apollo.QueryHookOptions<GetNotesQuery, GetNotesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetNotesQuery, GetNotesQueryVariables>(GetNotesDocument, options);
      }
export function useGetNotesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetNotesQuery, GetNotesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetNotesQuery, GetNotesQueryVariables>(GetNotesDocument, options);
        }
export function useGetNotesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetNotesQuery, GetNotesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetNotesQuery, GetNotesQueryVariables>(GetNotesDocument, options);
        }
export type GetNotesQueryHookResult = ReturnType<typeof useGetNotesQuery>;
export type GetNotesLazyQueryHookResult = ReturnType<typeof useGetNotesLazyQuery>;
export type GetNotesSuspenseQueryHookResult = ReturnType<typeof useGetNotesSuspenseQuery>;
export type GetNotesQueryResult = Apollo.QueryResult<GetNotesQuery, GetNotesQueryVariables>;
export const UpdateActivityDocument = gql`
    mutation UpdateActivity($input: UpdateActivityInput!) {
  updateActivity(input: $input) {
    id
    createdAt
    type
    subject
    description
    scheduledAt
    completedAt
    leadId
    userId
  }
}
    `;
export type UpdateActivityMutationFn = Apollo.MutationFunction<UpdateActivityMutation, UpdateActivityMutationVariables>;
export function useUpdateActivityMutation(baseOptions?: Apollo.MutationHookOptions<UpdateActivityMutation, UpdateActivityMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateActivityMutation, UpdateActivityMutationVariables>(UpdateActivityDocument, options);
      }
export type UpdateActivityMutationHookResult = ReturnType<typeof useUpdateActivityMutation>;
export type UpdateActivityMutationResult = Apollo.MutationResult<UpdateActivityMutation>;
export type UpdateActivityMutationOptions = Apollo.BaseMutationOptions<UpdateActivityMutation, UpdateActivityMutationVariables>;
export const UpdateLeadDocument = gql`
    mutation UpdateLead($input: UpdateLeadInput!) {
  updateLead(updateLeadInput: $input) {
    id
    firstName
    lastName
    email
    status
    priority
  }
}
    `;
export type UpdateLeadMutationFn = Apollo.MutationFunction<UpdateLeadMutation, UpdateLeadMutationVariables>;
export function useUpdateLeadMutation(baseOptions?: Apollo.MutationHookOptions<UpdateLeadMutation, UpdateLeadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateLeadMutation, UpdateLeadMutationVariables>(UpdateLeadDocument, options);
      }
export type UpdateLeadMutationHookResult = ReturnType<typeof useUpdateLeadMutation>;
export type UpdateLeadMutationResult = Apollo.MutationResult<UpdateLeadMutation>;
export type UpdateLeadMutationOptions = Apollo.BaseMutationOptions<UpdateLeadMutation, UpdateLeadMutationVariables>;
export const UpdateLeadNoteDocument = gql`
    mutation UpdateLeadNote($id: ID!, $content: String) {
  updateNote(id: $id, content: $content) {
    id
    content
    updatedAt
  }
}
    `;
export type UpdateLeadNoteMutationFn = Apollo.MutationFunction<UpdateLeadNoteMutation, UpdateLeadNoteMutationVariables>;
export function useUpdateLeadNoteMutation(baseOptions?: Apollo.MutationHookOptions<UpdateLeadNoteMutation, UpdateLeadNoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateLeadNoteMutation, UpdateLeadNoteMutationVariables>(UpdateLeadNoteDocument, options);
      }
export type UpdateLeadNoteMutationHookResult = ReturnType<typeof useUpdateLeadNoteMutation>;
export type UpdateLeadNoteMutationResult = Apollo.MutationResult<UpdateLeadNoteMutation>;
export type UpdateLeadNoteMutationOptions = Apollo.BaseMutationOptions<UpdateLeadNoteMutation, UpdateLeadNoteMutationVariables>;
export const GetNotificationsDocument = gql`
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
    `;
export function useGetNotificationsQuery(baseOptions?: Apollo.QueryHookOptions<GetNotificationsQuery, GetNotificationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetNotificationsQuery, GetNotificationsQueryVariables>(GetNotificationsDocument, options);
      }
export function useGetNotificationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetNotificationsQuery, GetNotificationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetNotificationsQuery, GetNotificationsQueryVariables>(GetNotificationsDocument, options);
        }
export function useGetNotificationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetNotificationsQuery, GetNotificationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetNotificationsQuery, GetNotificationsQueryVariables>(GetNotificationsDocument, options);
        }
export type GetNotificationsQueryHookResult = ReturnType<typeof useGetNotificationsQuery>;
export type GetNotificationsLazyQueryHookResult = ReturnType<typeof useGetNotificationsLazyQuery>;
export type GetNotificationsSuspenseQueryHookResult = ReturnType<typeof useGetNotificationsSuspenseQuery>;
export type GetNotificationsQueryResult = Apollo.QueryResult<GetNotificationsQuery, GetNotificationsQueryVariables>;
export const MarkAllAsReadDocument = gql`
    mutation MarkAllAsRead {
  markAllAsRead
}
    `;
export type MarkAllAsReadMutationFn = Apollo.MutationFunction<MarkAllAsReadMutation, MarkAllAsReadMutationVariables>;
export function useMarkAllAsReadMutation(baseOptions?: Apollo.MutationHookOptions<MarkAllAsReadMutation, MarkAllAsReadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MarkAllAsReadMutation, MarkAllAsReadMutationVariables>(MarkAllAsReadDocument, options);
      }
export type MarkAllAsReadMutationHookResult = ReturnType<typeof useMarkAllAsReadMutation>;
export type MarkAllAsReadMutationResult = Apollo.MutationResult<MarkAllAsReadMutation>;
export type MarkAllAsReadMutationOptions = Apollo.BaseMutationOptions<MarkAllAsReadMutation, MarkAllAsReadMutationVariables>;
export const MarkAsReadDocument = gql`
    mutation MarkAsRead($id: ID!) {
  markAsRead(notificationId: $id) {
    id
    isRead
    readAt
  }
}
    `;
export type MarkAsReadMutationFn = Apollo.MutationFunction<MarkAsReadMutation, MarkAsReadMutationVariables>;
export function useMarkAsReadMutation(baseOptions?: Apollo.MutationHookOptions<MarkAsReadMutation, MarkAsReadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MarkAsReadMutation, MarkAsReadMutationVariables>(MarkAsReadDocument, options);
      }
export type MarkAsReadMutationHookResult = ReturnType<typeof useMarkAsReadMutation>;
export type MarkAsReadMutationResult = Apollo.MutationResult<MarkAsReadMutation>;
export type MarkAsReadMutationOptions = Apollo.BaseMutationOptions<MarkAsReadMutation, MarkAsReadMutationVariables>;
export const UnreadCountDocument = gql`
    query UnreadCount {
  unreadCount
}
    `;
export function useUnreadCountQuery(baseOptions?: Apollo.QueryHookOptions<UnreadCountQuery, UnreadCountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UnreadCountQuery, UnreadCountQueryVariables>(UnreadCountDocument, options);
      }
export function useUnreadCountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UnreadCountQuery, UnreadCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UnreadCountQuery, UnreadCountQueryVariables>(UnreadCountDocument, options);
        }
export function useUnreadCountSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<UnreadCountQuery, UnreadCountQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<UnreadCountQuery, UnreadCountQueryVariables>(UnreadCountDocument, options);
        }
export type UnreadCountQueryHookResult = ReturnType<typeof useUnreadCountQuery>;
export type UnreadCountLazyQueryHookResult = ReturnType<typeof useUnreadCountLazyQuery>;
export type UnreadCountSuspenseQueryHookResult = ReturnType<typeof useUnreadCountSuspenseQuery>;
export type UnreadCountQueryResult = Apollo.QueryResult<UnreadCountQuery, UnreadCountQueryVariables>;