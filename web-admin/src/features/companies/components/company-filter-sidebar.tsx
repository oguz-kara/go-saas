// src/features/companies/components/company-filter-sidebar.tsx
'use client'

import { useGetAttributeTypesQuery } from '@gocrm/graphql/generated/hooks'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@gocrm/components/ui/accordion'
import { Skeleton } from '@gocrm/components/ui/skeleton'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { AttributeValueCheckboxes } from './attributes-value-checkboxes'
import { useTranslations } from '@gocrm/hooks/use-translations'
import { Button } from '@gocrm/components/ui/button'
import Link from 'next/link'
import { useRoutes } from '@gocrm/hooks/use-routes'

export const CompanyFilterSidebar = () => {
  const { routes } = useRoutes()
  const { data, loading } = useGetAttributeTypesQuery()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { translations } = useTranslations()

  const handleFilterChange = useCallback(
    (attributeTypeId: string, valueId: string, checked: boolean) => {
      const params = new URLSearchParams(searchParams.toString())
      const existingValues = params.get(attributeTypeId)?.split(',') || []

      const newValues = checked
        ? [...existingValues, valueId]
        : existingValues.filter((v) => v !== valueId)

      if (newValues.length > 0) {
        params.set(attributeTypeId, newValues.join(','))
      } else {
        params.delete(attributeTypeId)
      }

      params.delete('skip')
      router.push(`${pathname}?${params.toString()}`)
    },
    [searchParams, pathname, router],
  )

  if (loading) {
    return (
      <aside className="w-full lg:w-64">
        <h3 className="text-lg font-semibold mb-4">
          {translations?.companiesPage.title}
        </h3>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </aside>
    )
  }

  const attributeTypes = data?.attributeTypes.items || []

  if (attributeTypes.length === 0) {
    return (
      <aside className="w-full lg:w-64">
        <h3 className="text-lg font-semibold mb-4">
          {translations?.companiesPage.title}
        </h3>
        <h4 className="text-md font-medium pb-2">
          {translations?.companiesPage.noFiltersFound}
        </h4>
        <div className="text-muted-foreground text-sm pb-2">
          {translations?.companiesPage.noFiltersFoundDescription}
        </div>
        <div className="text-muted-foreground text-sm">
          <Button variant="outline" size="sm" asChild>
            <Link href={routes?.attributes || ''}>
              {translations?.companiesPage.createFilterButton}
            </Link>
          </Button>
        </div>
      </aside>
    )
  }

  return (
    <aside className="w-full lg:w-64">
      <h3 className="text-lg font-semibold mb-4">
        {translations?.companiesPage.title}
      </h3>
      <Accordion
        type="multiple"
        defaultValue={attributeTypes.map((at) => at.id)}
        className="w-full"
      >
        {attributeTypes.map((type) => (
          <AccordionItem value={type.id} key={type.id}>
            <AccordionTrigger className="text-base">
              {type.name}
            </AccordionTrigger>
            <AccordionContent>
              <AttributeValueCheckboxes
                attributeTypeId={type.id}
                selectedValues={searchParams.get(type.id)?.split(',') || []}
                onFilterChange={handleFilterChange}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </aside>
  )
}
