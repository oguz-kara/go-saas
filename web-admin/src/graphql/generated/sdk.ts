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

export type AttributeWithType = {
  __typename?: 'AttributeWithType';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  value: Scalars['String']['output'];
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
  attributes: Array<AttributeWithType>;
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


export type GetAttributeGroupsQuery = { __typename?: 'Query', attributeGroups: { __typename?: 'AttributeGroupConnection', totalCount: number, items: Array<{ __typename?: 'AttributeGroup', id: string, isSystemDefined: boolean, name: string, code: string }> } };

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

export type GetAttributeTypesQueryVariables = Exact<{
  args?: InputMaybe<ListQueryArgs>;
  includeSystemDefined?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetAttributeTypesQuery = { __typename?: 'Query', attributeTypes: { __typename?: 'AttributeTypeConnection', totalCount: number, items: Array<{ __typename?: 'AttributeType', id: string, name: string, code: string, channelToken: string, kind: AttributeTypeKind, dataType: AttributeDataType, createdAt?: any | null, isSystemDefined: boolean, groupId?: string | null }> } };

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
}>;


export type GetCompaniesWithAttributesQuery = { __typename?: 'Query', companies: { __typename?: 'CompanyConnection', totalCount: number, items: Array<{ __typename?: 'Company', id: string, address?: any | null, channelToken?: string | null, name: string, website?: string | null, createdAt: any, updatedAt: any, deletedAt?: any | null, linkedinUrl?: string | null, attributes: Array<{ __typename?: 'AttributeWithType', id: string, name: string, value: string }> }> } };

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


export type GetCompanyWithAttributesAndNotesQuery = { __typename?: 'Query', company?: { __typename?: 'Company', id: string, address?: any | null, channelToken?: string | null, name: string, website?: string | null, createdAt: any, updatedAt: any, deletedAt?: any | null, linkedinUrl?: string | null, attributes: Array<{ __typename?: 'AttributeWithType', id: string, name: string, value: string }> } | null, companyNotes?: { __typename?: 'CompanyConnectionNotes', totalCount: number, items: Array<{ __typename?: 'CompanyNote', id: string, type?: CompanyNoteType | null, userId: string, companyId: string, content: string, createdAt: any }> } | null };

export type GetCompanyWithAttributesQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetCompanyWithAttributesQuery = { __typename?: 'Query', company?: { __typename?: 'Company', id: string, address?: any | null, channelToken?: string | null, name: string, website?: string | null, createdAt: any, updatedAt: any, deletedAt?: any | null, linkedinUrl?: string | null, attributes: Array<{ __typename?: 'AttributeWithType', id: string, name: string, value: string }> } | null };

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
    query getCompaniesWithAttributes($skip: Int, $take: Int, $filters: [AttributeFilterInput!], $address: String) {
  companies(skip: $skip, take: $take, filters: $filters, address: $address) {
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
        name
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
      name
      value
    }
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
      name
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
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
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
    getAttributeTypes(variables?: GetAttributeTypesQueryVariables, options?: C): Promise<GetAttributeTypesQuery> {
      return requester<GetAttributeTypesQuery, GetAttributeTypesQueryVariables>(GetAttributeTypesDocument, variables, options) as Promise<GetAttributeTypesQuery>;
    },
    getAttributeValues(variables: GetAttributeValuesQueryVariables, options?: C): Promise<GetAttributeValuesQuery> {
      return requester<GetAttributeValuesQuery, GetAttributeValuesQueryVariables>(GetAttributeValuesDocument, variables, options) as Promise<GetAttributeValuesQuery>;
    },
    getAttributeValuesByCode(variables: GetAttributeValuesByCodeQueryVariables, options?: C): Promise<GetAttributeValuesByCodeQuery> {
      return requester<GetAttributeValuesByCodeQuery, GetAttributeValuesByCodeQueryVariables>(GetAttributeValuesByCodeDocument, variables, options) as Promise<GetAttributeValuesByCodeQuery>;
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
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;