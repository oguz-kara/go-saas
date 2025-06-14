'use client'

import { Button } from '@gocrm/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@gocrm/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@gocrm/components/ui/table'
import { GetCompaniesWithAttributesQuery } from '@gocrm/graphql/generated/sdk'
import { useTranslations } from '@gocrm/hooks/use-translations'
import { MoreHorizontal } from 'lucide-react'

import { EditCompanyDialog } from './edit-company-dialog'
import { DeleteCompanyAlert } from './delete-company-alert'
import Link from '@gocrm/components/common/link'

type CompanyItem = GetCompaniesWithAttributesQuery['companies']['items'][0]

interface CompaniesTableProps {
  companies: CompanyItem[]
  pageInfo: { skip: number; take: number }
}

export const CompaniesTable = ({
  companies,
  pageInfo,
}: CompaniesTableProps) => {
  const { translations } = useTranslations()

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{translations?.companiesTable.headerName}</TableHead>
            <TableHead>{translations?.companiesTable.headerIndustry}</TableHead>
            <TableHead>{translations?.companiesTable.headerWebsite}</TableHead>
            <TableHead>
              {translations?.companiesTable.headerCreatedAt}
            </TableHead>
            <TableHead>
              <span className="sr-only">
                {translations?.companiesTable.actionsLabel}
              </span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies && companies.length > 0 ? (
            companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell className="font-medium">
                  <Link
                    className="text-blue-600 hover:underline"
                    href={`/companies/${company.id}`}
                  >
                    {company.name}
                  </Link>
                </TableCell>
                <TableCell>{company.industry || '–'}</TableCell>
                <TableCell>
                  {company.website ? (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {company.website}
                    </a>
                  ) : (
                    '–'
                  )}
                </TableCell>
                <TableCell>
                  {new Date(company.createdAt).toLocaleDateString('tr-TR')}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">
                          {translations?.companiesTable.actionToggleMenu}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>
                        {translations?.companiesTable.actionsLabel}
                      </DropdownMenuLabel>
                      <EditCompanyDialog company={company} asMenuItem={true} />
                      <DeleteCompanyAlert companyId={company.id}>
                        <DropdownMenuItem
                          className="text-red-600"
                          onSelect={(e) => {
                            e.preventDefault()
                          }}
                        >
                          {translations?.companiesTable.actionDelete}
                        </DropdownMenuItem>
                      </DeleteCompanyAlert>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                {translations?.companiesPage.noCompaniesFound}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
