'use client'

import { AppPagination } from '@gocrm/components/common/app-pagination'
import { LeadsTable } from '@gocrm/features/leads/components/leads-table'
import { LeadsToolbar } from '@gocrm/features/leads/components/leads-toolbar'
import { LeadsTableProvider } from '@gocrm/features/leads/components/leads-table-provider'
import { GetLeadsQuery, UsersQuery } from '@gocrm/graphql/generated/sdk'

interface LeadsPageClientProps {
  items: GetLeadsQuery['leads']['items']
  totalCount: number
  pageSize: number
  currentPage: number
  users: UsersQuery['getUsers']['items']
}

export function LeadsPageClient({
  items,
  totalCount,
  pageSize,
  currentPage,
  users,
}: LeadsPageClientProps) {
  return (
    <LeadsTableProvider>
      <div className="flex flex-col gap-4">
        <LeadsToolbar users={users} />
        <LeadsTable leads={items} />
        <AppPagination
          totalCount={totalCount}
          pageSize={pageSize}
          currentPage={currentPage}
        />
      </div>
    </LeadsTableProvider>
  )
}

