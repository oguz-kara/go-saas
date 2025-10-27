'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@gocrm/components/ui/card'
import { ProfileForm } from '@gocrm/features/auth/components/profile-form'
import { ChangePasswordDialog } from '@gocrm/features/auth/components/change-password-dialog'
import { useTranslations } from '@gocrm/hooks/use-translations'
import { PageHeader } from '@gocrm/components/common/page-header'

export default function AccountPage() {
  const { translations } = useTranslations()
  const t = translations?.accountSettings

  return (
    <div className="max-w-4xl">
      <div className="space-y-6">
        <PageHeader
          title={t?.title || 'Account Settings'}
          description={
            t?.description || 'Manage your account settings and preferences'
          }
          titleSize="sm"
        />

        <Card>
          <CardHeader>
            <CardTitle>{t?.profileTitle || 'Profile Information'}</CardTitle>
            <CardDescription>
              {t?.profileDescription ||
                'Update your personal information. Your email address cannot be changed.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t?.securityTitle || 'Security'}</CardTitle>
            <CardDescription>
              {t?.securityDescription ||
                'Manage your password and security settings'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-sm font-medium">
                  {t?.passwordLabel || 'Password'}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  {t?.passwordDescription ||
                    'Update your password to keep your account secure. We recommend using a strong, unique password.'}
                </p>
                <ChangePasswordDialog />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
