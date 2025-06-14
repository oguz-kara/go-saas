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

export type AttributeType = {
  __typename?: 'AttributeType';
  channelToken: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type AttributeTypeConnection = {
  __typename?: 'AttributeTypeConnection';
  items: Array<AttributeType>;
  totalCount: Scalars['Int']['output'];
};

export type AttributeValue = {
  __typename?: 'AttributeValue';
  attributeTypeId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  type: AttributeType;
  value: Scalars['String']['output'];
};

export type AttributeValueConnection = {
  __typename?: 'AttributeValueConnection';
  items: Array<AttributeValue>;
  totalCount: Scalars['Int']['output'];
};

export type AttributeWithType = {
  __typename?: 'AttributeWithType';
  attributeTypeId: Scalars['ID']['output'];
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
  attributes?: Maybe<Array<AttributeWithType>>;
  channelToken?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  industry?: Maybe<Scalars['String']['output']>;
  linkedinUrl?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  notes: CompanyConnectionNotes;
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
  type?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['ID']['output'];
};

export type CreateAttributeInput = {
  attributeTypeId: Scalars['ID']['input'];
  value: Scalars['String']['input'];
};

export type CreateAttributeTypeInput = {
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
  industry?: InputMaybe<Scalars['String']['input']>;
  linkedinUrl?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  website?: InputMaybe<Scalars['String']['input']>;
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
  createAttribute: AttributeValue;
  createAttributeType: AttributeType;
  createChannel: Channel;
  createCompany: Company;
  deleteAttribute: Scalars['Boolean']['output'];
  deleteAttributeType: Scalars['Boolean']['output'];
  deleteCompany: Company;
  deleteCompanyNote: CompanyNote;
  loginUser: AuthenticationPayload;
  logoutUser: LogoutOutput;
  registerNewTenant: AuthenticationPayload;
  registerUser: AuthenticationPayload;
  updateAttribute: AttributeValue;
  updateAttributeType: AttributeType;
  updateCompany: Company;
  updateCompanyNote: CompanyNote;
};


export type MutationAddNoteToCompanyArgs = {
  addCompanyNoteInput: AddCompanyNoteInput;
  companyId: Scalars['ID']['input'];
};


export type MutationCreateAttributeArgs = {
  createAttributeInput: CreateAttributeInput;
};


export type MutationCreateAttributeTypeArgs = {
  createAttributeTypeInput: CreateAttributeTypeInput;
};


export type MutationCreateChannelArgs = {
  createChannelInput: CreateChannelInput;
};


export type MutationCreateCompanyArgs = {
  createCompanyInput: CreateCompanyInput;
};


export type MutationDeleteAttributeArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteAttributeTypeArgs = {
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


export type MutationUpdateAttributeArgs = {
  id: Scalars['ID']['input'];
  updateAttributeInput: UpdateAttributeInput;
};


export type MutationUpdateAttributeTypeArgs = {
  id: Scalars['ID']['input'];
  updateAttributeTypeInput: UpdateAttributeTypeInput;
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
  attributeTypes: AttributeTypeConnection;
  attributeValues: AttributeValueConnection;
  channelByToken?: Maybe<Channel>;
  channels: ChannelConnection;
  companies: CompanyConnection;
  company?: Maybe<Company>;
  companyNotes?: Maybe<CompanyConnectionNotes>;
  me?: Maybe<User>;
};


export type QueryAttributeTypesArgs = {
  args?: InputMaybe<ListQueryArgs>;
};


export type QueryAttributeValuesArgs = {
  attributeTypeId: Scalars['ID']['input'];
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
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
  channelToken?: InputMaybe<Scalars['ID']['input']>;
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

export type UpdateAttributeInput = {
  value: Scalars['String']['input'];
};

export type UpdateAttributeTypeInput = {
  name: Scalars['String']['input'];
};

export type UpdateCompanyInput = {
  address?: InputMaybe<Scalars['JSON']['input']>;
  attributeIds?: InputMaybe<Array<Scalars['String']['input']>>;
  description?: InputMaybe<Scalars['String']['input']>;
  industry?: InputMaybe<Scalars['String']['input']>;
  linkedinUrl?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
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

export type CreateAttributeMutationVariables = Exact<{
  createAttributeInput: CreateAttributeInput;
}>;


export type CreateAttributeMutation = { __typename?: 'Mutation', createAttribute: { __typename?: 'AttributeValue', id: string, value: string, attributeTypeId: string } };

export type UpdateAttributeMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  updateAttributeInput: UpdateAttributeInput;
}>;


export type UpdateAttributeMutation = { __typename?: 'Mutation', updateAttribute: { __typename?: 'AttributeValue', id: string, value: string } };

export type DeleteAttributeMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteAttributeMutation = { __typename?: 'Mutation', deleteAttribute: boolean };

export type CreateAttributeTypeMutationVariables = Exact<{
  createAttributeTypeInput: CreateAttributeTypeInput;
}>;


export type CreateAttributeTypeMutation = { __typename?: 'Mutation', createAttributeType: { __typename?: 'AttributeType', id: string, name: string, channelToken: string, createdAt?: any | null } };

export type GetAttributeTypesQueryVariables = Exact<{
  args?: InputMaybe<ListQueryArgs>;
}>;


export type GetAttributeTypesQuery = { __typename?: 'Query', attributeTypes: { __typename?: 'AttributeTypeConnection', totalCount: number, items: Array<{ __typename?: 'AttributeType', id: string, name: string, channelToken: string, createdAt?: any | null }> } };

export type GetAttributeValuesQueryVariables = Exact<{
  attributeTypeId: Scalars['ID']['input'];
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAttributeValuesQuery = { __typename?: 'Query', attributeValues: { __typename?: 'AttributeValueConnection', totalCount: number, items: Array<{ __typename?: 'AttributeValue', id: string, value: string, attributeTypeId: string }> } };

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


export type AddNoteMutation = { __typename?: 'Mutation', addNoteToCompany: { __typename?: 'CompanyNote', id: string, content: string, companyId: string } };

export type CreateCompanyMutationVariables = Exact<{
  input: CreateCompanyInput;
}>;


export type CreateCompanyMutation = { __typename?: 'Mutation', createCompany: { __typename?: 'Company', id: string, name: string, industry?: string | null, website?: string | null, createdAt: any } };

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


export type GetCompaniesQuery = { __typename?: 'Query', companies: { __typename?: 'CompanyConnection', totalCount: number, items: Array<{ __typename?: 'Company', id: string, name: string, website?: string | null, industry?: string | null, description?: string | null, createdAt: any }> } };

export type GetCompaniesWithAttributesQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetCompaniesWithAttributesQuery = { __typename?: 'Query', companies: { __typename?: 'CompanyConnection', totalCount: number, items: Array<{ __typename?: 'Company', id: string, address?: any | null, channelToken?: string | null, name: string, industry?: string | null, website?: string | null, createdAt: any, updatedAt: any, deletedAt?: any | null, linkedinUrl?: string | null, attributes?: Array<{ __typename?: 'AttributeWithType', id: string, attributeTypeId: string, name: string, value: string }> | null }> } };

export type CompaniesQueryVariables = Exact<{ [key: string]: never; }>;


export type CompaniesQuery = { __typename?: 'Query', companies: { __typename?: 'CompanyConnection', items: Array<{ __typename?: 'Company', name: string, notes: { __typename?: 'CompanyConnectionNotes', totalCount: number, items: Array<{ __typename?: 'CompanyNote', content: string }> } }> } };

export type GetCompanyDetailQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  notesSkip?: InputMaybe<Scalars['Int']['input']>;
  notesTake?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetCompanyDetailQuery = { __typename?: 'Query', company?: { __typename?: 'Company', id: string, name: string, website?: string | null, industry?: string | null, linkedinUrl?: string | null, address?: any | null, description?: string | null, channelToken?: string | null, createdAt: any, updatedAt: any, notes: { __typename?: 'CompanyConnectionNotes', totalCount: number, items: Array<{ __typename?: 'CompanyNote', id: string, content: string, type?: string | null, userId: string, createdAt: any, updatedAt: any }> } } | null };

export type GetCompanyWithAttributesQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetCompanyWithAttributesQuery = { __typename?: 'Query', company?: { __typename?: 'Company', id: string, address?: any | null, channelToken?: string | null, name: string, industry?: string | null, website?: string | null, createdAt: any, updatedAt: any, deletedAt?: any | null, linkedinUrl?: string | null, notes: { __typename?: 'CompanyConnectionNotes', totalCount: number, items: Array<{ __typename?: 'CompanyNote', id: string, content: string, createdAt: any }> }, attributes?: Array<{ __typename?: 'AttributeWithType', id: string, attributeTypeId: string, name: string, value: string }> | null } | null };

export type GetCompanyQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetCompanyQuery = { __typename?: 'Query', company?: { __typename?: 'Company', address?: any | null, channelToken?: string | null, name: string, industry?: string | null, website?: string | null } | null };

export type UpdateCompanyMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateCompanyInput;
}>;


export type UpdateCompanyMutation = { __typename?: 'Mutation', updateCompany: { __typename?: 'Company', id: string, name: string, industry?: string | null, website?: string | null, updatedAt: any } };

export type UpdateNoteMutationVariables = Exact<{
  noteId: Scalars['ID']['input'];
  input: UpdateCompanyNoteInput;
}>;


export type UpdateNoteMutation = { __typename?: 'Mutation', updateCompanyNote: { __typename?: 'CompanyNote', id: string, content: string } };


export const CreateAttributeDocument = gql`
    mutation createAttribute($createAttributeInput: CreateAttributeInput!) {
  createAttribute(createAttributeInput: $createAttributeInput) {
    id
    value
    attributeTypeId
  }
}
    `;
export const UpdateAttributeDocument = gql`
    mutation updateAttribute($id: ID!, $updateAttributeInput: UpdateAttributeInput!) {
  updateAttribute(id: $id, updateAttributeInput: $updateAttributeInput) {
    id
    value
  }
}
    `;
export const DeleteAttributeDocument = gql`
    mutation deleteAttribute($id: ID!) {
  deleteAttribute(id: $id)
}
    `;
export const CreateAttributeTypeDocument = gql`
    mutation createAttributeType($createAttributeTypeInput: CreateAttributeTypeInput!) {
  createAttributeType(createAttributeTypeInput: $createAttributeTypeInput) {
    id
    name
    channelToken
    createdAt
  }
}
    `;
export const GetAttributeTypesDocument = gql`
    query getAttributeTypes($args: ListQueryArgs) {
  attributeTypes(args: $args) {
    items {
      id
      name
      channelToken
      createdAt
    }
    totalCount
  }
}
    `;
export const GetAttributeValuesDocument = gql`
    query getAttributeValues($attributeTypeId: ID!, $skip: Int, $take: Int, $searchQuery: String) {
  attributeValues(
    attributeTypeId: $attributeTypeId
    skip: $skip
    take: $take
    searchQuery: $searchQuery
  ) {
    items {
      id
      value
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
    companyId
  }
}
    `;
export const CreateCompanyDocument = gql`
    mutation createCompany($input: CreateCompanyInput!) {
  createCompany(createCompanyInput: $input) {
    id
    name
    industry
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
      industry
      description
      createdAt
    }
    totalCount
  }
}
    `;
export const GetCompaniesWithAttributesDocument = gql`
    query getCompaniesWithAttributes($skip: Int, $take: Int) {
  companies(skip: $skip, take: $take) {
    items {
      id
      address
      channelToken
      name
      industry
      website
      createdAt
      updatedAt
      deletedAt
      linkedinUrl
      attributes {
        id
        attributeTypeId
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
    industry
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
export const GetCompanyWithAttributesDocument = gql`
    query getCompanyWithAttributes($id: ID!) {
  company(id: $id) {
    id
    address
    channelToken
    name
    industry
    website
    createdAt
    updatedAt
    deletedAt
    linkedinUrl
    notes {
      items {
        id
        content
        createdAt
      }
      totalCount
    }
    attributes {
      id
      attributeTypeId
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
    industry
    website
  }
}
    `;
export const UpdateCompanyDocument = gql`
    mutation updateCompany($id: ID!, $input: UpdateCompanyInput!) {
  updateCompany(id: $id, updateCompanyInput: $input) {
    id
    name
    industry
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
  }
}
    `;
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    createAttribute(variables: CreateAttributeMutationVariables, options?: C): Promise<CreateAttributeMutation> {
      return requester<CreateAttributeMutation, CreateAttributeMutationVariables>(CreateAttributeDocument, variables, options) as Promise<CreateAttributeMutation>;
    },
    updateAttribute(variables: UpdateAttributeMutationVariables, options?: C): Promise<UpdateAttributeMutation> {
      return requester<UpdateAttributeMutation, UpdateAttributeMutationVariables>(UpdateAttributeDocument, variables, options) as Promise<UpdateAttributeMutation>;
    },
    deleteAttribute(variables: DeleteAttributeMutationVariables, options?: C): Promise<DeleteAttributeMutation> {
      return requester<DeleteAttributeMutation, DeleteAttributeMutationVariables>(DeleteAttributeDocument, variables, options) as Promise<DeleteAttributeMutation>;
    },
    createAttributeType(variables: CreateAttributeTypeMutationVariables, options?: C): Promise<CreateAttributeTypeMutation> {
      return requester<CreateAttributeTypeMutation, CreateAttributeTypeMutationVariables>(CreateAttributeTypeDocument, variables, options) as Promise<CreateAttributeTypeMutation>;
    },
    getAttributeTypes(variables?: GetAttributeTypesQueryVariables, options?: C): Promise<GetAttributeTypesQuery> {
      return requester<GetAttributeTypesQuery, GetAttributeTypesQueryVariables>(GetAttributeTypesDocument, variables, options) as Promise<GetAttributeTypesQuery>;
    },
    getAttributeValues(variables: GetAttributeValuesQueryVariables, options?: C): Promise<GetAttributeValuesQuery> {
      return requester<GetAttributeValuesQuery, GetAttributeValuesQueryVariables>(GetAttributeValuesDocument, variables, options) as Promise<GetAttributeValuesQuery>;
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