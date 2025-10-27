'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@gocrm/components/ui/button'
import { Input } from '@gocrm/components/ui/input'
import { Textarea } from '@gocrm/components/ui/textarea'
import { Badge } from '@gocrm/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@gocrm/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@gocrm/components/ui/form'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@gocrm/components/ui/tabs'
import { LeadFormValues, leadFormSchema } from '../schemas/lead-form.schema'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@gocrm/components/ui/select'
import { useMemo } from 'react'
import { useUsersQuery } from '@gocrm/graphql/generated/hooks'
import { useTranslations } from '@gocrm/hooks/use-translations'
import {
  User,
  Mail,
  Phone,
  Globe,
  Building2,
  Target,
  ClipboardCheck,
  DollarSign,
} from 'lucide-react'
import { LeadFormPreview } from './lead-form-preview'

interface LeadFormProps {
  onSubmit: (values: LeadFormValues) => void
  isSubmitting: boolean
  initialValues?: Partial<LeadFormValues>
}

export const LeadForm = ({
  onSubmit,
  isSubmitting,
  initialValues,
}: LeadFormProps) => {
  const { translations } = useTranslations()
  const t = translations?.leadForm
  const tStatus = translations?.leadStatus
  const tSource = translations?.leadSource
  const tPriority = translations?.leadPriority
  const tProductInterest = translations?.leadProductInterest

  const defaults: LeadFormValues = {
    firstName: initialValues?.firstName ?? '',
    lastName: initialValues?.lastName ?? '',
    email: initialValues?.email ?? '',
    phone: initialValues?.phone ?? null,
    company: initialValues?.company ?? null,
    jobTitle: initialValues?.jobTitle ?? null,
    website: initialValues?.website ?? null,
    status: initialValues?.status ?? 'NEW',
    source: initialValues?.source ?? 'ADMIN',
    priority: initialValues?.priority ?? 'MEDIUM',
    productInterest: initialValues?.productInterest ?? null,
    budget: initialValues?.budget ?? null,
    timeline: initialValues?.timeline ?? null,
    companySize: initialValues?.companySize ?? null,
    isDecisionMaker: initialValues?.isDecisionMaker ?? null,
    painPoints: initialValues?.painPoints ?? null,
    currentSolution: initialValues?.currentSolution ?? null,
    assignedToId: initialValues?.assignedToId ?? undefined,
  }

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: defaults,
  })

  const { data: usersData } = useUsersQuery({
    variables: { skip: 0, take: 100 },
  })
  const users = useMemo(() => usersData?.getUsers.items || [], [usersData])

  // Watch form values for live preview
  const watchedValues = form.watch()

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left Column - Form with Tabs */}
          <div className="flex-1 lg:max-w-2xl">
            <Tabs defaultValue="contact" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="contact" className="gap-2">
                  <User className="size-4" />
                  <span className="hidden sm:inline">{t?.contactInfoTitle || 'Contact'}</span>
                  <span className="sm:hidden">{t?.mobileTabContact || 'Contact'}</span>
                </TabsTrigger>
                <TabsTrigger value="details" className="gap-2">
                  <Target className="size-4" />
                  <span className="hidden sm:inline">{t?.leadDetailsTitle || 'Details'}</span>
                  <span className="sm:hidden">{t?.mobileTabDetails || 'Details'}</span>
                </TabsTrigger>
                <TabsTrigger value="qualification" className="gap-2">
                  <ClipboardCheck className="size-4" />
                  <span className="hidden sm:inline">{t?.qualificationTitle || 'Qualification'}</span>
                  <span className="sm:hidden">{t?.mobileTabQualification || 'Qual.'}</span>
                </TabsTrigger>
              </TabsList>

              {/* Contact Information Tab */}
              <TabsContent value="contact" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="size-5" />
                      {t?.contactInfoTitle || 'Contact Information'}
                    </CardTitle>
                    <CardDescription>
                      {t?.contactInfoDescription ||
                        'Basic contact details for the lead'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              {t?.firstNameLabel || 'First Name'}
                              <Badge
                                variant="outline"
                                className="text-xs font-normal"
                              >
                                {t?.required || 'Required'}
                              </Badge>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={
                                  t?.firstNamePlaceholder || 'John'
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
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              {t?.lastNameLabel || 'Last Name'}
                              <Badge
                                variant="outline"
                                className="text-xs font-normal"
                              >
                                {t?.required || 'Required'}
                              </Badge>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t?.lastNamePlaceholder || 'Doe'}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Mail className="size-4" />
                            {t?.emailLabel || 'Email'}
                            <Badge
                              variant="outline"
                              className="text-xs font-normal"
                            >
                              {t?.required || 'Required'}
                            </Badge>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder={
                                t?.emailPlaceholder || 'john@example.com'
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
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Phone className="size-4" />
                            {t?.phoneLabel || 'Phone'}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={
                                t?.phonePlaceholder || '+1 (555) 000-0000'
                              }
                              {...field}
                              value={field.value ?? ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Building2 className="size-4" />
                              {t?.companyLabel || 'Company'}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={
                                  t?.companyPlaceholder || 'Acme Inc.'
                                }
                                {...field}
                                value={field.value ?? ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="jobTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t?.jobTitleLabel || 'Job Title'}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={
                                  t?.jobTitlePlaceholder || 'Sales Manager'
                                }
                                {...field}
                                value={field.value ?? ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Globe className="size-4" />
                            {t?.websiteLabel || 'Website'}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={
                                t?.websitePlaceholder || 'https://example.com'
                              }
                              {...field}
                              value={field.value ?? ''}
                            />
                          </FormControl>
                          <FormDescription>
                            {t?.websiteDescription ||
                              'Enter full URL including https://'}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Lead Details Tab */}
              <TabsContent value="details" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="size-5" />
                      {t?.leadDetailsTitle || 'Lead Details'}
                    </CardTitle>
                    <CardDescription>
                      {t?.leadDetailsDescription ||
                        'Lead classification and assignment'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t?.statusLabel || 'Status'}
                            </FormLabel>
                            <FormControl>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {[
                                    'NEW',
                                    'CONTACTED',
                                    'QUALIFIED',
                                    'PROPOSAL_SENT',
                                    'NEGOTIATION',
                                    'CONVERTED',
                                    'LOST',
                                    'UNQUALIFIED',
                                  ].map((s) => (
                                    <SelectItem key={s} value={s}>
                                      {tStatus?.[s] || s}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="source"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t?.sourceLabel || 'Source'}
                            </FormLabel>
                            <FormControl>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {[
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
                                  ].map((s) => (
                                    <SelectItem key={s} value={s}>
                                      {tSource?.[s] || s}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t?.priorityLabel || 'Priority'}
                            </FormLabel>
                            <FormControl>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map(
                                    (s) => (
                                      <SelectItem key={s} value={s}>
                                        {tPriority?.[s] || s}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="assignedToId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t?.assignedToLabel || 'Assigned To'}
                            </FormLabel>
                            <FormControl>
                              <Select
                                value={field.value ?? undefined}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={
                                      t?.selectUserPlaceholder || 'Select user'
                                    }
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {users.map((u) => (
                                    <SelectItem key={u.id} value={u.id}>
                                      {u.name || u.email}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Qualification Tab */}
              <TabsContent value="qualification" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ClipboardCheck className="size-5" />
                      {t?.qualificationTitle || 'Qualification Information'}
                    </CardTitle>
                    <CardDescription>
                      {t?.qualificationDescription ||
                        'Detailed qualification and interest data'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <DollarSign className="size-4" />
                              {t?.budgetLabel || 'Budget'}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={
                                  t?.budgetPlaceholder || '50000'
                                }
                                {...field}
                                value={field.value ?? ''}
                              />
                            </FormControl>
                            <FormDescription>
                              {t?.budgetDescription ||
                                'Estimated budget in USD'}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="timeline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t?.timelineLabel || 'Timeline'}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={
                                  t?.timelinePlaceholder || 'Q2 2025'
                                }
                                {...field}
                                value={field.value ?? ''}
                              />
                            </FormControl>
                            <FormDescription>
                              {t?.timelineDescription ||
                                'Expected decision timeframe'}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="companySize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t?.companySizeLabel || 'Company Size'}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder={
                                  t?.companySizePlaceholder || '50'
                                }
                                {...field}
                                value={field.value ?? ''}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value
                                      ? Number(e.target.value)
                                      : null
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="productInterest"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t?.productInterestLabel || 'Product Interest'}
                            </FormLabel>
                            <FormControl>
                              <Select
                                value={field.value?.join(',') ?? ''}
                                onValueChange={(value) => {
                                  field.onChange(value ? value.split(',') : null)
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={
                                      t?.selectProductsPlaceholder ||
                                      'Select products'
                                    }
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {[
                                    'SAAS',
                                    'MOBILE_APP',
                                    'WEB_APP',
                                    'CUSTOM_SOFTWARE',
                                    'API_INTEGRATION',
                                    'CONSULTING',
                                    'OTHER',
                                  ].map((p) => (
                                    <SelectItem key={p} value={p}>
                                      {tProductInterest?.[p] || p}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormDescription>
                              {t?.productInterestDescription ||
                                'Select primary products of interest'}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="isDecisionMaker"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t?.isDecisionMakerLabel || 'Is Decision Maker'}
                            </FormLabel>
                            <FormControl>
                              <Select
                                value={
                                  field.value === null ? '' : String(field.value)
                                }
                                onValueChange={(value) => {
                                  field.onChange(
                                    value === '' ? null : value === 'true'
                                  )
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={
                                      t?.selectPlaceholder || 'Select'
                                    }
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="true">
                                    {t?.yesOption || 'Yes'}
                                  </SelectItem>
                                  <SelectItem value="false">
                                    {t?.noOption || 'No'}
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="painPoints"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t?.painPointsLabel || 'Pain Points'}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              rows={4}
                              placeholder={
                                t?.painPointsPlaceholder ||
                                'Describe the main challenges...'
                              }
                              {...field}
                              value={field.value ?? ''}
                            />
                          </FormControl>
                          <FormDescription>
                            {t?.painPointsDescription ||
                              'Describe current challenges or problems'}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="currentSolution"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t?.currentSolutionLabel || 'Current Solution'}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              rows={4}
                              placeholder={
                                t?.currentSolutionPlaceholder ||
                                'What tools or processes are currently in use?'
                              }
                              {...field}
                              value={field.value ?? ''}
                            />
                          </FormControl>
                          <FormDescription>
                            {t?.currentSolutionDescription ||
                              'What tools or processes are currently in use?'}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Submit Button */}
            <div className="mt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting
                  ? t?.submittingButton || 'Saving...'
                  : t?.submitButton || 'Save Lead'}
              </Button>
            </div>
          </div>

          {/* Right Column - Live Preview (hidden on mobile) */}
          <div className="hidden lg:block lg:w-96">
            <LeadFormPreview
              values={watchedValues}
              users={users as Array<{ id: string; name?: string | null; email: string }>}
            />
          </div>
        </div>
      </form>
    </Form>
  )
}
