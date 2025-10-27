import { notFound } from 'next/navigation'
import { sdk } from '@/graphql'
import { withAuthProtection } from '@/lib/auth/with-auth-protection'
import { LeadDetailView } from '@/features/leads/components/lead-detail-view'

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale?: string }>
}) {
  const { id, locale } = (await params) || {}
  const api = sdk(locale)

  const { lead } = await withAuthProtection(async () => {
    const { lead } = await api.GetLeadDetail({ id })
    return { lead }
  })

  if (!lead) {
    notFound()
  }

  return <LeadDetailView lead={lead!} />
}
