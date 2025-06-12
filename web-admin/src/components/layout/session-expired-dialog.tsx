// src/components/layout/session-expired-dialog.tsx
'use client'

import { signOut } from 'next-auth/react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@gocrm/components/ui/alert-dialog'
import { Button } from '@gocrm/components/ui/button'
import { useSessionStore } from '@gocrm/stores/session-store'

const SessionExpiredDialog = () => {
  const { isExpiredDialogOpen, closeExpiredDialog } = useSessionStore()

  const handleLoginRedirect = () => {
    closeExpiredDialog()
    signOut({ callbackUrl: '/login' })
  }

  return (
    <AlertDialog open={isExpiredDialogOpen} onOpenChange={closeExpiredDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Oturum Süresi Doldu</AlertDialogTitle>
          <AlertDialogDescription>
            Güvenliğiniz için oturumunuzun süresi doldu. Devam etmek için lütfen
            tekrar giriş yapın.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction asChild>
            <Button onClick={handleLoginRedirect} className="w-full">
              Giriş Yap
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default SessionExpiredDialog
