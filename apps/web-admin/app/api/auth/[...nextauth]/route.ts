// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { GraphQLClient } from 'graphql-request'
import { loginMutationGql } from '@/features/auth/gql/documents/login.mutation-gql'
import { LoginUserMutation } from '@/graphql/generated/hooks'
import { routes } from '@/lib/routes'

type User = {
  id: string
  email: string
  accessToken: string
}

const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const authApiClient = new GraphQLClient(
          process.env.NEXT_PUBLIC_ADMIN_GRAPHQL_API_URL ||
            'http://localhost:5000/admin-api',
        )

        try {
          const data = await authApiClient.request<LoginUserMutation>(
            loginMutationGql,
            {
              input: {
                email: credentials.email,
                password: credentials.password,
              },
            },
          )

          const loginResult = data.loginUser
          if (loginResult && loginResult.token) {
            return {
              id: loginResult.user.id,
              name: loginResult.user.name,
              email: loginResult.user.email,
              accessToken: loginResult.token,
            }
          }
          return null
        } catch (error) {
          console.error('Authorize error:', error)
          // Hata durumunda null dönerek login işleminin başarısız olduğunu belirtiyoruz.
          return null
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt', // Session yönetimi için JWT stratejisini kullanıyoruz
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as User)?.accessToken
        token.id = (user as User)?.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        const newSession = {
          ...session,
          user: {
            ...session.user,
            id: token.id as string,
            email: token.email as string,
          },
          accessToken: token.accessToken as string | undefined,
        }
        return newSession
      }
      return session
    },
  },
  pages: {
    signIn: routes.login(),
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
