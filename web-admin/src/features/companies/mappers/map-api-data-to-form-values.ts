import type { GetCompanyWithAttributesAndNotesQuery } from '@gocrm/graphql/generated/sdk'
import { CompanyFormValues } from '../schemas/company-form.schema'

// API'den gelen company nesnesinin tipini alalım
type ApiCompany = NonNullable<GetCompanyWithAttributesAndNotesQuery['company']>

export const mapApiDataToFormValues = (
  company?: ApiCompany | null,
): Partial<CompanyFormValues> => {
  if (!company) {
    return {}
  }

  const formAttributes: Record<string, { id: string; value: string }[]> = {}

  company.attributes?.forEach((attribute) => {
    const typeId = attribute.type?.id
    if (!typeId) return

    if (!formAttributes[typeId]) {
      formAttributes[typeId] = []
    }
    formAttributes[typeId].push({ id: attribute.id, value: attribute.value })
  })

  return {
    // Düz alanları doğrudan ata
    name: company.name,
    website: company.website,
    taxId: company.taxId,
    description: company.description,
    phoneNumber: company.phoneNumber,
    email: company.email,

    // JSON alanlarını form alanlarına ayrıştır
    addressLine1: company.address?.['line1'] || '',
    addressLine2: company.address?.['line2'] || '',
    postalCode: company.address?.['postalCode'] || '',
    socialProfiles: company.socialProfiles || {},

    // Gruplanmış attribute'ları ve adres kodlarını ata
    attributes: formAttributes,
    addressAttributeCodes: company.addressAttributeCodes || [],
  }
}
