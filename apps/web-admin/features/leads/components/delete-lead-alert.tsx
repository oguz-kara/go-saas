'use client'

import { ConfirmDialog } from '@/components/common'
import { useDeleteLeadMutation } from '@/graphql/generated/hooks'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useTranslations } from '@/hooks/use-translations'

export function DeleteLeadAlert({ id, children }: { id: string; children?: React.ReactNode }) {
  const [mutate, { loading }] = useDeleteLeadMutation()
  const router = useRouter()
  const { translations } = useTranslations()

  if (!translations) {
    return null
  }

  const t = translations.deleteDialog
  const tCommon = translations.confirmDialog
  const entityName = translations.entities.lead

  const onConfirm = async () => {
    try {
      await mutate({ variables: { id } })
      toast.success(t.successToast.replace('{{entity}}', entityName))
      router.refresh()
    } catch (e: any) {
      toast.error(e?.message || t.errorToast.replace('{{entity}}', entityName))
    }
  }

  return (
    <ConfirmDialog
      title={t.title.replace('{{entity}}', entityName)}
      description={t.description.replace('{{entity}}', entityName)}
      confirmText={tCommon.delete}
      cancelText={tCommon.cancel}
      onConfirm={onConfirm}
      loading={loading}
      variant="destructive"
    >
      {children}
    </ConfirmDialog>
  )
}


