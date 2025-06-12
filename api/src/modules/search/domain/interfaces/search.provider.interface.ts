// src/modules/search/search.provider.interface.ts
import { CompanyEntity } from 'src/modules/company/api/graphql/entities/company.entity' // Gerekli tipleri import edelim

export interface SearchProviderOptions {
  searchQuery: string
}

export interface SearchProviderResult {
  ids: string[]
  totalCount: number
}

export const ISearchProvider = Symbol('ISearchProvider')

export interface ISearchProvider {
  /**
   * Verilen kritere göre şirketleri arar ve ID'lerini döndürür.
   * @param options Arama seçenekleri
   * @returns Eşleşen şirketlerin ID listesini ve toplam sayısını içeren bir nesne.
   */
  searchCompanies(
    options: SearchProviderOptions,
    channelToken: string, // Tenant/Channel bilgisi
  ): Promise<SearchProviderResult>

  /**
   * Bir şirketi arama motorunda indeksler.
   * @param company İndekslenecek şirket verisi
   */
  indexCompany(company: CompanyEntity): Promise<void>

  /**
   * Bir şirketi arama motoru indeksinden kaldırır.
   * @param companyId Kaldırılacak şirketin ID'si
   */
  deleteCompanyFromIndex(companyId: string): Promise<void>
}
