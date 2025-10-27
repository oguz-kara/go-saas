import { AuthProvider } from '@/app/auth-provider'
import { RoutesProvider } from '@/contexts/routes-context'
import { TranslationsProvider } from '@/contexts/translations-context'
import { ApolloProvider } from '@/lib/apollo/apollo-provider'
import { ThemeProvider } from '@/components/theme-provider'
import React from 'react'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ApolloProvider>
        <TranslationsProvider>
          <RoutesProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </RoutesProvider>
        </TranslationsProvider>
      </ApolloProvider>
    </AuthProvider>
  )
}
