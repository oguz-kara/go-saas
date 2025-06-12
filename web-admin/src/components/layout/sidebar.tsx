// src/components/layout/sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@gocrm/lib/utils'
import { navigationHierarchy } from '@gocrm/constants/navigation-hierarchy'

interface SidebarProps {
  className?: string
  onLinkClick?: () => void // Mobil menüde linke tıklanınca menüyü kapatmak için
}

// Komponenti artık dışarıdan gelen class'ları ve bir callback fonksiyonunu alacak şekilde güncelleyelim.
export default function Sidebar({ className, onLinkClick }: SidebarProps) {
  const pathname = usePathname()

  return (
    <nav className={cn('flex flex-col gap-2 text-lg font-medium', className)}>
      {navigationHierarchy.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          onClick={onLinkClick} // Linke tıklandığında bu fonksiyonu çağır
          className={cn(
            'flex items-center gap-4 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
            {
              'bg-muted text-primary': pathname.startsWith(link.href), // Aktif linki vurgulama
            },
          )}
        >
          <link.icon className="h-5 w-5" />
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
