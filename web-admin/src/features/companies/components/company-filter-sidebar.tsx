// src/features/companies/components/company-filter-sidebar.tsx
'use client'

import {
  AttributeType,
  useGetAttributeTypesQuery,
  AttributeTypeKind,
  AttributeDataType,
} from '@gocrm/graphql/generated/hooks'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@gocrm/components/ui/accordion'
import { Skeleton } from '@gocrm/components/ui/skeleton'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState, useEffect } from 'react'
import { useTranslations } from '@gocrm/hooks/use-translations'
import { Button } from '@gocrm/components/ui/button'
import Link from 'next/link'
import { useRoutes } from '@gocrm/hooks/use-routes'
import { XCircle } from 'lucide-react'
import { Input } from '@gocrm/components/ui/input'
import { AttributeField } from '../../attributes/components/attribute-fields'

export const CompanyFilterSidebar = ({ address }: { address?: string[] }) => {
  const { routes } = useRoutes()
  const { data, loading } = useGetAttributeTypesQuery({
    variables: {
      includeSystemDefined: true,
      args: {
        take: 100,
      },
    },
  })
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { translations } = useTranslations()

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('searchQuery') || '',
  )

  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      const currentQuery = params.get('searchQuery') || ''

      if (searchQuery !== currentQuery) {
        if (searchQuery) {
          params.set('searchQuery', searchQuery)
        } else {
          params.delete('searchQuery')
        }
        params.delete('skip')
        router.push(`${pathname}?${params.toString()}`)
      }
    }, 500)

    return () => {
      clearTimeout(handler)
    }
  }, [searchQuery, pathname, router, searchParams])

  useEffect(() => {
    setSearchQuery(searchParams.get('searchQuery') || '')
  }, [searchParams])

  const handleCascadingFilterChange = useCallback(
    (_attributeTypeId: string, values: string[]) => {
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

  const handleQueryParamFilterChange = useCallback(
    (
      attributeCode: string,
      value: string | string[] | boolean | number | null,
    ) => {
      const params = new URLSearchParams(searchParams.toString())

      let shouldDelete = false
      if (Array.isArray(value)) {
        if (value.length === 0) shouldDelete = true
      } else if (typeof value === 'boolean') {
        if (value === false) shouldDelete = true
      } else if (value === null || value === '' || value === 0) {
        shouldDelete = true
      }

      if (shouldDelete) {
        params.delete(attributeCode)
      } else {
        params.set(attributeCode, String(value))
      }

      params.delete('skip')
      router.push(`${pathname}?${params.toString()}`)
    },
    [searchParams, pathname, router],
  )

  const handleClearFilters = useCallback(() => {
    const basePath = routes?.companies || ''
    router.push(basePath)
  }, [router, routes])

  // Determine if any filters are applied
  const filterParamKeys = data?.attributeTypes.items?.map((at) => at.code) || []
  const hasActiveFilters =
    filterParamKeys.some((key) => !!searchParams.get(key)) ||
    (address && address.length > 0) ||
    !!searchParams.get('searchQuery')

  const getValue = (
    type: Pick<AttributeType, 'kind' | 'dataType' | 'code'>,
  ) => {
    if (type.kind === AttributeTypeKind.Hierarchical) {
      return address || []
    }

    const valueFromParams = searchParams.get(type.code)

    if (type.kind === AttributeTypeKind.MultiSelect) {
      return valueFromParams ? valueFromParams.split(',') : []
    }

    if (
      type.dataType === AttributeDataType.Boolean &&
      type.kind === AttributeTypeKind.Text
    ) {
      return valueFromParams === 'true'
    }

    if (
      type.dataType === AttributeDataType.Number &&
      type.kind === AttributeTypeKind.Text
    ) {
      return valueFromParams ? Number(valueFromParams) : ''
    }

    return valueFromParams || ''
  }

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
    <aside className="w-full px-4 pr-4 lg:w-72 overflow-y-auto max-h-[calc(100vh-10rem)]">
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
      <div className="mb-4">
        <Input
          placeholder={
            translations?.companiesPage.searchPlaceholder ||
            'Search companies...'
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
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
              <AttributeField
                attributeType={type as AttributeType}
                name={type.code}
                value={getValue(type)}
                hierarchy={[
                  {
                    level: 0,
                    label: translations?.address.countryText as string,
                  },
                  {
                    level: 1,
                    label: translations?.address.cityText as string,
                  },
                  {
                    level: 2,
                    label: translations?.address.districtText as string,
                  },
                  {
                    level: 3,
                    label: translations?.address.neighborhoodText as string,
                  },
                ]}
                onChange={(newValue) => {
                  if (type.kind === AttributeTypeKind.Hierarchical) {
                    handleCascadingFilterChange(type.code, newValue as string[])
                  } else {
                    handleQueryParamFilterChange(type.code, newValue)
                  }
                }}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </aside>
  )
}
