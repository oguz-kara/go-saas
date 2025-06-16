'use client'

import { Input } from '@gocrm/components/ui/input'
import { Facebook, Twitter, Linkedin } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslations } from '@gocrm/hooks/use-translations'

interface SocialProfilesInputProps {
  value?: Record<string, string> | string
  onChange: (value: Record<string, string>) => void
}

const socialPlatforms = [
  { name: 'facebook', icon: Facebook },
  { name: 'twitter', icon: Twitter },
  { name: 'linkedin', icon: Linkedin },
]

export const SocialProfilesInput = ({
  value,
  onChange,
}: SocialProfilesInputProps) => {
  const { translations } = useTranslations()
  const [profiles, setProfiles] = useState<Record<string, string>>({})

  useEffect(() => {
    let initialProfiles: Record<string, string> = {}
    if (typeof value === 'string' && value) {
      try {
        const parsed = JSON.parse(value)
        if (typeof parsed === 'object' && parsed !== null) {
          initialProfiles = parsed
        }
      } catch (error) {
        console.error('Failed to parse social profiles JSON:', error)
      }
    } else if (typeof value === 'object' && value !== null) {
      initialProfiles = value
    }
    setProfiles(initialProfiles)
  }, [value])

  const handleProfileChange = (platform: string, url: string) => {
    const newProfiles = { ...profiles, [platform]: url }
    setProfiles(newProfiles)
    onChange(newProfiles)
  }

  return (
    <div className="space-y-4 rounded-md border p-4">
      {socialPlatforms.map(({ name, icon: Icon }) => (
        <div key={name} className="relative">
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder={
              (translations?.socials as Record<string, string>)?.[
                `${name}Placeholder`
              ] || `https://www.${name}.com/...`
            }
            value={profiles[name] || ''}
            onChange={(e) => handleProfileChange(name, e.target.value)}
            aria-label={`${name} profile URL`}
          />
        </div>
      ))}
    </div>
  )
} 