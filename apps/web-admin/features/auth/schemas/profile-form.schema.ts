import { z } from 'zod'

export const profileFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name cannot exceed 100 characters'),
  email: z.string().email('Invalid email format'),
})

export type ProfileFormValues = z.infer<typeof profileFormSchema>

