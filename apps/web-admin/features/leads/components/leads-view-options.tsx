'use client'

import { Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTranslations } from '@/hooks/use-translations'
import { useLeadsTable } from './leads-table-provider'

export function LeadsViewOptions() {
  const { translations } = useTranslations()
  const { columnVisibility, toggleColumn } = useLeadsTable()

  if (!translations) {
    return null
  }

  const t = translations.leadsPage
  const tTable = translations.leadsTable

  const columns = [
    { id: 'name' as const, label: tTable.columnName },
    { id: 'email' as const, label: tTable.columnEmail },
    { id: 'company' as const, label: tTable.columnCompany },
    { id: 'status' as const, label: tTable.columnStatus },
    { id: 'source' as const, label: tTable.columnSource },
    { id: 'interests' as const, label: tTable.columnInterests },
    { id: 'priority' as const, label: tTable.columnPriority },
    { id: 'assignedTo' as const, label: tTable.columnAssignedTo },
    { id: 'created' as const, label: tTable.columnCreated },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto hidden h-8 lg:flex">
          <Settings2 />
          {t.view}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>{t.toggleColumns}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            className="capitalize"
            checked={columnVisibility[column.id]}
            onCheckedChange={() => toggleColumn(column.id)}
          >
            {column.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

