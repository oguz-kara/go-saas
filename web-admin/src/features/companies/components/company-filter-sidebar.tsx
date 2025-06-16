// src/features/companies/components/company-filter-sidebar.tsx
'use client'

import {
  AttributeType,
  useGetAttributeTypesQuery,
  AttributeTypeKind,
} from '@gocrm/graphql/generated/hooks'
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
import { CascadingAttributeFilter } from './cascading-attribute-filter'
import { XCircle } from 'lucide-react'

export const CompanyFilterSidebar = ({ address }: { address?: string[] }) => {
  const { routes } = useRoutes()
  const { data, loading } = useGetAttributeTypesQuery({
    variables: {
      includeSystemDefined: true,
    },
  })
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

  const handleCascadingFilterChange = useCallback(
    (attributeTypeId: string, values: string[]) => {
      const addressSlug = values.join('-')
      const basePath = routes?.companies || ''
      const newPath =
        addressSlug.length > 0 ? `${basePath}/${addressSlug}` : basePath
      // Preserve current search params
      const params = searchParams.toString()
      const url = params ? `${newPath}?${params}` : newPath
      router.push(url)
    },
    [router, searchParams, routes],
  )

  // Handler to clear all filters
  const handleClearFilters = useCallback(() => {
    const basePath = routes?.companies || ''
    router.push(basePath)
  }, [router, routes])

  // Determine if any filters are applied
  const filterParamKeys = data?.attributeTypes.items?.map((at) => at.code) || []
  const hasActiveFilters =
    filterParamKeys.some((key) => !!searchParams.get(key)) ||
    (address && address.length > 0)

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
    <aside className="w-full pr-4 lg:w-64 overflow-y-auto max-h-[calc(100vh-10rem)]">
      <div className="flex items-center mb-4">
        <h3 className="text-lg font-semibold flex-1">
          {translations?.companiesPage.title}
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="ml-2"
            onClick={handleClearFilters}
            data-testid="clear-filters-btn"
            aria-label={translations?.common.clearText || 'Clear'}
          >
            <XCircle className="w-5 h-5 text-muted-foreground" />
            {translations?.common.clearText}
          </Button>
        )}
      </div>
      <Accordion
        type="multiple"
        defaultValue={attributeTypes.map((at) => at.code)}
        className="w-full"
      >
        {attributeTypes.map((type) => (
          <AccordionItem value={type.code} key={type.code}>
            <AccordionTrigger className="text-base">
              {type.name}
            </AccordionTrigger>
            <AccordionContent>
              {type.kind === AttributeTypeKind.Hierarchical ? (
                (() => {
                  return (
                    <CascadingAttributeFilter
                      attributeType={type as AttributeType}
                      hierarchy={[
                        {
                          level: 0,
                          label: translations?.address.country || 'Country',
                        },
                        {
                          level: 1,
                          label: translations?.address.city || 'City',
                        },
                        {
                          level: 2,
                          label: translations?.address.district || 'District',
                        },
                        {
                          level: 3,
                          label:
                            translations?.address.neighborhood ||
                            'Neighborhood',
                        },
                      ]}
                      selectedValues={address || []}
                      onChange={(values) =>
                        handleCascadingFilterChange(type.code, values)
                      }
                    />
                  )
                })()
              ) : (
                <AttributeValueCheckboxes
                  attributeType={type as AttributeType}
                  selectedValues={searchParams.get(type.code)?.split(',') || []}
                  onFilterChange={handleFilterChange}
                />
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </aside>
  )
}
