import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
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


export type CreateApiKeyMutation = { __typename?: 'Mutation', createApiKey: { __typename?: 'GeneratedApiKey', id: string, name: string, prefix: string, plainKey: string, isActive: boolean, createdAt: any, createdBy?: { __typename?: 'User', id: string, email: string, name?: string | null } | null } };

export type ListApiKeysQueryVariables = Exact<{ [key: string]: never; }>;


export type ListApiKeysQuery = { __typename?: 'Query', listApiKeys: Array<{ __typename?: 'ApiKey', id: string, name: string, prefix: string, isActive: boolean, usageCount: number, lastUsedAt?: any | null, lastUsedIp?: string | null, createdAt: any, updatedAt: any, createdBy?: { __typename?: 'User', id: string, email: string, name?: string | null } | null }> };

export type RevokeApiKeyMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RevokeApiKeyMutation = { __typename?: 'Mutation', revokeApiKey: { __typename?: 'ApiKey', id: string, name: string, isActive: boolean } };

export type CreateAttributeGroupMutationVariables = Exact<{
  input: CreateAttributeGroupInput;
}>;


export type CreateAttributeGroupMutation = { __typename?: 'Mutation', createAttributeGroup: { __typename?: 'AttributeGroup', id: string, name: string } };

export type UpdateAttributeGroupMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateAttributeGroupInput;
}>;


export type UpdateAttributeGroupMutation = { __typename?: 'Mutation', updateAttributeGroup: { __typename?: 'AttributeGroup', id: string, name: string } };

export type DeleteAttributeGroupMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteAttributeGroupMutation = { __typename?: 'Mutation', deleteAttributeGroup: boolean };

export type GetAttributeGroupsQueryVariables = Exact<{
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetAttributeGroupsQuery = { __typename?: 'Query', attributeGroups: { __typename?: 'AttributeGroupConnection', totalCount: number, items: Array<{ __typename?: 'AttributeGroup', id: string, isSystemDefined: boolean, name: string, code: string, order?: number | null }> } };

export type CreateAttributeTypeMutationVariables = Exact<{
  createAttributeTypeInput: CreateAttributeTypeInput;
}>;


export type CreateAttributeTypeMutation = { __typename?: 'Mutation', createAttributeType: { __typename?: 'AttributeType', id: string, name: string, kind: AttributeTypeKind, dataType: AttributeDataType, isSystemDefined: boolean, order: number, channelToken: string, createdAt?: any | null } };

export type UpdateAttributeTypeMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  updateAttributeTypeInput: UpdateAttributeTypeInput;
}>;


export type UpdateAttributeTypeMutation = { __typename?: 'Mutation', updateAttributeType: { __typename?: 'AttributeType', id: string, name: string, kind: AttributeTypeKind, dataType: AttributeDataType, isSystemDefined: boolean, order: number, channelToken: string, createdAt?: any | null } };

export type DeleteAttributeTypeMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteAttributeTypeMutation = { __typename?: 'Mutation', deleteAttributeType: boolean };

export type CreateAttributeValueMutationVariables = Exact<{
  createAttributeValueInput: CreateAttributeInput;
}>;


export type CreateAttributeValueMutation = { __typename?: 'Mutation', createAttributeValue: { __typename?: 'AttributeValue', id: string, value: string, attributeTypeId: string } };

export type UpdateAttributeValueMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  updateAttributeValueInput: UpdateAttributeInput;
}>;


export type UpdateAttributeValueMutation = { __typename?: 'Mutation', updateAttributeValue: { __typename?: 'AttributeValue', id: string, value: string } };

export type DeleteAttributeValueMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteAttributeValueMutation = { __typename?: 'Mutation', deleteAttributeValue: boolean };

export type GetAttributeArchitectureQueryVariables = Exact<{
  attributeTypesArgs?: InputMaybe<ListQueryArgs>;
  attributeTypesIncludeSystemDefined?: InputMaybe<Scalars['Boolean']['input']>;
  attributeGroupsSearchQuery?: InputMaybe<Scalars['String']['input']>;
  attributeGroupsTake?: InputMaybe<Scalars['Int']['input']>;
  attributeGroupsSkip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetAttributeArchitectureQuery = { __typename?: 'Query', attributeTypes: { __typename?: 'AttributeTypeConnection', totalCount: number, items: Array<{ __typename?: 'AttributeType', id: string, name: string, code: string, channelToken: string, kind: AttributeTypeKind, dataType: AttributeDataType, createdAt?: any | null, isSystemDefined: boolean, groupId?: string | null, availableFor: Array<AttributableType> }> }, attributeGroups: { __typename?: 'AttributeGroupConnection', totalCount: number, items: Array<{ __typename?: 'AttributeGroup', id: string, isSystemDefined: boolean, name: string, code: string, order?: number | null }> } };

export type GetAttributeTypesQueryVariables = Exact<{
  args?: InputMaybe<ListQueryArgs>;
  includeSystemDefined?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetAttributeTypesQuery = { __typename?: 'Query', attributeTypes: { __typename?: 'AttributeTypeConnection', totalCount: number, items: Array<{ __typename?: 'AttributeType', id: string, name: string, code: string, channelToken: string, kind: AttributeTypeKind, dataType: AttributeDataType, createdAt?: any | null, isSystemDefined: boolean, groupId?: string | null, availableFor: Array<AttributableType> }> } };

export type GetAttributeValuesQueryVariables = Exact<{
  attributeTypeId: Scalars['ID']['input'];
  parentId?: InputMaybe<Scalars['ID']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAttributeValuesQuery = { __typename?: 'Query', attributeValues: { __typename?: 'AttributeValueConnection', totalCount: number, items: Array<{ __typename?: 'AttributeValue', id: string, value: string, code: string, attributeTypeId: string }> } };

export type GetAttributeValuesByCodeQueryVariables = Exact<{
  args: GetAttributeValuesByCodeArgs;
}>;


export type GetAttributeValuesByCodeQuery = { __typename?: 'Query', attributeValuesByCode: { __typename?: 'AttributeValueConnection', totalCount: number, items: Array<{ __typename?: 'AttributeValue', id: string, value: string, code: string, attributeTypeId: string }> } };

export type ChangePasswordMutationVariables = Exact<{
  input: ChangePasswordInput;
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: { __typename?: 'ChangePasswordOutput', success: boolean, message?: string | null } };

export type UsersQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
}>;


export type UsersQuery = { __typename?: 'Query', getUsers: { __typename?: 'UserConnection', totalCount: number, items: Array<{ __typename?: 'User', id: string, name?: string | null, email: string }> } };

export type LoginUserMutationVariables = Exact<{
  input: LoginUserInput;
}>;


export type LoginUserMutation = { __typename?: 'Mutation', loginUser: { __typename?: 'AuthenticationPayload', token: string, user: { __typename?: 'User', id: string, email: string, name?: string | null } } };

export type LogoutUserMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutUserMutation = { __typename?: 'Mutation', logoutUser: { __typename?: 'LogoutOutput', success: boolean } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, email: string, name?: string | null } | null };

export type RegisterNewTenantMutationVariables = Exact<{
  input: RegisterNewTenantInput;
}>;


export type RegisterNewTenantMutation = { __typename?: 'Mutation', registerNewTenant: { __typename?: 'AuthenticationPayload', token: string, user: { __typename?: 'User', id: string, email: string, name?: string | null } } };

export type RegisterUserMutationVariables = Exact<{
  input: RegisterUserInput;
  token: Scalars['String']['input'];
}>;


export type RegisterUserMutation = { __typename?: 'Mutation', registerUser: { __typename?: 'AuthenticationPayload', token: string, user: { __typename?: 'User', email: string } } };

export type UpdateUserProfileMutationVariables = Exact<{
  input: UpdateUserProfileInput;
}>;


export type UpdateUserProfileMutation = { __typename?: 'Mutation', updateUserProfile: { __typename?: 'User', id: string, email: string, name?: string | null, updatedAt?: any | null } };

export type CreateChannelMutationVariables = Exact<{
  input: CreateChannelInput;
}>;


export type CreateChannelMutation = { __typename?: 'Mutation', createChannel: { __typename?: 'Channel', id: string, name: string, token: string, description?: string | null } };

export type GetChannelByTokenQueryVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type GetChannelByTokenQuery = { __typename?: 'Query', channelByToken?: { __typename?: 'Channel', id: string, name: string, token: string } | null };

export type GetChannelsQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetChannelsQuery = { __typename?: 'Query', channels: { __typename?: 'ChannelConnection', totalCount: number, items: Array<{ __typename?: 'Channel', id: string, name: string, token: string }> } };

export type AddNoteMutationVariables = Exact<{
  companyId: Scalars['ID']['input'];
  input: AddCompanyNoteInput;
}>;


export type AddNoteMutation = { __typename?: 'Mutation', addNoteToCompany: { __typename?: 'CompanyNote', id: string, content: string, type?: CompanyNoteType | null, userId: string, createdAt: any, updatedAt: any } };

export type CreateCompanyMutationVariables = Exact<{
  input: CreateCompanyInput;
}>;


export type CreateCompanyMutation = { __typename?: 'Mutation', createCompany: { __typename?: 'Company', id: string, name: string, website?: string | null, createdAt: any } };

export type DeleteNoteMutationVariables = Exact<{
  noteId: Scalars['ID']['input'];
}>;


export type DeleteNoteMutation = { __typename?: 'Mutation', deleteCompanyNote: { __typename?: 'CompanyNote', id: string } };

export type DeleteCompanyMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteCompanyMutation = { __typename?: 'Mutation', deleteCompany: { __typename?: 'Company', id: string, deletedAt?: any | null } };

export type GetCompaniesQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetCompaniesQuery = { __typename?: 'Query', companies: { __typename?: 'CompanyConnection', totalCount: number, items: Array<{ __typename?: 'Company', id: string, name: string, website?: string | null, description?: string | null, createdAt: any }> } };

export type GetCompaniesWithAttributesQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  filters?: InputMaybe<Array<AttributeFilterInput> | AttributeFilterInput>;
  address?: InputMaybe<Scalars['String']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetCompaniesWithAttributesQuery = { __typename?: 'Query', companies: { __typename?: 'CompanyConnection', totalCount: number, items: Array<{ __typename?: 'Company', id: string, address?: any | null, channelToken?: string | null, name: string, website?: string | null, createdAt: any, updatedAt: any, deletedAt?: any | null, linkedinUrl?: string | null, attributes?: Array<{ __typename?: 'AttributeValue', id: string, value: string }> | null }> } };

export type CompaniesQueryVariables = Exact<{ [key: string]: never; }>;


export type CompaniesQuery = { __typename?: 'Query', companies: { __typename?: 'CompanyConnection', items: Array<{ __typename?: 'Company', name: string, notes: { __typename?: 'CompanyConnectionNotes', totalCount: number, items: Array<{ __typename?: 'CompanyNote', content: string }> } }> } };

export type GetCompanyDetailQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  notesSkip?: InputMaybe<Scalars['Int']['input']>;
  notesTake?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetCompanyDetailQuery = { __typename?: 'Query', company?: { __typename?: 'Company', id: string, name: string, website?: string | null, linkedinUrl?: string | null, address?: any | null, description?: string | null, channelToken?: string | null, createdAt: any, updatedAt: any, notes: { __typename?: 'CompanyConnectionNotes', totalCount: number, items: Array<{ __typename?: 'CompanyNote', id: string, content: string, type?: CompanyNoteType | null, userId: string, createdAt: any, updatedAt: any }> } } | null };

export type GetCompanyNotesQueryVariables = Exact<{
  companyId: Scalars['ID']['input'];
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetCompanyNotesQuery = { __typename?: 'Query', companyNotes?: { __typename?: 'CompanyConnectionNotes', totalCount: number, items: Array<{ __typename?: 'CompanyNote', id: string, type?: CompanyNoteType | null, companyId: string, content: string, createdAt: any }> } | null };

export type GetCompanyWithAttributesAndNotesQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetCompanyWithAttributesAndNotesQuery = { __typename?: 'Query', company?: { __typename?: 'Company', id: string, name: string, email?: string | null, website?: string | null, taxId?: string | null, description?: string | null, phoneNumber?: string | null, socialProfiles?: any | null, address?: any | null, addressAttributeCodes?: Array<string> | null, createdAt: any, deletedAt?: any | null, updatedAt: any, attributes?: Array<{ __typename?: 'AttributeValue', id: string, value: string, type?: { __typename?: 'AttributeType', id: string } | null }> | null } | null, companyNotes?: { __typename?: 'CompanyConnectionNotes', totalCount: number, items: Array<{ __typename?: 'CompanyNote', id: string, type?: CompanyNoteType | null, userId: string, companyId: string, content: string, createdAt: any }> } | null };

export type GetCompanyWithAttributesQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetCompanyWithAttributesQuery = { __typename?: 'Query', company?: { __typename?: 'Company', id: string, address?: any | null, channelToken?: string | null, name: string, website?: string | null, createdAt: any, updatedAt: any, deletedAt?: any | null, linkedinUrl?: string | null, attributes?: Array<{ __typename?: 'AttributeValue', id: string, value: string }> | null } | null };

export type GetCompanyQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetCompanyQuery = { __typename?: 'Query', company?: { __typename?: 'Company', address?: any | null, channelToken?: string | null, name: string, website?: string | null } | null };

export type UpdateCompanyMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateCompanyInput;
}>;


export type UpdateCompanyMutation = { __typename?: 'Mutation', updateCompany: { __typename?: 'Company', id: string, name: string, website?: string | null, updatedAt: any } };

export type UpdateNoteMutationVariables = Exact<{
  noteId: Scalars['ID']['input'];
  input: UpdateCompanyNoteInput;
}>;


export type UpdateNoteMutation = { __typename?: 'Mutation', updateCompanyNote: { __typename?: 'CompanyNote', id: string, content: string, type?: CompanyNoteType | null, updatedAt: any } };

export type CompleteActivityMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type CompleteActivityMutation = { __typename?: 'Mutation', completeActivity: { __typename?: 'LeadActivity', id: string, completedAt?: any | null } };

export type CreateActivityMutationVariables = Exact<{
  input: CreateActivityInput;
}>;


export type CreateActivityMutation = { __typename?: 'Mutation', createActivity: { __typename?: 'LeadActivity', id: string, createdAt: any, type: string, subject: string, description?: string | null, scheduledAt?: any | null, completedAt?: any | null, leadId: string, userId: string } };

export type CreateLeadMutationVariables = Exact<{
  input: CreateLeadInput;
}>;


export type CreateLeadMutation = { __typename?: 'Mutation', createLead: { __typename?: 'Lead', id: string, firstName: string, lastName: string, email: string } };

export type CreateNoteMutationVariables = Exact<{
  leadId: Scalars['ID']['input'];
  content: Scalars['String']['input'];
}>;


export type CreateNoteMutation = { __typename?: 'Mutation', createNote: { __typename?: 'LeadNote', id: string, content: string, leadId: string, userId: string, createdAt: any, updatedAt: any } };

export type DeleteActivityMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteActivityMutation = { __typename?: 'Mutation', deleteActivity: { __typename?: 'LeadActivity', id: string } };

export type DeleteLeadMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteLeadMutation = { __typename?: 'Mutation', deleteLead: { __typename?: 'Lead', id: string } };

export type DeleteLeadNoteMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteLeadNoteMutation = { __typename?: 'Mutation', deleteNote: { __typename?: 'LeadNote', id: string } };

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


export type GetActivitiesCountQuery = { __typename?: 'Query', activitiesCount: number };

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


export type GetActivitiesQuery = { __typename?: 'Query', activities: Array<{ __typename?: 'LeadActivity', id: string, createdAt: any, type: string, subject: string, description?: string | null, scheduledAt?: any | null, completedAt?: any | null, leadId: string, userId: string }> };

export type GetActivityQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetActivityQuery = { __typename?: 'Query', activity?: { __typename?: 'LeadActivity', id: string, createdAt: any, type: string, subject: string, description?: string | null, scheduledAt?: any | null, completedAt?: any | null, leadId: string, userId: string } | null };

export type GetLeadDetailQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetLeadDetailQuery = { __typename?: 'Query', lead?: { __typename?: 'Lead', id: string, createdAt: any, updatedAt: any, firstName: string, lastName: string, email: string, phone?: string | null, company?: string | null, jobTitle?: string | null, website?: string | null, status: LeadStatus, source: LeadSource, priority: Priority, productInterest: Array<ProductInterest>, budget?: string | null, timeline?: string | null, companySize?: number | null, isDecisionMaker: boolean, painPoints?: string | null, currentSolution?: string | null, lastContactedAt?: any | null, convertedAt?: any | null, lostReason?: string | null, assignedTo?: { __typename?: 'User', id: string, name?: string | null, email: string } | null } | null };

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


export type GetLeadsQuery = { __typename?: 'Query', leads: { __typename?: 'LeadConnection', totalCount: number, items: Array<{ __typename?: 'Lead', id: string, createdAt: any, firstName: string, lastName: string, email: string, company?: string | null, status: LeadStatus, source: LeadSource, productInterest: Array<ProductInterest>, priority: Priority, assignedTo?: { __typename?: 'User', id: string, name?: string | null, email: string } | null }> } };

export type GetNotesCountQueryVariables = Exact<{
  leadId?: InputMaybe<Scalars['ID']['input']>;
  userId?: InputMaybe<Scalars['ID']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetNotesCountQuery = { __typename?: 'Query', notesCount: number };

export type GetNotesQueryVariables = Exact<{
  leadId?: InputMaybe<Scalars['ID']['input']>;
  userId?: InputMaybe<Scalars['ID']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Float']['input']>;
  take?: InputMaybe<Scalars['Float']['input']>;
}>;


export type GetNotesQuery = { __typename?: 'Query', notes: { __typename?: 'NoteConnection', totalCount: number, items: Array<{ __typename?: 'LeadNote', id: string, content: string, leadId: string, userId: string, createdAt: any, updatedAt: any }> } };

export type UpdateActivityMutationVariables = Exact<{
  input: UpdateActivityInput;
}>;


export type UpdateActivityMutation = { __typename?: 'Mutation', updateActivity: { __typename?: 'LeadActivity', id: string, createdAt: any, type: string, subject: string, description?: string | null, scheduledAt?: any | null, completedAt?: any | null, leadId: string, userId: string } };

export type UpdateLeadMutationVariables = Exact<{
  input: UpdateLeadInput;
}>;


export type UpdateLeadMutation = { __typename?: 'Mutation', updateLead: { __typename?: 'Lead', id: string, firstName: string, lastName: string, email: string, status: LeadStatus, priority: Priority } };

export type UpdateLeadNoteMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  content?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateLeadNoteMutation = { __typename?: 'Mutation', updateNote: { __typename?: 'LeadNote', id: string, content: string, updatedAt: any } };

export type GetNotificationsQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  onlyUnread?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetNotificationsQuery = { __typename?: 'Query', notifications: { __typename?: 'NotificationConnection', totalCount: number, items: Array<{ __typename?: 'Notification', id: string, createdAt: any, type: NotificationType, priority: NotificationPriority, title: string, message: string, isRead: boolean, leadId?: string | null, metadata?: any | null }> } };

export type MarkAllAsReadMutationVariables = Exact<{ [key: string]: never; }>;


export type MarkAllAsReadMutation = { __typename?: 'Mutation', markAllAsRead: number };

export type MarkAsReadMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type MarkAsReadMutation = { __typename?: 'Mutation', markAsRead: { __typename?: 'Notification', id: string, isRead: boolean, readAt?: any | null } };

export type UnreadCountQueryVariables = Exact<{ [key: string]: never; }>;


export type UnreadCountQuery = { __typename?: 'Query', unreadCount: number };


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
export const RevokeApiKeyDocument = gql`
    mutation RevokeApiKey($id: ID!) {
  revokeApiKey(id: $id) {
    id
    name
    isActive
  }
}
    `;
export const CreateAttributeGroupDocument = gql`
    mutation CreateAttributeGroup($input: CreateAttributeGroupInput!) {
  createAttributeGroup(createAttributeGroupInput: $input) {
    id
    name
  }
}
    `;
export const UpdateAttributeGroupDocument = gql`
    mutation UpdateAttributeGroup($id: ID!, $input: UpdateAttributeGroupInput!) {
  updateAttributeGroup(id: $id, updateAttributeGroupInput: $input) {
    id
    name
  }
}
    `;
export const DeleteAttributeGroupDocument = gql`
    mutation DeleteAttributeGroup($id: ID!) {
  deleteAttributeGroup(id: $id)
}
    `;
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
export const DeleteAttributeTypeDocument = gql`
    mutation deleteAttributeType($id: ID!) {
  deleteAttributeType(id: $id)
}
    `;
export const CreateAttributeValueDocument = gql`
    mutation createAttributeValue($createAttributeValueInput: CreateAttributeInput!) {
  createAttributeValue(createAttributeValueInput: $createAttributeValueInput) {
    id
    value
    attributeTypeId
  }
}
    `;
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
export const DeleteAttributeValueDocument = gql`
    mutation deleteAttributeValue($id: ID!) {
  deleteAttributeValue(id: $id)
}
    `;
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
export const ChangePasswordDocument = gql`
    mutation changePassword($input: ChangePasswordInput!) {
  changePassword(input: $input) {
    success
    message
  }
}
    `;
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
export const LogoutUserDocument = gql`
    mutation logoutUser {
  logoutUser {
    success
  }
}
    `;
export const MeDocument = gql`
    query me {
  me {
    id
    email
    name
  }
}
    `;
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
export const GetChannelByTokenDocument = gql`
    query getChannelByToken($token: String!) {
  channelByToken(token: $token) {
    id
    name
    token
  }
}
    `;
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
export const DeleteNoteDocument = gql`
    mutation deleteNote($noteId: ID!) {
  deleteCompanyNote(noteId: $noteId) {
    id
  }
}
    `;
export const DeleteCompanyDocument = gql`
    mutation deleteCompany($id: ID!) {
  deleteCompany(id: $id) {
    id
    deletedAt
  }
}
    `;
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
export const CompleteActivityDocument = gql`
    mutation CompleteActivity($id: ID!) {
  completeActivity(id: $id) {
    id
    completedAt
  }
}
    `;
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
export const DeleteActivityDocument = gql`
    mutation DeleteActivity($id: ID!) {
  deleteActivity(id: $id) {
    id
  }
}
    `;
export const DeleteLeadDocument = gql`
    mutation DeleteLead($id: ID!) {
  deleteLead(id: $id) {
    id
  }
}
    `;
export const DeleteLeadNoteDocument = gql`
    mutation DeleteLeadNote($id: ID!) {
  deleteNote(id: $id) {
    id
  }
}
    `;
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
export const GetNotesCountDocument = gql`
    query GetNotesCount($leadId: ID, $userId: ID, $searchQuery: String) {
  notesCount(leadId: $leadId, userId: $userId, searchQuery: $searchQuery)
}
    `;
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
export const UpdateLeadNoteDocument = gql`
    mutation UpdateLeadNote($id: ID!, $content: String) {
  updateNote(id: $id, content: $content) {
    id
    content
    updatedAt
  }
}
    `;
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
export const MarkAllAsReadDocument = gql`
    mutation MarkAllAsRead {
  markAllAsRead
}
    `;
export const MarkAsReadDocument = gql`
    mutation MarkAsRead($id: ID!) {
  markAsRead(notificationId: $id) {
    id
    isRead
    readAt
  }
}
    `;
export const UnreadCountDocument = gql`
    query UnreadCount {
  unreadCount
}
    `;
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    CreateApiKey(variables: CreateApiKeyMutationVariables, options?: C): Promise<CreateApiKeyMutation> {
      return requester<CreateApiKeyMutation, CreateApiKeyMutationVariables>(CreateApiKeyDocument, variables, options) as Promise<CreateApiKeyMutation>;
    },
    ListApiKeys(variables?: ListApiKeysQueryVariables, options?: C): Promise<ListApiKeysQuery> {
      return requester<ListApiKeysQuery, ListApiKeysQueryVariables>(ListApiKeysDocument, variables, options) as Promise<ListApiKeysQuery>;
    },
    RevokeApiKey(variables: RevokeApiKeyMutationVariables, options?: C): Promise<RevokeApiKeyMutation> {
      return requester<RevokeApiKeyMutation, RevokeApiKeyMutationVariables>(RevokeApiKeyDocument, variables, options) as Promise<RevokeApiKeyMutation>;
    },
    CreateAttributeGroup(variables: CreateAttributeGroupMutationVariables, options?: C): Promise<CreateAttributeGroupMutation> {
      return requester<CreateAttributeGroupMutation, CreateAttributeGroupMutationVariables>(CreateAttributeGroupDocument, variables, options) as Promise<CreateAttributeGroupMutation>;
    },
    UpdateAttributeGroup(variables: UpdateAttributeGroupMutationVariables, options?: C): Promise<UpdateAttributeGroupMutation> {
      return requester<UpdateAttributeGroupMutation, UpdateAttributeGroupMutationVariables>(UpdateAttributeGroupDocument, variables, options) as Promise<UpdateAttributeGroupMutation>;
    },
    DeleteAttributeGroup(variables: DeleteAttributeGroupMutationVariables, options?: C): Promise<DeleteAttributeGroupMutation> {
      return requester<DeleteAttributeGroupMutation, DeleteAttributeGroupMutationVariables>(DeleteAttributeGroupDocument, variables, options) as Promise<DeleteAttributeGroupMutation>;
    },
    getAttributeGroups(variables?: GetAttributeGroupsQueryVariables, options?: C): Promise<GetAttributeGroupsQuery> {
      return requester<GetAttributeGroupsQuery, GetAttributeGroupsQueryVariables>(GetAttributeGroupsDocument, variables, options) as Promise<GetAttributeGroupsQuery>;
    },
    createAttributeType(variables: CreateAttributeTypeMutationVariables, options?: C): Promise<CreateAttributeTypeMutation> {
      return requester<CreateAttributeTypeMutation, CreateAttributeTypeMutationVariables>(CreateAttributeTypeDocument, variables, options) as Promise<CreateAttributeTypeMutation>;
    },
    updateAttributeType(variables: UpdateAttributeTypeMutationVariables, options?: C): Promise<UpdateAttributeTypeMutation> {
      return requester<UpdateAttributeTypeMutation, UpdateAttributeTypeMutationVariables>(UpdateAttributeTypeDocument, variables, options) as Promise<UpdateAttributeTypeMutation>;
    },
    deleteAttributeType(variables: DeleteAttributeTypeMutationVariables, options?: C): Promise<DeleteAttributeTypeMutation> {
      return requester<DeleteAttributeTypeMutation, DeleteAttributeTypeMutationVariables>(DeleteAttributeTypeDocument, variables, options) as Promise<DeleteAttributeTypeMutation>;
    },
    createAttributeValue(variables: CreateAttributeValueMutationVariables, options?: C): Promise<CreateAttributeValueMutation> {
      return requester<CreateAttributeValueMutation, CreateAttributeValueMutationVariables>(CreateAttributeValueDocument, variables, options) as Promise<CreateAttributeValueMutation>;
    },
    updateAttributeValue(variables: UpdateAttributeValueMutationVariables, options?: C): Promise<UpdateAttributeValueMutation> {
      return requester<UpdateAttributeValueMutation, UpdateAttributeValueMutationVariables>(UpdateAttributeValueDocument, variables, options) as Promise<UpdateAttributeValueMutation>;
    },
    deleteAttributeValue(variables: DeleteAttributeValueMutationVariables, options?: C): Promise<DeleteAttributeValueMutation> {
      return requester<DeleteAttributeValueMutation, DeleteAttributeValueMutationVariables>(DeleteAttributeValueDocument, variables, options) as Promise<DeleteAttributeValueMutation>;
    },
    GetAttributeArchitecture(variables?: GetAttributeArchitectureQueryVariables, options?: C): Promise<GetAttributeArchitectureQuery> {
      return requester<GetAttributeArchitectureQuery, GetAttributeArchitectureQueryVariables>(GetAttributeArchitectureDocument, variables, options) as Promise<GetAttributeArchitectureQuery>;
    },
    getAttributeTypes(variables?: GetAttributeTypesQueryVariables, options?: C): Promise<GetAttributeTypesQuery> {
      return requester<GetAttributeTypesQuery, GetAttributeTypesQueryVariables>(GetAttributeTypesDocument, variables, options) as Promise<GetAttributeTypesQuery>;
    },
    getAttributeValues(variables: GetAttributeValuesQueryVariables, options?: C): Promise<GetAttributeValuesQuery> {
      return requester<GetAttributeValuesQuery, GetAttributeValuesQueryVariables>(GetAttributeValuesDocument, variables, options) as Promise<GetAttributeValuesQuery>;
    },
    getAttributeValuesByCode(variables: GetAttributeValuesByCodeQueryVariables, options?: C): Promise<GetAttributeValuesByCodeQuery> {
      return requester<GetAttributeValuesByCodeQuery, GetAttributeValuesByCodeQueryVariables>(GetAttributeValuesByCodeDocument, variables, options) as Promise<GetAttributeValuesByCodeQuery>;
    },
    changePassword(variables: ChangePasswordMutationVariables, options?: C): Promise<ChangePasswordMutation> {
      return requester<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument, variables, options) as Promise<ChangePasswordMutation>;
    },
    Users(variables?: UsersQueryVariables, options?: C): Promise<UsersQuery> {
      return requester<UsersQuery, UsersQueryVariables>(UsersDocument, variables, options) as Promise<UsersQuery>;
    },
    loginUser(variables: LoginUserMutationVariables, options?: C): Promise<LoginUserMutation> {
      return requester<LoginUserMutation, LoginUserMutationVariables>(LoginUserDocument, variables, options) as Promise<LoginUserMutation>;
    },
    logoutUser(variables?: LogoutUserMutationVariables, options?: C): Promise<LogoutUserMutation> {
      return requester<LogoutUserMutation, LogoutUserMutationVariables>(LogoutUserDocument, variables, options) as Promise<LogoutUserMutation>;
    },
    me(variables?: MeQueryVariables, options?: C): Promise<MeQuery> {
      return requester<MeQuery, MeQueryVariables>(MeDocument, variables, options) as Promise<MeQuery>;
    },
    registerNewTenant(variables: RegisterNewTenantMutationVariables, options?: C): Promise<RegisterNewTenantMutation> {
      return requester<RegisterNewTenantMutation, RegisterNewTenantMutationVariables>(RegisterNewTenantDocument, variables, options) as Promise<RegisterNewTenantMutation>;
    },
    registerUser(variables: RegisterUserMutationVariables, options?: C): Promise<RegisterUserMutation> {
      return requester<RegisterUserMutation, RegisterUserMutationVariables>(RegisterUserDocument, variables, options) as Promise<RegisterUserMutation>;
    },
    updateUserProfile(variables: UpdateUserProfileMutationVariables, options?: C): Promise<UpdateUserProfileMutation> {
      return requester<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>(UpdateUserProfileDocument, variables, options) as Promise<UpdateUserProfileMutation>;
    },
    createChannel(variables: CreateChannelMutationVariables, options?: C): Promise<CreateChannelMutation> {
      return requester<CreateChannelMutation, CreateChannelMutationVariables>(CreateChannelDocument, variables, options) as Promise<CreateChannelMutation>;
    },
    getChannelByToken(variables: GetChannelByTokenQueryVariables, options?: C): Promise<GetChannelByTokenQuery> {
      return requester<GetChannelByTokenQuery, GetChannelByTokenQueryVariables>(GetChannelByTokenDocument, variables, options) as Promise<GetChannelByTokenQuery>;
    },
    getChannels(variables?: GetChannelsQueryVariables, options?: C): Promise<GetChannelsQuery> {
      return requester<GetChannelsQuery, GetChannelsQueryVariables>(GetChannelsDocument, variables, options) as Promise<GetChannelsQuery>;
    },
    addNote(variables: AddNoteMutationVariables, options?: C): Promise<AddNoteMutation> {
      return requester<AddNoteMutation, AddNoteMutationVariables>(AddNoteDocument, variables, options) as Promise<AddNoteMutation>;
    },
    createCompany(variables: CreateCompanyMutationVariables, options?: C): Promise<CreateCompanyMutation> {
      return requester<CreateCompanyMutation, CreateCompanyMutationVariables>(CreateCompanyDocument, variables, options) as Promise<CreateCompanyMutation>;
    },
    deleteNote(variables: DeleteNoteMutationVariables, options?: C): Promise<DeleteNoteMutation> {
      return requester<DeleteNoteMutation, DeleteNoteMutationVariables>(DeleteNoteDocument, variables, options) as Promise<DeleteNoteMutation>;
    },
    deleteCompany(variables: DeleteCompanyMutationVariables, options?: C): Promise<DeleteCompanyMutation> {
      return requester<DeleteCompanyMutation, DeleteCompanyMutationVariables>(DeleteCompanyDocument, variables, options) as Promise<DeleteCompanyMutation>;
    },
    getCompanies(variables?: GetCompaniesQueryVariables, options?: C): Promise<GetCompaniesQuery> {
      return requester<GetCompaniesQuery, GetCompaniesQueryVariables>(GetCompaniesDocument, variables, options) as Promise<GetCompaniesQuery>;
    },
    getCompaniesWithAttributes(variables?: GetCompaniesWithAttributesQueryVariables, options?: C): Promise<GetCompaniesWithAttributesQuery> {
      return requester<GetCompaniesWithAttributesQuery, GetCompaniesWithAttributesQueryVariables>(GetCompaniesWithAttributesDocument, variables, options) as Promise<GetCompaniesWithAttributesQuery>;
    },
    companies(variables?: CompaniesQueryVariables, options?: C): Promise<CompaniesQuery> {
      return requester<CompaniesQuery, CompaniesQueryVariables>(CompaniesDocument, variables, options) as Promise<CompaniesQuery>;
    },
    getCompanyDetail(variables: GetCompanyDetailQueryVariables, options?: C): Promise<GetCompanyDetailQuery> {
      return requester<GetCompanyDetailQuery, GetCompanyDetailQueryVariables>(GetCompanyDetailDocument, variables, options) as Promise<GetCompanyDetailQuery>;
    },
    getCompanyNotes(variables: GetCompanyNotesQueryVariables, options?: C): Promise<GetCompanyNotesQuery> {
      return requester<GetCompanyNotesQuery, GetCompanyNotesQueryVariables>(GetCompanyNotesDocument, variables, options) as Promise<GetCompanyNotesQuery>;
    },
    getCompanyWithAttributesAndNotes(variables: GetCompanyWithAttributesAndNotesQueryVariables, options?: C): Promise<GetCompanyWithAttributesAndNotesQuery> {
      return requester<GetCompanyWithAttributesAndNotesQuery, GetCompanyWithAttributesAndNotesQueryVariables>(GetCompanyWithAttributesAndNotesDocument, variables, options) as Promise<GetCompanyWithAttributesAndNotesQuery>;
    },
    getCompanyWithAttributes(variables: GetCompanyWithAttributesQueryVariables, options?: C): Promise<GetCompanyWithAttributesQuery> {
      return requester<GetCompanyWithAttributesQuery, GetCompanyWithAttributesQueryVariables>(GetCompanyWithAttributesDocument, variables, options) as Promise<GetCompanyWithAttributesQuery>;
    },
    getCompany(variables: GetCompanyQueryVariables, options?: C): Promise<GetCompanyQuery> {
      return requester<GetCompanyQuery, GetCompanyQueryVariables>(GetCompanyDocument, variables, options) as Promise<GetCompanyQuery>;
    },
    updateCompany(variables: UpdateCompanyMutationVariables, options?: C): Promise<UpdateCompanyMutation> {
      return requester<UpdateCompanyMutation, UpdateCompanyMutationVariables>(UpdateCompanyDocument, variables, options) as Promise<UpdateCompanyMutation>;
    },
    updateNote(variables: UpdateNoteMutationVariables, options?: C): Promise<UpdateNoteMutation> {
      return requester<UpdateNoteMutation, UpdateNoteMutationVariables>(UpdateNoteDocument, variables, options) as Promise<UpdateNoteMutation>;
    },
    CompleteActivity(variables: CompleteActivityMutationVariables, options?: C): Promise<CompleteActivityMutation> {
      return requester<CompleteActivityMutation, CompleteActivityMutationVariables>(CompleteActivityDocument, variables, options) as Promise<CompleteActivityMutation>;
    },
    CreateActivity(variables: CreateActivityMutationVariables, options?: C): Promise<CreateActivityMutation> {
      return requester<CreateActivityMutation, CreateActivityMutationVariables>(CreateActivityDocument, variables, options) as Promise<CreateActivityMutation>;
    },
    CreateLead(variables: CreateLeadMutationVariables, options?: C): Promise<CreateLeadMutation> {
      return requester<CreateLeadMutation, CreateLeadMutationVariables>(CreateLeadDocument, variables, options) as Promise<CreateLeadMutation>;
    },
    CreateNote(variables: CreateNoteMutationVariables, options?: C): Promise<CreateNoteMutation> {
      return requester<CreateNoteMutation, CreateNoteMutationVariables>(CreateNoteDocument, variables, options) as Promise<CreateNoteMutation>;
    },
    DeleteActivity(variables: DeleteActivityMutationVariables, options?: C): Promise<DeleteActivityMutation> {
      return requester<DeleteActivityMutation, DeleteActivityMutationVariables>(DeleteActivityDocument, variables, options) as Promise<DeleteActivityMutation>;
    },
    DeleteLead(variables: DeleteLeadMutationVariables, options?: C): Promise<DeleteLeadMutation> {
      return requester<DeleteLeadMutation, DeleteLeadMutationVariables>(DeleteLeadDocument, variables, options) as Promise<DeleteLeadMutation>;
    },
    DeleteLeadNote(variables: DeleteLeadNoteMutationVariables, options?: C): Promise<DeleteLeadNoteMutation> {
      return requester<DeleteLeadNoteMutation, DeleteLeadNoteMutationVariables>(DeleteLeadNoteDocument, variables, options) as Promise<DeleteLeadNoteMutation>;
    },
    GetActivitiesCount(variables?: GetActivitiesCountQueryVariables, options?: C): Promise<GetActivitiesCountQuery> {
      return requester<GetActivitiesCountQuery, GetActivitiesCountQueryVariables>(GetActivitiesCountDocument, variables, options) as Promise<GetActivitiesCountQuery>;
    },
    GetActivities(variables?: GetActivitiesQueryVariables, options?: C): Promise<GetActivitiesQuery> {
      return requester<GetActivitiesQuery, GetActivitiesQueryVariables>(GetActivitiesDocument, variables, options) as Promise<GetActivitiesQuery>;
    },
    GetActivity(variables: GetActivityQueryVariables, options?: C): Promise<GetActivityQuery> {
      return requester<GetActivityQuery, GetActivityQueryVariables>(GetActivityDocument, variables, options) as Promise<GetActivityQuery>;
    },
    GetLeadDetail(variables: GetLeadDetailQueryVariables, options?: C): Promise<GetLeadDetailQuery> {
      return requester<GetLeadDetailQuery, GetLeadDetailQueryVariables>(GetLeadDetailDocument, variables, options) as Promise<GetLeadDetailQuery>;
    },
    GetLeads(variables?: GetLeadsQueryVariables, options?: C): Promise<GetLeadsQuery> {
      return requester<GetLeadsQuery, GetLeadsQueryVariables>(GetLeadsDocument, variables, options) as Promise<GetLeadsQuery>;
    },
    GetNotesCount(variables?: GetNotesCountQueryVariables, options?: C): Promise<GetNotesCountQuery> {
      return requester<GetNotesCountQuery, GetNotesCountQueryVariables>(GetNotesCountDocument, variables, options) as Promise<GetNotesCountQuery>;
    },
    GetNotes(variables?: GetNotesQueryVariables, options?: C): Promise<GetNotesQuery> {
      return requester<GetNotesQuery, GetNotesQueryVariables>(GetNotesDocument, variables, options) as Promise<GetNotesQuery>;
    },
    UpdateActivity(variables: UpdateActivityMutationVariables, options?: C): Promise<UpdateActivityMutation> {
      return requester<UpdateActivityMutation, UpdateActivityMutationVariables>(UpdateActivityDocument, variables, options) as Promise<UpdateActivityMutation>;
    },
    UpdateLead(variables: UpdateLeadMutationVariables, options?: C): Promise<UpdateLeadMutation> {
      return requester<UpdateLeadMutation, UpdateLeadMutationVariables>(UpdateLeadDocument, variables, options) as Promise<UpdateLeadMutation>;
    },
    UpdateLeadNote(variables: UpdateLeadNoteMutationVariables, options?: C): Promise<UpdateLeadNoteMutation> {
      return requester<UpdateLeadNoteMutation, UpdateLeadNoteMutationVariables>(UpdateLeadNoteDocument, variables, options) as Promise<UpdateLeadNoteMutation>;
    },
    GetNotifications(variables?: GetNotificationsQueryVariables, options?: C): Promise<GetNotificationsQuery> {
      return requester<GetNotificationsQuery, GetNotificationsQueryVariables>(GetNotificationsDocument, variables, options) as Promise<GetNotificationsQuery>;
    },
    MarkAllAsRead(variables?: MarkAllAsReadMutationVariables, options?: C): Promise<MarkAllAsReadMutation> {
      return requester<MarkAllAsReadMutation, MarkAllAsReadMutationVariables>(MarkAllAsReadDocument, variables, options) as Promise<MarkAllAsReadMutation>;
    },
    MarkAsRead(variables: MarkAsReadMutationVariables, options?: C): Promise<MarkAsReadMutation> {
      return requester<MarkAsReadMutation, MarkAsReadMutationVariables>(MarkAsReadDocument, variables, options) as Promise<MarkAsReadMutation>;
    },
    UnreadCount(variables?: UnreadCountQueryVariables, options?: C): Promise<UnreadCountQuery> {
      return requester<UnreadCountQuery, UnreadCountQueryVariables>(UnreadCountDocument, variables, options) as Promise<UnreadCountQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;