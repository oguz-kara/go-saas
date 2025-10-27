'use client'

import { useMutation, useQuery } from '@apollo/client'
import { formatDistanceToNow } from 'date-fns'
import { Trash2, Loader2, Key } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@gocrm/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@gocrm/components/ui/table'
import { Badge } from '@gocrm/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@gocrm/components/ui/alert-dialog'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@gocrm/components/ui/card'
import { LIST_API_KEYS_QUERY, REVOKE_API_KEY_MUTATION } from '../graphql'
import { ApiKey } from '../types/api-key.types'
import { useTranslations } from '@gocrm/hooks/use-translations'

export function ApiKeyList() {
  const { translations } = useTranslations()
  const t = translations?.apiKeys
  const { data, loading } = useQuery(LIST_API_KEYS_QUERY)

  const [revokeApiKey, { loading: revoking }] = useMutation(
    REVOKE_API_KEY_MUTATION,
    {
      refetchQueries: [{ query: LIST_API_KEYS_QUERY }],
      onCompleted: () => {
        toast.success(t?.revokeSuccess || 'API key revoked successfully.')
      },
      onError: (error) => {
        toast.error(error.message || t?.revokeError || 'Failed to revoke API key.')
      },
    },
  )

  const handleRevoke = (id: string) => {
    revokeApiKey({ variables: { id } })
  }

  const apiKeys: ApiKey[] = data?.listApiKeys || []

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (apiKeys.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Key className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-semibold mb-2">
            {t?.noKeysTitle || 'No API Keys'}
          </p>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            {t?.noKeysDescription ||
              "You haven't created any API keys yet. Generate your first key to start accepting leads from external sources."}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t?.title || 'API Keys'}</CardTitle>
        <CardDescription>
          {t?.description || 'Manage API keys for external integrations and marketing websites.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t?.tableName || 'Name'}</TableHead>
              <TableHead>{t?.tablePrefix || 'Prefix'}</TableHead>
              <TableHead>{t?.tableStatus || 'Status'}</TableHead>
              <TableHead>{t?.tableUsage || 'Usage'}</TableHead>
              <TableHead>{t?.tableLastUsed || 'Last Used'}</TableHead>
              <TableHead>{t?.tableCreated || 'Created'}</TableHead>
              <TableHead className="text-right">
                {t?.tableActions || 'Actions'}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiKeys.map((key) => (
              <TableRow key={key.id}>
                <TableCell className="font-medium">{key.name}</TableCell>
                <TableCell>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {key.prefix}...
                  </code>
                </TableCell>
                <TableCell>
                  {key.isActive ? (
                    <Badge variant="default">{t?.statusActive || 'Active'}</Badge>
                  ) : (
                    <Badge variant="secondary">{t?.statusRevoked || 'Revoked'}</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {t?.usageCount?.replace('{{count}}', key.usageCount.toString()) || `${key.usageCount} requests`}
                  </span>
                </TableCell>
                <TableCell>
                  {key.lastUsedAt ? (
                    <div className="text-sm">
                      <div>
                        {formatDistanceToNow(new Date(key.lastUsedAt), {
                          addSuffix: true,
                        })}
                      </div>
                      {key.lastUsedIp && (
                        <div className="text-xs text-muted-foreground">
                          {key.lastUsedIp}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {t?.lastUsedNever || 'Never'}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-sm">
                  {formatDistanceToNow(new Date(key.createdAt), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell className="text-right">
                  {key.isActive && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={revoking}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {t?.revokeTitle || 'Revoke API Key'}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {t?.revokeDescription?.replace('{name}', key.name) ||
                              `Are you sure you want to revoke "${key.name}"? This action cannot be undone and any applications using this key will stop working immediately.`}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            {t?.revokeCancel || 'Cancel'}
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRevoke(key.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {t?.revokeButton || 'Revoke Key'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
