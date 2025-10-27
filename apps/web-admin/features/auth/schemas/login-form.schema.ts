import { z } from 'zod'

export const loginFormSchema = z.object({
  email: z
    .string()
    .email({ message: 'Lütfen geçerli bir e-posta adresi girin.' }),
  password: z.string().min(1, { message: 'Şifre boş olamaz.' }),
})

export type LoginFormValues = z.infer<typeof loginFormSchema>
