// src/features/attributes/components/create-attribute-group-form.tsx
'use client'

import { useState } from 'react'
import { useCreateAttributeGroupMutation } from '@gocrm/graphql/generated/hooks'
import { toast } from 'sonner'
import { Input } from '@gocrm/components/ui/input'
import { Button } from '@gocrm/components/ui/button'
import { PlusCircle, Loader2 } from 'lucide-react'
import { GET_ATTRIBUTE_ARCHITECTURE_QUERY } from '../gql/documents/attribute-group.query'

export const AttributeGroupForm = () => {
  const [name, setName] = useState('')
  const [createGroup, { loading }] = useCreateAttributeGroupMutation({
    refetchQueries: [{ query: GET_ATTRIBUTE_ARCHITECTURE_QUERY }],
    onCompleted: (data) => {
      toast.success(`"${data.createAttributeGroup.name}" grubu oluşturuldu.`)
      setName('')
    },
    onError: (error) => toast.error(error.message),
  })

  const handleCreate = () => {
    if (!name.trim() || loading) return
    createGroup({ variables: { input: { name: name.trim() } } })
  }

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Yeni Grup Ekle (örn: İletişim)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
        disabled={loading}
      />
      <Button
        onClick={handleCreate}
        disabled={loading || !name.trim()}
        size="icon"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <PlusCircle className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}
