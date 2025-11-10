import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:5300/admin-api',
  documents: [
    './features/*/gql/documents/**/*.{ts,tsx}',
    './features/*/graphql/**/*.{ts,tsx}',
  ],
  config: {
    dedupeFragments: true,
  },
  generates: {
    './graphql/generated/sdk.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-generic-sdk',
      ],
      config: {
        dedupeOperationSuffix: true,
      },
    },
    './graphql/generated/hooks.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        withComponent: false,
        withHOC: false,
        withHooks: true,
        skipTypename: false,
        exportFragmentSpreadSubTypes: true,
        dedupeFragments: true,
        addDocBlocks: false,
        skipTypeNameForRoot: true,
      },
    },
  },
}
export default config
