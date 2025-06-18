// src/features/companies/components/create-company-dialog.tsx
'use client'

import { CompanyFormValues } from '../schemas/company-form.schema'
import { CreateCompanyInput } from '@gocrm/graphql/generated/hooks' // DTO'yu import edelim

export const mapFormValuesToInput = (
  values: CompanyFormValues,
): CreateCompanyInput => {
  // 1. Düz attribute ID'lerini topla
  const attributeValueIds = values.attributes
    ? Object.values(values.attributes).flatMap(
        (arr) => arr?.map((attribute) => attribute.id) || [],
      )
    : []

  // 3. Adres bilgilerini tek bir JSON objesinde birleştir
  const addressJson = {
    line1: values.addressLine1,
    line2: values.addressLine2,
    postalCode: values.postalCode,
  }

  // 4. API'nin beklediği nihai DTO'yu oluştur
  return {
    name: values.name,
    website: values.website || null,
    taxId: values.taxId || null,
    description: values.description || null,
    phoneNumber: values.phoneNumber || null,
    email: values.email || null,
    socialProfiles: values.socialProfiles || null,
    address: addressJson,
    attributeIds: attributeValueIds,
    addressAttributeCodes: values.addressAttributeCodes || [],
  }
}
