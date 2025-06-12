'use client'
import { useGetCompaniesQuery } from '@gocrm/graphql/generated/hooks'
import React from 'react'

export default function Page() {
  const { data, loading, error } = useGetCompaniesQuery()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {data?.companies.items.map((company) => (
        <div key={company.id}>{company.name}</div>
      ))}
    </div>
  )
}
