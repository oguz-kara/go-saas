'use client'

import { Construction } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { useTranslations } from '@/hooks/use-translations'
import { routes } from '@/lib/routes'

export function ComingSoon() {
  const router = useRouter()
  const { translations } = useTranslations()
  const t = translations?.comingSoon

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 rounded-full bg-primary/10 p-6">
            <Construction className="size-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            {t?.title || 'Coming Soon'}
          </CardTitle>
          <CardDescription className="text-base">
            {t?.description ||
              'This page is currently under development. It will be available soon!'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button onClick={() => router.push(routes.leads.list())}>
            {t?.backToDashboard || 'Back to Dashboard'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}


