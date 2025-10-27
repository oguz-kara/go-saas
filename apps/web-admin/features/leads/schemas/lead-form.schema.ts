import { z } from 'zod'

export const leadFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  jobTitle: z.string().optional().nullable(),
  website: z.string().url().optional().nullable(),
  status: z
    .enum([
      'NEW',
      'CONTACTED',
      'QUALIFIED',
      'PROPOSAL_SENT',
      'NEGOTIATION',
      'CONVERTED',
      'LOST',
      'UNQUALIFIED',
    ])
    .default('NEW'),
  source: z.enum([
    'WEBSITE',
    'REFERRAL',
    'SOCIAL_MEDIA',
    'EMAIL_CAMPAIGN',
    'PAID_ADS',
    'COLD_OUTREACH',
    'EVENT',
    'PARTNER',
    'OTHER',
    'ADMIN',
  ]),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  productInterest: z
    .array(
      z.enum([
        'SAAS',
        'MOBILE_APP',
        'WEB_APP',
        'CUSTOM_SOFTWARE',
        'API_INTEGRATION',
        'CONSULTING',
        'OTHER',
      ]),
    )
    .optional()
    .nullable(),
  budget: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Budget must be a number')
    .optional()
    .nullable(),
  timeline: z.string().optional().nullable(),
  companySize: z.coerce.number().int().nonnegative().optional().nullable(),
  isDecisionMaker: z.boolean().optional().nullable(),
  painPoints: z.string().optional().nullable(),
  currentSolution: z.string().optional().nullable(),
  assignedToId: z.string().optional().nullable(),
})

export type LeadFormValues = z.input<typeof leadFormSchema>
