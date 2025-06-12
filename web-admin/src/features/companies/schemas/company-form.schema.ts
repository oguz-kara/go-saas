import { z } from 'zod'
import { Translations } from '@gocrm/lib/i18n/tr'

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
  })

export type CompanyFormValues = z.infer<
  ReturnType<typeof createCompanyFormSchema>
>
