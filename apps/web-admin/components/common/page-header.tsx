import { LucideIcon } from 'lucide-react'
import { Separator } from '../ui/separator'

interface PageHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
  titleSize?: 'default' | 'lg' | 'sm'
  icon?: LucideIcon
}

export function PageHeader({
  title,
  description,
  children,
  className,
  titleSize = 'default',
  icon: Icon,
}: PageHeaderProps) {
  const titleClasses = {
    default: 'text-3xl font-bold tracking-tight',
    lg: 'text-4xl font-bold tracking-tight',
    sm: 'text-2xl font-bold tracking-tight',
  }

  const titleElement = (
    <div>
      <h1 className={titleClasses[titleSize]}>{title}</h1>
      {description && (
        <p className="text-muted-foreground mt-2">{description}</p>
      )}
    </div>
  )

  // If icon is provided, wrap content with icon layout
  if (Icon) {
    return (
      <>
        <div className={`flex items-center justify-between ${className || ''}`}>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Icon className="size-6 text-primary" />
            </div>
            {titleElement}
          </div>
          {children && <div>{children}</div>}
        </div>
        <Separator />
      </>
    )
  }

  return (
    <>
      <div className={`flex items-center justify-between ${className || ''}`}>
        {titleElement}
        {children && <div>{children}</div>}
      </div>
      <Separator />
    </>
  )
}
