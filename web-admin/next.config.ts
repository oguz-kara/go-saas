import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_GRAPHQL_API_URL:
      process.env.NEXT_PUBLIC_APP_GRAPHQL_API_URL,
    NEXT_PUBLIC_ADMIN_GRAPHQL_API_URL:
      process.env.NEXT_PUBLIC_ADMIN_GRAPHQL_API_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
}

export default nextConfig
