// src/app/(dashboard)/error.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@gocrm/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@gocrm/components/ui/alert'
import { Terminal, RefreshCw } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    if (error.name === 'AuthError') {
      console.error(
        'AuthError caught by error boundary, redirecting to login...',
      )
      router.push('/login?session_expired=true')
    } else {
      console.error('Unhandled error caught by boundary:', error)
    }
  }, [error, router])

  return (
    <div className="flex h-[70vh] flex-col items-center justify-center gap-6">
      <Alert variant="destructive" className="max-w-lg">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Beklenmedik Bir Hata Oluştu</AlertTitle>
        <AlertDescription>
          Bir şeyler ters gitti. Lütfen daha sonra tekrar deneyin.
        </AlertDescription>
      </Alert>
      <Button onClick={() => reset()}>
        <RefreshCw className="mr-2 h-4 w-4" />
        Tekrar Dene
      </Button>
    </div>
  )
}
