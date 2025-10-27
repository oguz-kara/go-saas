'use client'

import { LeadForm } from '@gocrm/features/leads/components/lead-form'
import { useUpdateLeadMutation } from '@gocrm/graphql/generated/hooks'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { routes } from '@gocrm/lib/routes'
import { useTranslations } from '@gocrm/hooks/use-translations'

export function EditLeadClient({
  leadId,
  initial,
}: {
  leadId: string
  initial: any
}) {
  const [mutate, { loading }] = useUpdateLeadMutation()
  const { push } = useRouter()
  const { translations } = useTranslations()
  const t = translations?.leadForm

  async function handleSubmit(values: any) {
    try {
      await mutate({ variables: { input: { id: leadId, ...values } } })
      toast.success(t?.updateSuccess || 'Lead updated successfully')
      push(routes.leads.detail(leadId))
    } catch (e: any) {
      toast.error(e?.message || t?.updateError || 'Failed to update lead')
    }
  }

  return (
    <LeadForm
      onSubmit={handleSubmit}
      isSubmitting={loading}
      initialValues={initial}
    />
  )
}
