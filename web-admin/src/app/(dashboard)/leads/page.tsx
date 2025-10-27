import React from 'react'
import { sdk } from '@gocrm/graphql'
import { LeadsPageClient } from './leads-page-client'

export default async function LeadsPage({
  searchParams,
  params,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
  params: Promise<{ locale?: string }>
}) {
  const { locale } = (await params) || {}
  const resolvedSearchParams = (await searchParams) || {}
  
  const skip = Number(resolvedSearchParams.skip ?? 0)
  const take = Number(resolvedSearchParams.take ?? 10)
  const q = (resolvedSearchParams.q as string) || undefined
  
  // Handle multiple values for filters
  const statusParam = resolvedSearchParams.status
  const status = statusParam 
    ? (Array.isArray(statusParam) ? statusParam : [statusParam])
    : undefined
  
  const sourceParam = resolvedSearchParams.source
  const source = sourceParam
    ? (Array.isArray(sourceParam) ? sourceParam : [sourceParam])
    : undefined
  
  const priorityParam = resolvedSearchParams.priority
  const priority = priorityParam
    ? (Array.isArray(priorityParam) ? priorityParam : [priorityParam])
    : undefined
  
  const assignedToIdParam = resolvedSearchParams.assignedToId
  const assignedToId = assignedToIdParam
    ? (Array.isArray(assignedToIdParam) ? assignedToIdParam : [assignedToIdParam])
    : undefined

  const startDate = (resolvedSearchParams.startDate as string) || undefined
  const endDate = (resolvedSearchParams.endDate as string) || undefined
  const sortBy = (resolvedSearchParams.sortBy as string) || undefined
  const sortOrder = (resolvedSearchParams.sortOrder as string) || undefined

  const api = sdk(locale)
  const [data, usersData] = await Promise.all([
    api.GetLeads({
      skip,
      take,
      searchQuery: q,
      status: status as any,
      source: source as any,
      priority: priority as any,
      assignedToId: assignedToId?.[0] || undefined,
      startDate,
      endDate,
      sortBy,
      sortOrder,
    }),
    api.Users({
      skip: 0,
      take: 100, // Get all users for the filter
    }),
  ])

  const items = data.leads.items
  const totalCount = data.leads.totalCount

  // Debug: Log the status parameter
  console.log('Status filter:', { statusParam, status, url: JSON.stringify(resolvedSearchParams) })

  return (
    <LeadsPageClient
      items={items}
      totalCount={totalCount}
      pageSize={take}
      currentPage={skip / take + 1}
      users={usersData.getUsers.items}
    />
  )
}
