'use client'

import { useState } from 'react'
import { Copy, Check, Eye, EyeOff } from 'lucide-react'
import { Button } from '@gocrm/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@gocrm/components/ui/card'
import { Input } from '@gocrm/components/ui/input'
import { Alert, AlertDescription } from '@gocrm/components/ui/alert'
import { useTranslations } from '@gocrm/hooks/use-translations'

interface ApiKeyDisplayProps {
  apiKey: string
  keyName: string
}

export function ApiKeyDisplay({ apiKey, keyName }: ApiKeyDisplayProps) {
  const { translations } = useTranslations()
  const t = translations?.apiKeys
  const [copied, setCopied] = useState(false)
  const [showKey, setShowKey] = useState(true)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const displayKey = showKey ? apiKey : '•'.repeat(apiKey.length)

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="space-y-4 px-0">
        <Alert variant="destructive">
          <AlertDescription>
            <strong>{t?.displayImportant || 'Important'}:</strong>{' '}
            {t?.displayWarning ||
              "Copy this API key now. You won't be able to see it again!"}
          </AlertDescription>
        </Alert>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              value={displayKey}
              readOnly
              className="pr-10 font-mono text-sm"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowKey(!showKey)}
            type="button"
          >
            {showKey ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
          <Button onClick={handleCopy} type="button">
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                {t?.copiedButton || 'Copied!'}
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                {t?.copyButton || 'Copy'}
              </>
            )}
          </Button>
        </div>

        <div className="text-sm text-muted-foreground space-y-1">
          <p>{t?.usageHint || 'To use this API key, include it in the request header:'}</p>
          <code className="block bg-muted p-2 rounded text-xs">
            X-API-Key: {showKey ? apiKey : '•'.repeat(apiKey.length)}
          </code>
        </div>
      </CardContent>
    </Card>
  )
}

