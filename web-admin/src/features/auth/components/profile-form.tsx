'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@gocrm/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@gocrm/components/ui/form'
import { Input } from '@gocrm/components/ui/input'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import {
  profileFormSchema,
  type ProfileFormValues,
} from '../schemas/profile-form.schema'
import { useUpdateUserProfileMutation, useMeQuery } from '@gocrm/graphql/generated/hooks'
import { useTranslations } from '@gocrm/hooks/use-translations'

export function ProfileForm() {
  const { data: userData, refetch } = useMeQuery()
  const user = userData?.me
  const { translations } = useTranslations()
  const t = translations?.profileForm

  const [updateProfile, { loading }] = useUpdateUserProfileMutation({
    onCompleted: () => {
      toast.success(t?.updateSuccess || 'Profile updated successfully')
      refetch()
    },
    onError: (error) => {
      toast.error(error.message || t?.updateError || 'Failed to update profile')
    },
  })

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
    values: {
      name: user?.name || '',
      email: user?.email || '',
    },
  })

  const onSubmit = async (data: ProfileFormValues) => {
    await updateProfile({
      variables: {
        input: {
          name: data.name,
        },
      },
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t?.nameLabel || 'Name'}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t?.namePlaceholder || 'Enter your name'}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t?.emailLabel || 'Email'}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  {...field}
                  disabled
                  className="bg-muted"
                />
              </FormControl>
              <FormMessage />
              <p className="text-sm text-muted-foreground">
                {t?.emailDisabled || 'Email cannot be changed'}
              </p>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
          {loading
            ? t?.updating || 'Updating...'
            : t?.updateButton || 'Save Changes'}
        </Button>
      </form>
    </Form>
  )
}

