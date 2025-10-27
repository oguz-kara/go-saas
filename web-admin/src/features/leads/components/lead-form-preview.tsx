'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@gocrm/components/ui/card'
import { Progress } from '@gocrm/components/ui/progress'
import { Badge } from '@gocrm/components/ui/badge'
import {
  User,
  Mail,
  Phone,
  Building2,
  Globe,
  Target,
  DollarSign,
  Calendar,
  Users,
} from 'lucide-react'
import { LeadFormValues } from '../schemas/lead-form.schema'
import { useTranslations } from '@gocrm/hooks/use-translations'
import { useMemo } from 'react'

interface LeadFormPreviewProps {
  values: Partial<LeadFormValues>
  users: Array<{ id: string; name?: string | null; email: string }>
}

export function LeadFormPreview({ values, users }: LeadFormPreviewProps) {
  const { translations } = useTranslations()
  const t = translations?.leadForm
  const tStatus = translations?.leadStatus
  const tSource = translations?.leadSource
  const tPriority = translations?.leadPriority

  // Calculate completion percentage
  const completionPercentage = useMemo(() => {
    // const requiredFields = ['firstName', 'lastName', 'email'] as const
    const allFields = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'company',
      'jobTitle',
      'website',
      'status',
      'source',
      'priority',
      'assignedToId',
      'budget',
      'timeline',
      'companySize',
      'productInterest',
      'isDecisionMaker',
      'painPoints',
      'currentSolution',
    ] as const

    const filledFields = allFields.filter((field) => {
      const value = values[field]
      if (Array.isArray(value)) return value.length > 0
      return value !== null && value !== undefined && value !== ''
    }).length

    return Math.round((filledFields / allFields.length) * 100)
  }, [values])

  const assignedUser = useMemo(() => {
    if (!values.assignedToId) return null
    return users.find((u) => u.id === values.assignedToId)
  }, [values.assignedToId, users])

  const fullName = [values.firstName, values.lastName]
    .filter(Boolean)
    .join(' ')
    .trim()

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            {t?.previewTitle || 'Lead Preview'}
          </CardTitle>
          <Badge variant="outline" className="font-normal">
            {completionPercentage}% {t?.complete || 'Complete'}
          </Badge>
        </div>
        <Progress value={completionPercentage} className="mt-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Contact Summary */}
        <div>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <User className="size-4" />
            {t?.contactInfoTitle || 'Contact Information'}
          </h4>
          <div className="space-y-2 text-sm">
            {fullName ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="size-3.5" />
                <span className="font-medium text-foreground">{fullName}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="size-3.5" />
                <span className="italic">{t?.noName || 'No name'}</span>
              </div>
            )}
            {values.email ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="size-3.5" />
                <span>{values.email}</span>
              </div>
            ) : null}
            {values.phone ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="size-3.5" />
                <span>{values.phone}</span>
              </div>
            ) : null}
            {values.company ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="size-3.5" />
                <span>{values.company}</span>
              </div>
            ) : null}
            {values.website ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Globe className="size-3.5" />
                <span className="truncate">{values.website}</span>
              </div>
            ) : null}
          </div>
        </div>

        {/* Lead Details */}
        <div>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Target className="size-4" />
            {t?.leadDetailsTitle || 'Lead Details'}
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {t?.statusLabel || 'Status'}:
              </span>
              <Badge variant="outline" className="text-xs">
                {values.status
                  ? tStatus?.[values.status] || values.status
                  : t?.notSet || 'Not set'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {t?.priorityLabel || 'Priority'}:
              </span>
              <Badge
                variant={
                  values.priority === 'HIGH' || values.priority === 'URGENT'
                    ? 'destructive'
                    : 'outline'
                }
                className="text-xs"
              >
                {values.priority
                  ? tPriority?.[values.priority] || values.priority
                  : t?.notSet || 'Not set'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {t?.sourceLabel || 'Source'}:
              </span>
              <span className="text-xs">
                {values.source
                  ? tSource?.[values.source] || values.source
                  : t?.notSet || 'Not set'}
              </span>
            </div>
            {assignedUser ? (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {t?.assignedToLabel || 'Assigned To'}:
                </span>
                <span className="text-xs font-medium">
                  {assignedUser.name || assignedUser.email}
                </span>
              </div>
            ) : null}
          </div>
        </div>

        {/* Qualification */}
        <div>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <DollarSign className="size-4" />
            {t?.qualificationTitle || 'Qualification'}
          </h4>
          <div className="space-y-2 text-sm">
            {values.budget ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSign className="size-3.5" />
                <span>{values.budget}</span>
              </div>
            ) : null}
            {values.timeline ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="size-3.5" />
                <span>{values.timeline}</span>
              </div>
            ) : null}
            {values.companySize ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="size-3.5" />
                <span>
                  {String(values.companySize ?? '')}{' '}
                  {t?.employees || 'employees'}
                </span>
              </div>
            ) : null}
            {values.isDecisionMaker !== null &&
            values.isDecisionMaker !== undefined ? (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {t?.isDecisionMakerLabel || 'Decision Maker'}:
                </span>
                <Badge
                  variant={values.isDecisionMaker ? 'default' : 'outline'}
                  className="text-xs"
                >
                  {values.isDecisionMaker
                    ? t?.yesOption || 'Yes'
                    : t?.noOption || 'No'}
                </Badge>
              </div>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
