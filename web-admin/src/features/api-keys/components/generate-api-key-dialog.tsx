'use client'

import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { Loader2, Plus } from 'lucide-react'
import { Button } from '@gocrm/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@gocrm/components/ui/dialog'
import { Input } from '@gocrm/components/ui/input'
import { Label } from '@gocrm/components/ui/label'
import { toast } from 'sonner'
import { CREATE_API_KEY_MUTATION, LIST_API_KEYS_QUERY } from '../graphql'
import { GeneratedApiKey } from '../types/api-key.types'
import { ApiKeyDisplay } from './api-key-display'
import { useTranslations } from '@gocrm/hooks/use-translations'

export function GenerateApiKeyDialog() {
  const { translations } = useTranslations()
  const t = translations?.apiKeys
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [generatedKey, setGeneratedKey] = useState<GeneratedApiKey | null>(null)

  const [createApiKey, { loading }] = useMutation(CREATE_API_KEY_MUTATION, {
    refetchQueries: [{ query: LIST_API_KEYS_QUERY }],
    onCompleted: (data) => {
      setGeneratedKey(data.createApiKey)
      setName('')
      toast.success(t?.generateSuccess || 'API key generated successfully.')
    },
    onError: (error) => {
      toast.error(error.message || t?.generateError || 'Failed to generate API key.')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    createApiKey({
      variables: {
        input: { name: name.trim() },
      },
    })
  }

  const handleClose = () => {
    setOpen(false)
    // Reset after animation completes
    setTimeout(() => {
      setGeneratedKey(null)
      setName('')
    }, 300)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {t?.generateButton || 'Generate New Key'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        {generatedKey ? (
          <>
            <DialogHeader>
              <DialogTitle>
                {t?.createdTitle || 'API Key Created'}
              </DialogTitle>
              <DialogDescription>
                {t?.createdDescription || "Save this key securely. It won't be shown again."}
              </DialogDescription>
            </DialogHeader>
            <ApiKeyDisplay
              apiKey={generatedKey.plainKey}
              keyName={generatedKey.name}
            />
            <DialogFooter>
              <Button onClick={handleClose}>
                {t?.createdDone || 'Done'}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>
                {t?.generateTitle || 'Generate New API Key'}
              </DialogTitle>
              <DialogDescription>
                {t?.generateDescription ||
                  'Create a new API key for external integrations. Give it a descriptive name so you can identify it later.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    {t?.keyNameLabel || 'API Key Name'}
                  </Label>
                  <Input
                    id="name"
                    placeholder={t?.keyNamePlaceholder || 'e.g., Marketing Website - Production'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    maxLength={100}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    {t?.keyNameHelper ||
                      'Choose a name that describes where this key will be used.'}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                >
                  {t?.generateDialogCancel || 'Cancel'}
                </Button>
                <Button type="submit" disabled={loading || !name.trim()}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t?.generateButtonText || 'Generate API Key'}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
