// src/modules/search/providers/postgres-fts.search.provider.ts
import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { CompanyEntity } from 'src/modules/company/api/graphql/entities/company.entity'

import { Prisma } from '@prisma/client'
import {
  ISearchProvider,
  SearchProviderOptions,
  SearchProviderResult,
} from '../../domain'

@Injectable()
export class PostgresFtsSearchProvider implements ISearchProvider {
  constructor(private readonly prisma: PrismaService) {}

  async searchCompanies(
    options: SearchProviderOptions,
    channelToken: string,
  ): Promise<SearchProviderResult> {
    // const { searchQuery } = options

    const whereClause: Prisma.CompanyWhereInput = {
      channelToken: channelToken,
      deletedAt: null,
    }

    // if (searchQuery) {
    //   const plainQuery = searchQuery.trim().split(/\s+/).join(' & ')
    //   whereClause.search = {
    //     path: ['name', 'industry', 'description'],
    //     query: plainQuery,
    //   }
    // }

    const results = await this.prisma.company.findMany({
      where: whereClause,
      select: { id: true }, // Sadece ID'leri çekiyoruz, daha performanslı
    })

    const totalCount = await this.prisma.company.count({ where: whereClause })

    return {
      ids: results.map((r) => r.id),
      totalCount,
    }
  }

  async indexCompany(company: CompanyEntity): Promise<void> {
    return Promise.resolve()
  }

  async deleteCompanyFromIndex(companyId: string): Promise<void> {
    return Promise.resolve()
  }
}
