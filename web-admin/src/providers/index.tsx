import { AuthProvider } from '@gocrm/app/auth-provider'
import { RoutesProvider } from '@gocrm/contexts/routes-context'
import { TranslationsProvider } from '@gocrm/contexts/translations-context'
import { ApolloProvider } from '@gocrm/lib/apollo/apollo-provider'
import { ThemeProvider } from '@gocrm/components/theme-provider'
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
