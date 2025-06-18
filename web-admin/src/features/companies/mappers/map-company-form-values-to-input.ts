// src/features/companies/components/create-company-dialog.tsx
'use client'

import { CompanyFormValues } from '../schemas/company-form.schema'
import { CreateCompanyInput } from '@gocrm/graphql/generated/hooks' // DTO'yu import edelim

export const mapFormValuesToInput = (
  values: CompanyFormValues,
): CreateCompanyInput => {
  const attributeValueIds = values.attributes
    ? Object.values(values.attributes).flatMap(
        (arr) => arr?.map((attribute) => attribute?.id) || [],
      )
    : []

  const addressJson = {
    line1: values.addressLine1,
    line2: values.addressLine2,
    postalCode: values.postalCode,
  }

  return {
    name: values.name,
    website: values.website || null,
    taxId: values.taxId || null,
    description: values.description || null,
    phoneNumber: values.phoneNumber || null,
    email: values.email || null,
    socialProfiles: values.socialProfiles || null,
    address: addressJson,
    attributeIds: attributeValueIds.filter(Boolean) as string[],
    addressAttributeCodes: values.addressAttributeCodes || [],
  }
}
