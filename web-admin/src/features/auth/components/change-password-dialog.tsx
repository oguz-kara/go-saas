'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@gocrm/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@gocrm/components/ui/dialog'
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
import { Loader2, KeyRound } from 'lucide-react'
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from '../schemas/change-password.schema'
import { useChangePasswordMutation } from '@gocrm/graphql/generated/hooks'
import { useTranslations } from '@gocrm/hooks/use-translations'

export function ChangePasswordDialog() {
  const [open, setOpen] = useState(false)
  const { translations } = useTranslations()
  const t = translations?.changePassword

  const [changePassword, { loading }] = useChangePasswordMutation({
    onCompleted: (data) => {
      if (data.changePassword.success) {
        toast.success(
          data.changePassword.message ||
            t?.changeSuccess ||
            'Password changed successfully',
        )
        setOpen(false)
        form.reset()
      }
    },
    onError: (error) => {
      toast.error(
        error.message || t?.changeError || 'Failed to change password',
      )
    },
  })

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: ChangePasswordFormValues) => {
    await changePassword({
      variables: {
        input: {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        },
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <KeyRound className="mr-2 size-4" />
          {t?.triggerButton || 'Change Password'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t?.dialogTitle || 'Change Password'}</DialogTitle>
          <DialogDescription>
            {t?.dialogDescription ||
              'Enter your current password and choose a new one. Your new password must be at least 8 characters long.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t?.currentPasswordLabel || 'Current Password'}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={
                        t?.currentPasswordPlaceholder ||
                        'Enter current password'
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t?.newPasswordLabel || 'New Password'}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={
                        t?.newPasswordPlaceholder || 'Enter new password'
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t?.confirmPasswordLabel || 'Confirm New Password'}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={
                        t?.confirmPasswordPlaceholder ||
                        'Confirm new password'
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                {t?.cancelButton || 'Cancel'}
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
                {loading
                  ? t?.changing || 'Changing...'
                  : t?.changeButton || 'Change Password'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

