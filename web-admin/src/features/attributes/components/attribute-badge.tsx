'use client'
import { Badge } from '@gocrm/components/ui/badge'

interface AttributeBadgeProps {
  // getCompanyById sorgusundan gelen attribute verisinin tipi
  attribute: {
    value: string
    type: {
      name: string
    }
  }
}

export const AttributeBadge = ({ attribute }: AttributeBadgeProps) => {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="font-semibold text-muted-foreground">
        {attribute.type.name}:
      </span>
      <Badge variant="secondary">{attribute.value}</Badge>
    </div>
  )
}
