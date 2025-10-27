'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DatePicker } from '@/components/ui/date-picker'
import { toast } from 'sonner'
import {
  useCreateActivityMutation,
  GetActivitiesDocument,
  GetActivitiesCountDocument,
} from '@/graphql/generated/hooks'
import { useParams } from 'next/navigation'
import { z } from 'zod'
import { useTranslations } from '@/hooks/use-translations'
import { format } from 'date-fns'

export function AddActivityDialog() {
  const { translations } = useTranslations()
  const t = translations?.addActivity
  const tTypes = translations?.activityTypes

  const [open, setOpen] = useState(false)
  const [type, setType] = useState('call')
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>()
  const [scheduledTime, setScheduledTime] = useState<string>('')
  const [mutate, { loading }] = useCreateActivityMutation()
  const params = useParams() as { id?: string }

  const schema = z.object({
    type: z.string().min(1),
    subject: z.string().min(1, t?.validation_subjectRequired || 'Subject is required'),
    description: z.string().optional(),
    scheduledAt: z.string().optional(),
  })

  const onSubmit = async () => {
    try {
      const leadId = params?.id
      if (!leadId) throw new Error('Lead id missing')

      let scheduledAt: string | undefined

      if (scheduledDate) {
        if (scheduledTime) {
          // Combine date and time
          const [hours, minutes] = scheduledTime.split(':')
          const combined = new Date(scheduledDate)
          combined.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0)
          scheduledAt = combined.toISOString()
        } else {
          // Just date, set to noon
          const dateOnly = new Date(scheduledDate)
          dateOnly.setHours(12, 0, 0, 0)
          scheduledAt = dateOnly.toISOString()
        }
      }

      schema.parse({ type, subject, description, scheduledAt })

      await mutate({
        variables: {
          input: {
            type,
            subject,
            description: description || undefined,
            scheduledAt,
            leadId,
          },
        },
        refetchQueries: [
          { query: GetActivitiesDocument, variables: { leadId } },
          { query: GetActivitiesCountDocument, variables: { leadId } },
        ],
        awaitRefetchQueries: true,
      })

      toast.success(t?.successToast || 'Activity created')
      
      // Reset form
      setSubject('')
      setDescription('')
      setScheduledDate(undefined)
      setScheduledTime('')
      setOpen(false)
      
      // Dispatch event after successful creation
      window.dispatchEvent(
        new CustomEvent('lead-activities-changed', { detail: { leadId } }),
      )
    } catch (e: any) {
      toast.error(
        e?.message || t?.errorToast || 'Failed to create activity',
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">{t?.title || 'Add Activity'}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t?.title || 'New Activity'}</DialogTitle>
          <DialogDescription>
            {t?.description || 'Create a new activity for this lead'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="type">{t?.typeLabel || 'Type'}</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="call">{tTypes?.call || 'Call'}</SelectItem>
                <SelectItem value="email">{tTypes?.email || 'Email'}</SelectItem>
                <SelectItem value="meeting">
                  {tTypes?.meeting || 'Meeting'}
                </SelectItem>
                <SelectItem value="demo">{tTypes?.demo || 'Demo'}</SelectItem>
                <SelectItem value="follow_up">
                  {tTypes?.follow_up || 'Follow Up'}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="subject">{t?.subjectLabel || 'Subject'}</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={t?.subjectPlaceholder || 'Activity subject'}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">
              {t?.descriptionLabel || 'Description'}
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t?.descriptionPlaceholder || 'Activity description...'}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date">
                {t?.scheduledDateLabel || 'Scheduled Date'}
              </Label>
              <DatePicker
                value={scheduledDate}
                onChange={setScheduledDate}
                className="w-full"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time">
                {t?.scheduledTimeLabel || 'Time'}
              </Label>
              <Input
                id="time"
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                placeholder={t?.scheduledTimePlaceholder || '14:00'}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              {t?.cancelButton || 'Cancel'}
            </Button>
            <Button onClick={onSubmit} disabled={!subject.trim() || loading}>
              {loading
                ? t?.creatingButton || 'Creating...'
                : t?.createButton || 'Create'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
