/**
 * ConfirmDialog Component - Usage Examples
 * 
 * A reusable confirmation dialog component for various actions like delete, archive, etc.
 */

import { ConfirmDialog } from './confirm-dialog'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useTranslations } from '@/hooks/use-translations'
import { toast } from 'sonner'

// ==========================================
// Example 1: Delete Company
// ==========================================
export function DeleteCompanyExample({ id }: { id: string }) {
  const { translations } = useTranslations()
  
  if (!translations) return null
  
  const t = translations.deleteDialog
  const tCommon = translations.confirmDialog
  const entityName = translations.entities.company

  const handleDelete = async () => {
    // Your delete mutation here
    toast.success(t.successToast.replace('{{entity}}', entityName))
  }

  return (
    <ConfirmDialog
      title={t.title.replace('{{entity}}', entityName)}
      description={t.description.replace('{{entity}}', entityName)}
      confirmText={tCommon.delete}
      cancelText={tCommon.cancel}
      onConfirm={handleDelete}
      variant="destructive"
    >
      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
        Delete Company
      </DropdownMenuItem>
    </ConfirmDialog>
  )
}

// ==========================================
// Example 2: Custom Confirmation Dialog
// ==========================================
export function ArchiveUserExample({ id }: { id: string }) {
  const { translations } = useTranslations()
  
  if (!translations) return null

  const handleArchive = async () => {
    // Your archive mutation here
    toast.success('User archived successfully')
  }

  return (
    <ConfirmDialog
      title="Archive User?"
      description="This user will be moved to the archive. You can restore them later."
      confirmText="Archive"
      cancelText={translations.confirmDialog.cancel}
      onConfirm={handleArchive}
      variant="default"
    >
      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
        Archive
      </DropdownMenuItem>
    </ConfirmDialog>
  )
}

// ==========================================
// Example 3: With Loading State
// ==========================================
export function DeleteNoteExample({ id, loading }: { id: string; loading: boolean }) {
  const { translations } = useTranslations()
  
  if (!translations) return null
  
  const t = translations.deleteDialog
  const tCommon = translations.confirmDialog
  const entityName = translations.entities.note

  const handleDelete = async () => {
    // Your delete mutation here
  }

  return (
    <ConfirmDialog
      title={t.title.replace('{{entity}}', entityName)}
      description={t.description.replace('{{entity}}', entityName)}
      confirmText={tCommon.delete}
      cancelText={tCommon.cancel}
      onConfirm={handleDelete}
      loading={loading} // Pass loading state from mutation
      variant="destructive"
    >
      <button>Delete Note</button>
    </ConfirmDialog>
  )
}

// ==========================================
// Adding New Entity Types
// ==========================================
/**
 * To add support for a new entity type:
 * 
 * 1. Add the entity name to web-admin/src/lib/i18n/tr.ts:
 * 
 *    entities: {
 *      lead: 'Lead',
 *      company: 'Şirket',
 *      newEntity: 'Yeni Varlık', // Add here
 *    }
 * 
 * 2. Use the ConfirmDialog component:
 * 
 *    const entityName = translations.entities.newEntity
 *    
 *    <ConfirmDialog
 *      title={t.title.replace('{{entity}}', entityName)}
 *      description={t.description.replace('{{entity}}', entityName)}
 *      confirmText={tCommon.delete}
 *      cancelText={tCommon.cancel}
 *      onConfirm={handleDelete}
 *      variant="destructive"
 *    >
 *      {children}
 *    </ConfirmDialog>
 */

