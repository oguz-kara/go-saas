// src/components/layout/header.tsx
'use client'

import { useState } from 'react'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@gocrm/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@gocrm/components/ui/dropdown-menu'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@gocrm/components/ui/avatar'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@gocrm/components/ui/sheet' // Sheet komponentini import et
import Sidebar from './sidebar' // Sidebar'ı mobil menü içeriği olarak kullanacağız
import { PanelLeft, Settings, LogOut, Loader2 } from 'lucide-react'
import { useRoutes } from '../../hooks/use-routes'
import { navigationHierarchy } from '@gocrm/constants/navigation-hierarchy'
import { useTranslations } from '@gocrm/hooks/use-translations'
import { useLogoutUserMutation } from '@gocrm/graphql/generated/hooks'

export default function Header() {
  const { data: session } = useSession()
  const user = session?.user
  const [isSheetOpen, setIsSheetOpen] = useState(false) // Mobil menünün açık/kapalı durumunu yönetmek için
  const { routes } = useRoutes()
  const { translations } = useTranslations()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const getInitials = (name?: string | null) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
  }

  const [logoutUserMutation] = useLogoutUserMutation({
    onCompleted: () => {
      signOut({ callbackUrl: '/login?logged_out=true' })
    },
    onError: (error) => {
      console.error('Backend logout failed:', error)
      signOut({ callbackUrl: '/login' })
    },
  })

  const handleSignOut = () => {
    setIsLoggingOut(true)
    logoutUserMutation()
  }

  return (
    <header className="p-4 md:p-6 md:p-4 lg:p-8 sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:bg-transparent sm:px-6">
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

      {routes && (
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link
            href={routes.companies}
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
      )}

      {/* Kullanıcı Profili Menüsü (Sağ Taraf) */}
      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="overflow-hidden rounded-full"
            >
              <Avatar>
                <AvatarImage
                  src={user?.image || undefined}
                  alt={user?.name || 'User'}
                />
                <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>{translations?.header.settings}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-red-600 focus:bg-red-50 focus:text-red-700"
            >
              {isLoggingOut ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="mr-2 h-4 w-4" />
              )}
              <span>
                {isLoggingOut
                  ? translations?.header.signingOut
                  : translations?.header.signOut}
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
