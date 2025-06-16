import { z } from 'zod'
import { Translations } from '@gocrm/lib/i18n/tr'

export const attributeValueSchema = z.object({
  id: z.string(),
  value: z.string(),
})

export const createCompanyFormSchema = (t: Translations['companyForm']) =>
  z.object({
    name: z.string().min(1, { message: t?.validation_nameRequired }),
    website: z
      .string()
      .url({ message: t?.validation_urlInvalid })
      .optional()
      .or(z.literal(''))
      .nullable(),
    industry: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    taxId: z.string().optional().nullable(),
    phoneNumber: z.string().optional().nullable(),
    email: z.string().email().optional().nullable(),
    socialProfiles: z.record(z.string()).optional().nullable(),
    addressLine1: z.string().optional().nullable(),
    addressLine2: z.string().optional().nullable(),
    postalCode: z.string().optional().nullable(),
    attributes: z
      .record(z.string(), z.array(attributeValueSchema))
      .optional()
      .nullable(),
    addressAttributeCodes: z.array(z.string()).optional().nullable(),
  })

export type CompanyFormValues = z.infer<
  ReturnType<typeof createCompanyFormSchema>
>
