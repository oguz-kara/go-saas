import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_GRAPHQL_API_URL:
      process.env.NEXT_PUBLIC_APP_GRAPHQL_API_URL,
    NEXT_PUBLIC_ADMIN_GRAPHQL_API_URL:
      process.env.NEXT_PUBLIC_ADMIN_GRAPHQL_API_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
  transpilePackages: ['zod', '@hookform/resolvers'],
  // Temporarily remove standalone output to avoid Windows symlink issues
  // To re-enable after running PowerShell as Administrator or enabling Developer Mode
  // output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig