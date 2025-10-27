'use client'
import { LeadForm } from '@gocrm/features/leads/components/lead-form'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useCreateLeadMutation } from '@gocrm/graphql/generated/hooks'
import { routes } from '@gocrm/lib/routes'
import { useTranslations } from '@gocrm/hooks/use-translations'

export default function NewLeadPage() {
  return <LeadFormWrapper />
}

function LeadFormWrapper() {
  const { push } = useRouter()
  const [mutate, { loading }] = useCreateLeadMutation()
  const { translations } = useTranslations()
  const t = translations?.leadForm

  async function handleSubmit(values: any) {
    try {
      const { data } = await mutate({ variables: { input: values } })
      if (!data?.createLead.id) {
        throw new Error(t?.createError || 'Failed to create lead')
      }
      toast.success(t?.createSuccess || 'Lead created successfully')
      push(routes.leads.detail(data.createLead.id))
    } catch (e: any) {
      toast.error(e?.message || t?.createError || 'Failed to create lead')
    }
  }

  return <LeadForm onSubmit={handleSubmit} isSubmitting={loading} />
}
