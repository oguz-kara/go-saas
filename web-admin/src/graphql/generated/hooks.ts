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
export type CreateAttributeMutationFn = Apollo.MutationFunction<CreateAttributeMutation, CreateAttributeMutationVariables>;

/**
 * __useCreateAttributeMutation__
 *
 * To run a mutation, you first call `useCreateAttributeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAttributeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAttributeMutation, { data, loading, error }] = useCreateAttributeMutation({
 *   variables: {
 *      createAttributeInput: // value for 'createAttributeInput'
 *   },
 * });
 */
export function useCreateAttributeMutation(baseOptions?: Apollo.MutationHookOptions<CreateAttributeMutation, CreateAttributeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAttributeMutation, CreateAttributeMutationVariables>(CreateAttributeDocument, options);
      }
export type CreateAttributeMutationHookResult = ReturnType<typeof useCreateAttributeMutation>;
export type CreateAttributeMutationResult = Apollo.MutationResult<CreateAttributeMutation>;
export type CreateAttributeMutationOptions = Apollo.BaseMutationOptions<CreateAttributeMutation, CreateAttributeMutationVariables>;
export const UpdateAttributeDocument = gql`
    mutation updateAttribute($id: ID!, $updateAttributeInput: UpdateAttributeInput!) {
  updateAttribute(id: $id, updateAttributeInput: $updateAttributeInput) {
    id
    value
  }
}
    `;
export type UpdateAttributeMutationFn = Apollo.MutationFunction<UpdateAttributeMutation, UpdateAttributeMutationVariables>;

/**
 * __useUpdateAttributeMutation__
 *
 * To run a mutation, you first call `useUpdateAttributeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAttributeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAttributeMutation, { data, loading, error }] = useUpdateAttributeMutation({
 *   variables: {
 *      id: // value for 'id'
 *      updateAttributeInput: // value for 'updateAttributeInput'
 *   },
 * });
 */
export function useUpdateAttributeMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAttributeMutation, UpdateAttributeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAttributeMutation, UpdateAttributeMutationVariables>(UpdateAttributeDocument, options);
      }
export type UpdateAttributeMutationHookResult = ReturnType<typeof useUpdateAttributeMutation>;
export type UpdateAttributeMutationResult = Apollo.MutationResult<UpdateAttributeMutation>;
export type UpdateAttributeMutationOptions = Apollo.BaseMutationOptions<UpdateAttributeMutation, UpdateAttributeMutationVariables>;
export const DeleteAttributeDocument = gql`
    mutation deleteAttribute($id: ID!) {
  deleteAttribute(id: $id)
}
    `;
export type DeleteAttributeMutationFn = Apollo.MutationFunction<DeleteAttributeMutation, DeleteAttributeMutationVariables>;

/**
 * __useDeleteAttributeMutation__
 *
 * To run a mutation, you first call `useDeleteAttributeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAttributeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAttributeMutation, { data, loading, error }] = useDeleteAttributeMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteAttributeMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAttributeMutation, DeleteAttributeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAttributeMutation, DeleteAttributeMutationVariables>(DeleteAttributeDocument, options);
      }
export type DeleteAttributeMutationHookResult = ReturnType<typeof useDeleteAttributeMutation>;
export type DeleteAttributeMutationResult = Apollo.MutationResult<DeleteAttributeMutation>;
export type DeleteAttributeMutationOptions = Apollo.BaseMutationOptions<DeleteAttributeMutation, DeleteAttributeMutationVariables>;
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
    companyId
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
    industry
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
      industry
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
    industry
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
    industry
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