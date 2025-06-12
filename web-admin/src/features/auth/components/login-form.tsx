'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { toast } from 'sonner'
import { LoginFormValues, loginFormSchema } from '../schemas/login-form.schema'

import { Button } from '@gocrm/components/ui/button'
import { Input } from '@gocrm/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@gocrm/components/ui/form'
import { Loader2 } from 'lucide-react'
import { useTranslations } from '@gocrm/hooks/use-translations'

export const LoginForm = () => {
  const router = useRouter()
  const { translations } = useTranslations()
  const t = translations?.loginPage

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: '', password: '' },
  })

  const { isSubmitting } = form.formState

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const result = await signIn('credentials', {
        redirect: false, // Yönlendirmeyi manuel olarak biz yapacağız
        email: data.email,
        password: data.password,
      })

      if (result?.error) {
        toast.error(t?.errorToastTitle, {
          description: t?.errorToastDescription,
        })
      } else if (result?.ok) {
        toast.success(t?.successToastTitle, {
          description: t?.successToastDescription,
        })
        router.push('/companies')
      }
    } catch (error) {
      console.error('Sign in error:', error)
      toast.error(t?.errorToastTitle, {
        description: t?.errorToastDescription,
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t?.emailLabel}</FormLabel>
              <FormControl>
                <Input placeholder={t?.emailPlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t?.passwordLabel}</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? t?.submittingButton : t?.submitButton}
        </Button>
      </form>
    </Form>
  )
}
