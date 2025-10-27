'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@gocrm/components/ui/card'
import { Badge } from '@gocrm/components/ui/badge'
import { Button } from '@gocrm/components/ui/button'
import { Avatar, AvatarFallback } from '@gocrm/components/ui/avatar'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@gocrm/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@gocrm/components/ui/dropdown-menu'
import { GetLeadDetailQuery } from '@gocrm/graphql/generated/hooks'
import { LeadActivities } from './lead-activities'
import { LeadNotes } from './lead-notes'
import Link from '@gocrm/components/common/link'
import { WhatsAppIcon } from '@gocrm/components/ui/whatsapp-icon'
import { DeleteLeadAlert } from './delete-lead-alert'
import { AddActivityDialog } from './add-activity-dialog'
import { AddNoteInline } from './add-note-inline'
import { routes } from '@gocrm/lib/routes'
import { useTranslations } from '@gocrm/hooks/use-translations'
import {
  User,
  Mail,
  Phone,
  Building2,
  Globe,
  Briefcase,
  Target,
  DollarSign,
  Calendar,
  Users,
  FileText,
  Edit,
  MessageSquare,
  Activity,
} from 'lucide-react'
import { format } from 'date-fns'

type Lead = NonNullable<GetLeadDetailQuery['lead']>

function getInitials(
  firstName?: string | null,
  lastName?: string | null,
): string {
  const first = firstName?.charAt(0)?.toUpperCase() || ''
  const last = lastName?.charAt(0)?.toUpperCase() || ''
  return `${first}${last}` || '?'
}

function getPriorityVariant(
  priority: string,
): 'default' | 'destructive' | 'outline' | 'secondary' {
  if (priority === 'HIGH' || priority === 'URGENT') return 'destructive'
  if (priority === 'MEDIUM') return 'secondary'
  return 'outline'
}

function getStatusVariant(
  status: string,
): 'default' | 'destructive' | 'outline' | 'secondary' {
  if (status === 'CONVERTED' || status === 'QUALIFIED') return 'default'
  if (status === 'LOST' || status === 'UNQUALIFIED') return 'destructive'
  return 'outline'
}

function sanitizePhoneForWhatsApp(phone: string): string {
  // Remove all non-numeric characters except the leading +
  return phone.replace(/[^\d+]/g, '')
}

export function LeadDetailView({ lead }: { lead: Lead }) {
  const { translations } = useTranslations()
  const t = translations?.leadDetail
  const tStatus = translations?.leadStatus
  const tSource = translations?.leadSource
  const tPriority = translations?.leadPriority

  const initials = getInitials(lead.firstName, lead.lastName)
  const fullName = `${lead.firstName || ''} ${lead.lastName || ''}`.trim()

  return (
    <div className="container mx-auto space-y-6 py-6">
      {/* Hero Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-4">
              <Avatar className="size-16">
                <AvatarFallback className="text-lg font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">
                  {fullName || t?.unnamed || 'Unnamed Lead'}
                </h1>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant={getStatusVariant(lead.status)}>
                    {tStatus?.[lead.status] || lead.status}
                  </Badge>
                  <Badge variant={getPriorityVariant(lead.priority)}>
                    {tPriority?.[lead.priority] || lead.priority}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {lead.email && (
                <Button size="sm" variant="outline" asChild>
                  <a href={`mailto:${lead.email}`}>
                    <Mail className="mr-2 size-4" />
                    {t?.emailAction || 'Email'}
                  </a>
                </Button>
              )}
              <Button size="sm" variant="outline" asChild>
                <Link href={routes.leads.edit(lead.id)}>
                  <Edit className="mr-2 size-4" />
                  {t?.editAction || 'Edit'}
                </Link>
              </Button>
              <DeleteLeadAlert id={lead.id} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Contact Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="size-5" />
              {t?.contactInfoTitle || 'Contact Information'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {lead.email && (
              <div className="flex items-center gap-3 text-sm">
                <Mail className="size-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">
                    {t?.emailLabel || 'Email'}
                  </div>
                  <a href={`mailto:${lead.email}`} className="hover:underline">
                    {lead.email}
                  </a>
                </div>
              </div>
            )}
            {lead.phone && (
              <div className="flex items-center gap-3 text-sm">
                <Phone className="size-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">
                    {t?.phoneLabel || 'Phone'}
                  </div>
                  <a href={`tel:${lead.phone}`} className="hover:underline">
                    {lead.phone}
                  </a>
                </div>
              </div>
            )}
            {lead.company && (
              <div className="flex items-center gap-3 text-sm">
                <Building2 className="size-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">
                    {t?.companyLabel || 'Company'}
                  </div>
                  <div>{lead.company}</div>
                </div>
              </div>
            )}
            {lead.jobTitle && (
              <div className="flex items-center gap-3 text-sm">
                <Briefcase className="size-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">
                    {t?.jobTitleLabel || 'Job Title'}
                  </div>
                  <div>{lead.jobTitle}</div>
                </div>
              </div>
            )}
            {lead.website && (
              <div className="flex items-center gap-3 text-sm">
                <Globe className="size-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">
                    {t?.websiteLabel || 'Website'}
                  </div>
                  <a
                    href={lead.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {lead.website}
                  </a>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lead Intelligence Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="size-5" />
              {t?.intelligenceTitle || 'Lead Intelligence'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {t?.statusLabel || 'Status'}
              </span>
              <Badge variant={getStatusVariant(lead.status)}>
                {tStatus?.[lead.status] || lead.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {t?.priorityLabel || 'Priority'}
              </span>
              <Badge variant={getPriorityVariant(lead.priority)}>
                {tPriority?.[lead.priority] || lead.priority}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {t?.sourceLabel || 'Source'}
              </span>
              <Badge variant="outline">
                {tSource?.[lead.source] || lead.source}
              </Badge>
            </div>
            {lead.assignedTo && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {t?.assignedToLabel || 'Assigned To'}
                </span>
                <div className="flex items-center gap-2">
                  <Avatar className="size-6">
                    <AvatarFallback className="text-xs">
                      {lead.assignedTo.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">
                    {lead.assignedTo.name || lead.assignedTo.email}
                  </span>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {t?.createdLabel || 'Created'}
              </span>
              <span>{format(new Date(lead.createdAt), 'MMM dd, yyyy')}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {t?.updatedLabel || 'Updated'}
              </span>
              <span>{format(new Date(lead.updatedAt), 'MMM dd, yyyy')}</span>
            </div>
          </CardContent>
        </Card>

        {/* Qualification Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <DollarSign className="size-5" />
              {t?.qualificationTitle || 'Qualification'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {lead.budget && (
              <div className="flex items-center gap-3 text-sm">
                <DollarSign className="size-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">
                    {t?.budgetLabel || 'Budget'}
                  </div>
                  <div className="font-medium">${lead.budget}</div>
                </div>
              </div>
            )}
            {lead.timeline && (
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="size-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">
                    {t?.timelineLabel || 'Timeline'}
                  </div>
                  <div>{lead.timeline}</div>
                </div>
              </div>
            )}
            {lead.companySize && (
              <div className="flex items-center gap-3 text-sm">
                <Users className="size-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">
                    {t?.companySizeLabel || 'Company Size'}
                  </div>
                  <div>
                    {lead.companySize} {t?.employees || 'employees'}
                  </div>
                </div>
              </div>
            )}
            {lead.isDecisionMaker !== null && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {t?.decisionMakerLabel || 'Decision Maker'}
                </span>
                <Badge variant={lead.isDecisionMaker ? 'default' : 'outline'}>
                  {lead.isDecisionMaker ? t?.yes || 'Yes' : t?.no || 'No'}
                </Badge>
              </div>
            )}
            {lead.productInterest && lead.productInterest.length > 0 && (
              <div className="text-sm">
                <div className="mb-2 text-xs text-muted-foreground">
                  {t?.productInterestLabel || 'Product Interest'}
                </div>
                <div className="flex flex-wrap gap-1">
                  {lead.productInterest.map((p) => (
                    <Badge key={p} variant="secondary" className="text-xs">
                      {p}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Context Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="size-5" />
              {t?.contextTitle || 'Additional Context'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {lead.painPoints && (
              <div className="text-sm">
                <div className="mb-1 text-xs font-medium text-muted-foreground">
                  {t?.painPointsLabel || 'Pain Points'}
                </div>
                <p className="whitespace-pre-wrap text-foreground">
                  {lead.painPoints}
                </p>
              </div>
            )}
            {lead.currentSolution && (
              <div className="text-sm">
                <div className="mb-1 text-xs font-medium text-muted-foreground">
                  {t?.currentSolutionLabel || 'Current Solution'}
                </div>
                <p className="whitespace-pre-wrap text-foreground">
                  {lead.currentSolution}
                </p>
              </div>
            )}
            {!lead.painPoints && !lead.currentSolution && (
              <div className="text-sm text-muted-foreground">
                {t?.noContext || 'No additional context provided'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activities & Notes Tabs */}
      <Tabs defaultValue="activities" className="mt-2">
        <TabsList>
          <TabsTrigger value="activities" className="gap-2">
            <Activity className="size-4" />
            {t?.activitiesTab || 'Activities'}
          </TabsTrigger>
          <TabsTrigger value="notes" className="gap-2">
            <MessageSquare className="size-4" />
            {t?.notesTab || 'Notes'}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="activities" className="space-y-4">
          <div className="flex justify-end">
            <AddActivityDialog />
          </div>
          <LeadActivities id={lead.id} />
        </TabsContent>
        <TabsContent value="notes" className="space-y-4">
          <AddNoteInline />
          <LeadNotes id={lead.id} />
        </TabsContent>
      </Tabs>

      {/* Mobile/Tablet Communication Menu */}
      {(lead.phone || lead.email) && (
        <div className="fixed bottom-6 right-6 z-50 lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="lg"
                className="size-10 rounded-full shadow-lg"
                aria-label="Communication options"
              >
                <MessageSquare className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {lead.phone && (
                <>
                  <DropdownMenuItem asChild>
                    <a href={`tel:${lead.phone}`} className="flex items-center">
                      <Phone className="mr-2 size-4" />
                      {t?.callAction || 'Call'}
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a
                      href={`https://wa.me/${sanitizePhoneForWhatsApp(lead.phone)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      <WhatsAppIcon className="mr-2 size-4" />
                      WhatsApp
                    </a>
                  </DropdownMenuItem>
                </>
              )}
              {lead.email && (
                <DropdownMenuItem asChild>
                  <a href={`mailto:${lead.email}`} className="flex items-center">
                    <Mail className="mr-2 size-4" />
                    {t?.emailAction || 'Email'}
                  </a>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  )
}
