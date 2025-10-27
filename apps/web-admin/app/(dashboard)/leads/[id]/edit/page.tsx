import { EditLeadClient } from '@/features/leads/components/edit-lead-client'
import { sdk } from '@/graphql'
import { notFound } from 'next/navigation'

export default async function EditLeadPage({
  params,
}: {
  params: Promise<{ id: string; locale?: string }>
}) {
  const { id, locale } = (await params) || {}
  const api = sdk(locale)
  const { lead } = await api.GetLeadDetail({ id })

  if (!lead) notFound()
  return (
    <EditLeadClient
      leadId={id}
      initial={{ ...lead, assignedToId: lead.assignedTo?.id }}
    />
  )
}
