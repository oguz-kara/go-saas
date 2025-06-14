// src/features/companies/components/company-card.tsx
'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@gocrm/components/ui/card'
import { Building, Globe, MoreVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@gocrm/components/ui/dropdown-menu'
import { Button } from '@gocrm/components/ui/button'
import { EditCompanyDialog } from './edit-company-dialog'
import { DeleteCompanyAlert } from './delete-company-alert'
import { GetCompaniesWithAttributesQuery } from '@gocrm/graphql/generated/sdk'
import { useTranslations } from '@gocrm/hooks/use-translations'
import Link from '@gocrm/components/common/link'
import { useRoutes } from '@gocrm/hooks/use-routes'

type CompanyItem = GetCompaniesWithAttributesQuery['companies']['items'][0]

interface CompanyCardProps {
  company: CompanyItem
}

export const CompanyCard = ({ company }: CompanyCardProps) => {
  const { routes } = useRoutes()
  const { translations } = useTranslations()
  const t = translations?.companiesTable

  if (!t) return null

  return (
    <Card className="transition-colors hover:bg-muted/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">
          <Link
            href={`${routes?.companies}/${company.id}`}
            className="text-blue-600 hover:underline"
          >
            {company.name}
          </Link>
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">{t.actionToggleMenu}</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t.actionsLabel}</DropdownMenuLabel>
            <EditCompanyDialog company={company} asMenuItem={false} />
            <DeleteCompanyAlert companyId={company.id}>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="text-red-600"
              >
                {t.actionDelete}
              </DropdownMenuItem>
            </DeleteCompanyAlert>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground space-y-2">
          {company.industry && (
            <div className="flex items-center">
              <Building className="mr-2 h-4 w-4" />
              <span>{company.industry}</span>
            </div>
          )}
          {company.website && (
            <div className="flex items-center">
              <Globe className="mr-2 h-4 w-4" />
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline truncate"
                onClick={(e) => e.stopPropagation()}
              >
                {company.website}
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
