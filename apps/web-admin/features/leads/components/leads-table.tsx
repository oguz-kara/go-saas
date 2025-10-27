'use client'

import Link from '@/components/common/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { MoreHorizontal } from 'lucide-react'
import { format } from 'date-fns'
import { GetLeadsQuery } from '@/graphql/generated/sdk'
import { useTranslations } from '@/hooks/use-translations'
import { useLeadsTable } from './leads-table-provider'
import { DeleteLeadAlert } from './delete-lead-alert'
import { routes } from '@/lib/routes'

interface LeadsTableProps {
  leads: GetLeadsQuery['leads']['items']
}

const statusColor: Record<
  string,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  NEW: 'secondary',
  QUALIFIED: 'default',
  CONVERTED: 'default',
  LOST: 'destructive',
  CONTACTED: 'outline',
  PROPOSAL_SENT: 'outline',
  NEGOTIATION: 'outline',
}

const priorityColor: Record<
  string,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  LOW: 'outline',
  MEDIUM: 'secondary',
  HIGH: 'default',
  URGENT: 'destructive',
}

export const LeadsTable = ({ leads }: LeadsTableProps) => {
  const { translations } = useTranslations()
  const { columnVisibility } = useLeadsTable()

  if (!translations) {
    return null
  }

  const t = translations.leadsTable
  const tStatus = translations.leadStatus
  const tSource = translations.leadSource
  const tPriority = translations.leadPriority
  const tProductInterest = translations.leadProductInterest

  const visibleColumnsCount = Object.values(columnVisibility).filter(Boolean).length + 1 // +1 for actions

  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columnVisibility.name && (
                <TableHead className="w-[200px]">{t.columnName}</TableHead>
              )}
              {columnVisibility.email && (
                <TableHead className="w-[200px]">{t.columnEmail}</TableHead>
              )}
              {columnVisibility.company && <TableHead className="w-[150px]">{t.columnCompany}</TableHead>}
              {columnVisibility.status && (
                <TableHead className="w-[140px]">{t.columnStatus}</TableHead>
              )}
              {columnVisibility.source && (
                <TableHead className="w-[150px]">{t.columnSource}</TableHead>
              )}
              {columnVisibility.interests && (
                <TableHead className="w-[200px]">{t.columnInterests}</TableHead>
              )}
              {columnVisibility.priority && (
                <TableHead className="w-[100px]">{t.columnPriority}</TableHead>
              )}
              {columnVisibility.assignedTo && <TableHead className="w-[150px]">{t.columnAssignedTo}</TableHead>}
              {columnVisibility.created && (
                <TableHead className="w-[110px]">{t.columnCreated}</TableHead>
              )}
              <TableHead className="w-[70px]">
                <span className="sr-only">{t.actions}</span>
              </TableHead>
            </TableRow>
          </TableHeader>
        <TableBody>
          {leads && leads.length > 0 ? (
            leads.map((lead) => (
              <TableRow key={lead.id}>
                {columnVisibility.name && (
                  <TableCell className="font-medium">
                    <Link
                      className="text-blue-600 hover:underline"
                      href={routes.leads.detail(lead.id)}
                    >
                      {lead.firstName} {lead.lastName}
                    </Link>
                  </TableCell>
                )}
                {columnVisibility.email && (
                  <TableCell className="max-w-[200px] truncate">{lead.email}</TableCell>
                )}
                {columnVisibility.company && <TableCell>{lead.company || '–'}</TableCell>}
                {columnVisibility.status && (
                  <TableCell>
                    <Badge variant={statusColor[lead.status] || 'outline'}>
                      {tStatus[lead.status as keyof typeof tStatus] || lead.status}
                    </Badge>
                  </TableCell>
                )}
                {columnVisibility.source && (
                  <TableCell>
                    <Badge variant="outline">
                      {tSource[lead.source as keyof typeof tSource] || lead.source}
                    </Badge>
                  </TableCell>
                )}
                {columnVisibility.interests && (
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {lead.productInterest && lead.productInterest.length > 0 ? (
                        <>
                          {lead.productInterest.slice(0, 2).map((pi) => (
                            <Badge key={pi} variant="outline" className="text-xs whitespace-nowrap">
                              {tProductInterest[pi as keyof typeof tProductInterest] || pi}
                            </Badge>
                          ))}
                          {lead.productInterest.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{lead.productInterest.length - 2}
                            </Badge>
                          )}
                        </>
                      ) : (
                        <span className="text-muted-foreground text-sm">–</span>
                      )}
                    </div>
                  </TableCell>
                )}
                {columnVisibility.priority && (
                  <TableCell>
                    <Badge variant={priorityColor[lead.priority] || 'outline'}>
                      {tPriority[lead.priority as keyof typeof tPriority] || lead.priority}
                    </Badge>
                  </TableCell>
                )}
                {columnVisibility.assignedTo && (
                  <TableCell>{lead.assignedTo?.name || '–'}</TableCell>
                )}
                {columnVisibility.created && (
                  <TableCell>
                    {lead.createdAt
                      ? format(new Date(lead.createdAt), 'yyyy-MM-dd')
                      : '–'}
                  </TableCell>
                )}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        aria-haspopup="true"
                        size="icon"
                        variant="ghost"
                        className="data-[state=open]:bg-muted size-8"
                      >
                        <MoreHorizontal />
                        <span className="sr-only">{t.openMenu}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      <DropdownMenuLabel>{t.actions}</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={routes.leads.detail(lead.id)}>{t.view}</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={routes.leads.edit(lead.id)}>{t.edit}</Link>
                      </DropdownMenuItem>
                      <DeleteLeadAlert id={lead.id}>
                        <DropdownMenuItem
                          className="text-red-600"
                          onSelect={(e) => e.preventDefault()}
                        >
                          {t.delete}
                        </DropdownMenuItem>
                      </DeleteLeadAlert>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={visibleColumnsCount} className="h-24 text-center">
                {t.noResults}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        </Table>
      </div>
    </div>
  )
}
