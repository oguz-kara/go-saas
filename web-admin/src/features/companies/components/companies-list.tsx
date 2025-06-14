// src/features/companies/components/companies-list.tsx
import { GetCompaniesWithAttributesQuery } from '@gocrm/graphql/generated/sdk'
import { CompaniesTable } from './companies-table'
import { CompanyCard } from './company-card'

type CompanyItem = GetCompaniesWithAttributesQuery['companies']['items'][0]

interface CompaniesListProps {
  companies: CompanyItem[]
  pageInfo: { skip: number; take: number }
}

export const CompaniesList = ({ companies, pageInfo }: CompaniesListProps) => {
  return (
    <>
      <div className="hidden md:block">
        <CompaniesTable companies={companies} pageInfo={pageInfo} />
      </div>

      <div className="grid gap-4 md:hidden">
        {companies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>
    </>
  )
}
