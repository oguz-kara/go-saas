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
  createAttributeGroup: AttributeGroup;
  createAttributeType: AttributeType;
  createAttributeValue: AttributeValue;
  createChannel: Channel;
  createCompany: Company;
  deleteAttributeGroup: Scalars['Boolean']['output'];
  deleteAttributeType: Scalars['Boolean']['output'];
  deleteAttributeValue: Scalars['Boolean']['output'];
  deleteCompany: Company;
  deleteCompanyNote: CompanyNote;
  loginUser: AuthenticationPayload;
  logoutUser: LogoutOutput;
  registerNewTenant: AuthenticationPayload;
  registerUser: AuthenticationPayload;
  updateAttributeGroup: AttributeGroup;
  updateAttributeType: AttributeType;
  updateAttributeValue: AttributeValue;
  updateCompany: Company;
  updateCompanyNote: CompanyNote;
};


export type MutationAddNoteToCompanyArgs = {
  addCompanyNoteInput: AddCompanyNoteInput;
  companyId: Scalars['ID']['input'];
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


export type MutationLoginUserArgs = {
  loginUserInput: LoginUserInput;
};


export type MutationRegisterNewTenantArgs = {
  registerNewTenantInput: RegisterNewTenantInput;
};


export type MutationRegisterUserArgs = {
  channelToken: Scalars['String']['input'];
  registerUserInput: RegisterUserInput;
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

export type Query = {
  __typename?: 'Query';
  attributeGroups: AttributeGroupConnection;
  attributeTypes: AttributeTypeConnection;
  attributeValues: AttributeValueConnection;
  attributeValuesByCode: AttributeValueConnection;
  channelByToken?: Maybe<Channel>;
  channels: ChannelConnection;
  companies: CompanyConnection;
  company?: Maybe<Company>;
  companyNotes?: Maybe<CompanyConnectionNotes>;
  me?: Maybe<User>;
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

export type User = {
  __typename?: 'User';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

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


export const CreateAttributeGroupDocument = gql`
    mutation CreateAttributeGroup($input: CreateAttributeGroupInput!) {
  createAttributeGroup(createAttributeGroupInput: $input) {
    id
    name
  }
}
    `;
export type CreateAttributeGroupMutationFn = Apollo.MutationFunction<CreateAttributeGroupMutation, CreateAttributeGroupMutationVariables>;

/**
 * __useCreateAttributeGroupMutation__
 *
 * To run a mutation, you first call `useCreateAttributeGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAttributeGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAttributeGroupMutation, { data, loading, error }] = useCreateAttributeGroupMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useUpdateAttributeGroupMutation__
 *
 * To run a mutation, you first call `useUpdateAttributeGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAttributeGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAttributeGroupMutation, { data, loading, error }] = useUpdateAttributeGroupMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useDeleteAttributeGroupMutation__
 *
 * To run a mutation, you first call `useDeleteAttributeGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAttributeGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAttributeGroupMutation, { data, loading, error }] = useDeleteAttributeGroupMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useGetAttributeGroupsQuery__
 *
 * To run a query within a React component, call `useGetAttributeGroupsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAttributeGroupsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAttributeGroupsQuery({
 *   variables: {
 *      searchQuery: // value for 'searchQuery'
 *      skip: // value for 'skip'
 *      take: // value for 'take'
 *   },
 * });
 */
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

/**
 * __useCreateAttributeTypeMutation__
 *
 * To run a mutation, you first call `useCreateAttributeTypeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAttributeTypeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAttributeTypeMutation, { data, loading, error }] = useCreateAttributeTypeMutation({
 *   variables: {
 *      createAttributeTypeInput: // value for 'createAttributeTypeInput'
 *   },
 * });
 */
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

/**
 * __useUpdateAttributeTypeMutation__
 *
 * To run a mutation, you first call `useUpdateAttributeTypeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAttributeTypeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAttributeTypeMutation, { data, loading, error }] = useUpdateAttributeTypeMutation({
 *   variables: {
 *      id: // value for 'id'
 *      updateAttributeTypeInput: // value for 'updateAttributeTypeInput'
 *   },
 * });
 */
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

/**
 * __useDeleteAttributeTypeMutation__
 *
 * To run a mutation, you first call `useDeleteAttributeTypeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAttributeTypeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAttributeTypeMutation, { data, loading, error }] = useDeleteAttributeTypeMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useCreateAttributeValueMutation__
 *
 * To run a mutation, you first call `useCreateAttributeValueMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAttributeValueMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAttributeValueMutation, { data, loading, error }] = useCreateAttributeValueMutation({
 *   variables: {
 *      createAttributeValueInput: // value for 'createAttributeValueInput'
 *   },
 * });
 */
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

/**
 * __useUpdateAttributeValueMutation__
 *
 * To run a mutation, you first call `useUpdateAttributeValueMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAttributeValueMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAttributeValueMutation, { data, loading, error }] = useUpdateAttributeValueMutation({
 *   variables: {
 *      id: // value for 'id'
 *      updateAttributeValueInput: // value for 'updateAttributeValueInput'
 *   },
 * });
 */
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

/**
 * __useDeleteAttributeValueMutation__
 *
 * To run a mutation, you first call `useDeleteAttributeValueMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAttributeValueMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAttributeValueMutation, { data, loading, error }] = useDeleteAttributeValueMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useGetAttributeArchitectureQuery__
 *
 * To run a query within a React component, call `useGetAttributeArchitectureQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAttributeArchitectureQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAttributeArchitectureQuery({
 *   variables: {
 *      attributeTypesArgs: // value for 'attributeTypesArgs'
 *      attributeTypesIncludeSystemDefined: // value for 'attributeTypesIncludeSystemDefined'
 *      attributeGroupsSearchQuery: // value for 'attributeGroupsSearchQuery'
 *      attributeGroupsTake: // value for 'attributeGroupsTake'
 *      attributeGroupsSkip: // value for 'attributeGroupsSkip'
 *   },
 * });
 */
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

/**
 * __useGetAttributeTypesQuery__
 *
 * To run a query within a React component, call `useGetAttributeTypesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAttributeTypesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAttributeTypesQuery({
 *   variables: {
 *      args: // value for 'args'
 *      includeSystemDefined: // value for 'includeSystemDefined'
 *   },
 * });
 */
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

/**
 * __useGetAttributeValuesQuery__
 *
 * To run a query within a React component, call `useGetAttributeValuesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAttributeValuesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAttributeValuesQuery({
 *   variables: {
 *      attributeTypeId: // value for 'attributeTypeId'
 *      parentId: // value for 'parentId'
 *      skip: // value for 'skip'
 *      take: // value for 'take'
 *      searchQuery: // value for 'searchQuery'
 *   },
 * });
 */
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

/**
 * __useGetAttributeValuesByCodeQuery__
 *
 * To run a query within a React component, call `useGetAttributeValuesByCodeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAttributeValuesByCodeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAttributeValuesByCodeQuery({
 *   variables: {
 *      args: // value for 'args'
 *   },
 * });
 */
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

/**
 * __useLoginUserMutation__
 *
 * To run a mutation, you first call `useLoginUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginUserMutation, { data, loading, error }] = useLoginUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useLogoutUserMutation__
 *
 * To run a mutation, you first call `useLogoutUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutUserMutation, { data, loading, error }] = useLogoutUserMutation({
 *   variables: {
 *   },
 * });
 */
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

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
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

/**
 * __useRegisterNewTenantMutation__
 *
 * To run a mutation, you first call `useRegisterNewTenantMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterNewTenantMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerNewTenantMutation, { data, loading, error }] = useRegisterNewTenantMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useRegisterUserMutation__
 *
 * To run a mutation, you first call `useRegisterUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerUserMutation, { data, loading, error }] = useRegisterUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *      token: // value for 'token'
 *   },
 * });
 */
export function useRegisterUserMutation(baseOptions?: Apollo.MutationHookOptions<RegisterUserMutation, RegisterUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterUserMutation, RegisterUserMutationVariables>(RegisterUserDocument, options);
      }
export type RegisterUserMutationHookResult = ReturnType<typeof useRegisterUserMutation>;
export type RegisterUserMutationResult = Apollo.MutationResult<RegisterUserMutation>;
export type RegisterUserMutationOptions = Apollo.BaseMutationOptions<RegisterUserMutation, RegisterUserMutationVariables>;
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

/**
 * __useCreateChannelMutation__
 *
 * To run a mutation, you first call `useCreateChannelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateChannelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createChannelMutation, { data, loading, error }] = useCreateChannelMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useGetChannelByTokenQuery__
 *
 * To run a query within a React component, call `useGetChannelByTokenQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChannelByTokenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChannelByTokenQuery({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
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

/**
 * __useGetChannelsQuery__
 *
 * To run a query within a React component, call `useGetChannelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChannelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChannelsQuery({
 *   variables: {
 *      skip: // value for 'skip'
 *      take: // value for 'take'
 *   },
 * });
 */
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

/**
 * __useAddNoteMutation__
 *
 * To run a mutation, you first call `useAddNoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddNoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addNoteMutation, { data, loading, error }] = useAddNoteMutation({
 *   variables: {
 *      companyId: // value for 'companyId'
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useCreateCompanyMutation__
 *
 * To run a mutation, you first call `useCreateCompanyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCompanyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCompanyMutation, { data, loading, error }] = useCreateCompanyMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useDeleteNoteMutation__
 *
 * To run a mutation, you first call `useDeleteNoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteNoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteNoteMutation, { data, loading, error }] = useDeleteNoteMutation({
 *   variables: {
 *      noteId: // value for 'noteId'
 *   },
 * });
 */
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

/**
 * __useDeleteCompanyMutation__
 *
 * To run a mutation, you first call `useDeleteCompanyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCompanyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCompanyMutation, { data, loading, error }] = useDeleteCompanyMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useGetCompaniesQuery__
 *
 * To run a query within a React component, call `useGetCompaniesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCompaniesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCompaniesQuery({
 *   variables: {
 *      skip: // value for 'skip'
 *      take: // value for 'take'
 *   },
 * });
 */
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

/**
 * __useGetCompaniesWithAttributesQuery__
 *
 * To run a query within a React component, call `useGetCompaniesWithAttributesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCompaniesWithAttributesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCompaniesWithAttributesQuery({
 *   variables: {
 *      skip: // value for 'skip'
 *      take: // value for 'take'
 *      filters: // value for 'filters'
 *      address: // value for 'address'
 *      searchQuery: // value for 'searchQuery'
 *   },
 * });
 */
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

/**
 * __useCompaniesQuery__
 *
 * To run a query within a React component, call `useCompaniesQuery` and pass it any options that fit your needs.
 * When your component renders, `useCompaniesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCompaniesQuery({
 *   variables: {
 *   },
 * });
 */
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

/**
 * __useGetCompanyDetailQuery__
 *
 * To run a query within a React component, call `useGetCompanyDetailQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCompanyDetailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCompanyDetailQuery({
 *   variables: {
 *      id: // value for 'id'
 *      notesSkip: // value for 'notesSkip'
 *      notesTake: // value for 'notesTake'
 *   },
 * });
 */
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

/**
 * __useGetCompanyNotesQuery__
 *
 * To run a query within a React component, call `useGetCompanyNotesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCompanyNotesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCompanyNotesQuery({
 *   variables: {
 *      companyId: // value for 'companyId'
 *      searchQuery: // value for 'searchQuery'
 *      skip: // value for 'skip'
 *      take: // value for 'take'
 *   },
 * });
 */
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

/**
 * __useGetCompanyWithAttributesAndNotesQuery__
 *
 * To run a query within a React component, call `useGetCompanyWithAttributesAndNotesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCompanyWithAttributesAndNotesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCompanyWithAttributesAndNotesQuery({
 *   variables: {
 *      id: // value for 'id'
 *      searchQuery: // value for 'searchQuery'
 *      skip: // value for 'skip'
 *      take: // value for 'take'
 *   },
 * });
 */
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

/**
 * __useGetCompanyWithAttributesQuery__
 *
 * To run a query within a React component, call `useGetCompanyWithAttributesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCompanyWithAttributesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCompanyWithAttributesQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useGetCompanyQuery__
 *
 * To run a query within a React component, call `useGetCompanyQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCompanyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCompanyQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
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

/**
 * __useUpdateCompanyMutation__
 *
 * To run a mutation, you first call `useUpdateCompanyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCompanyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCompanyMutation, { data, loading, error }] = useUpdateCompanyMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
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

/**
 * __useUpdateNoteMutation__
 *
 * To run a mutation, you first call `useUpdateNoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateNoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateNoteMutation, { data, loading, error }] = useUpdateNoteMutation({
 *   variables: {
 *      noteId: // value for 'noteId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateNoteMutation(baseOptions?: Apollo.MutationHookOptions<UpdateNoteMutation, UpdateNoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateNoteMutation, UpdateNoteMutationVariables>(UpdateNoteDocument, options);
      }
export type UpdateNoteMutationHookResult = ReturnType<typeof useUpdateNoteMutation>;
export type UpdateNoteMutationResult = Apollo.MutationResult<UpdateNoteMutation>;
export type UpdateNoteMutationOptions = Apollo.BaseMutationOptions<UpdateNoteMutation, UpdateNoteMutationVariables>;