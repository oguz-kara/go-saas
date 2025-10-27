// src/components/layout/header.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import Sidebar from './sidebar'
import { PanelLeft } from 'lucide-react'
import { navigationHierarchy } from '@/constants/navigation-hierarchy'
import { useTranslations } from '@/hooks/use-translations'
import { routes } from '@/lib/routes'

export default function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const { translations } = useTranslations()

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:bg-transparent sm:px-6 md:p-3 lg:px-8 lg:p-4">
      {/* Mobil Görünüm için Drawer Menü */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">
              {translations?.header.openNavigation}
            </span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="sm:max-w-xs"
          aria-describedby={translations?.sidebar.description}
        >
          <SheetHeader>
            <SheetTitle>CRM</SheetTitle>
            <SheetDescription>
              {translations?.sidebar.description || 'Navigation menu'}
            </SheetDescription>
          </SheetHeader>
          <Sidebar onLinkClick={() => setIsSheetOpen(false)} />
        </SheetContent>
      </Sheet>

      <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
        <Link
          href={routes.companies.list()}
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            GoCRM
          </span>
        </Link>
          {navigationHierarchy.map((route) => (
            <Link
              key={route.label}
              href={route.href}
              className="text-foreground transition-colors hover:text-foreground"
            >
              {route.label}
            </Link>
          ))}
      </nav>
    </header>
  )
}
