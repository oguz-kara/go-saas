'use client'

import { usePathname } from 'next/navigation'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@gocrm/components/ui/breadcrumb'
import { useTranslations } from '@gocrm/hooks/use-translations'
import Link from '../common/link'
import { routes } from '@gocrm/lib/routes'

interface BreadcrumbSegment {
  label: string
  href?: string
  isLast?: boolean
}

export function DynamicBreadcrumb() {
  const pathname = usePathname()
  const { translations } = useTranslations()

  const generateBreadcrumbs = (): BreadcrumbSegment[] => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbSegment[] = []

    // Always start with dashboard as home
    breadcrumbs.push({
      label: translations?.breadcrumb?.dashboard || 'Dashboard',
      href: routes.dashboard(),
    })

    if (segments.length === 0 || segments[0] === 'dashboard') {
      return breadcrumbs
    }

    let currentPath = ''

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === segments.length - 1

      // Get translation key for the segment
      const translationKey = segment as keyof typeof routes
      const label = translations?.breadcrumb?.[translationKey] || segment

      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath,
        isLast,
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem className={index === 0 ? 'hidden md:block' : ''}>
              {breadcrumb.isLast ? (
                <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={breadcrumb.href!}>{breadcrumb.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
