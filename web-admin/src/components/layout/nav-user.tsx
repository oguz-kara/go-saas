'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BadgeCheck, ChevronsUpDown, LogOut, Loader2 } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@gocrm/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@gocrm/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@gocrm/components/ui/sidebar'
import { Skeleton } from '@gocrm/components/ui/skeleton'
import { useLogoutUserMutation } from '@gocrm/graphql/generated/hooks'
import { routes } from '@gocrm/lib/routes'
import Link from '../common/link'
import { useTranslations } from '@gocrm/hooks/use-translations'

export function NavUser() {
  const { isMobile } = useSidebar()
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { translations } = useTranslations()
  const t = translations?.sidebar

  const [logoutUserMutation] = useLogoutUserMutation({
    onCompleted: () => {
      signOut({ callbackUrl: `${routes.login()}?logged_out=true` })
    },
    onError: (error) => {
      console.error('Backend logout failed:', error)
      signOut({ callbackUrl: routes.login() })
    },
  })

  const handleSignOut = () => {
    setIsLoggingOut(true)
    logoutUserMutation()
  }

  const handleAccountClick = () => {
    router.push(routes.settings.account())
  }

  if (status === 'loading')
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-1 h-3 w-32" />
            </div>
            <Skeleton className="ml-auto h-4 w-4" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )

  const user = session?.user as {
    name: string
    email: string
    avatar: string
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleAccountClick}>
                <Link
                  href={routes.settings.account()}
                  className="flex items-center gap-2"
                >
                  <BadgeCheck />
                  {t?.accountMenuItem || 'Account'}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-red-600 focus:bg-red-50 focus:text-red-700"
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut />
              )}
              {isLoggingOut
                ? t?.loggingOut || 'Logging out...'
                : t?.logOut || 'Log out'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
