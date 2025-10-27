'use client'

import * as React from 'react'
import { Command } from 'lucide-react'

import { NavMain } from '@gocrm/components/layout/nav-main'
import { NavSecondary } from '@gocrm/components/layout/nav-secondary'
import { NavUser } from '@gocrm/components/layout/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@gocrm/components/ui/sidebar'

import { Users, LayoutDashboard, Bell, Settings } from 'lucide-react'
import Link from '../common/link'
import { useTranslations } from '@gocrm/hooks/use-translations'
import { routes } from '@gocrm/lib/routes'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { translations } = useTranslations()
  const t = translations?.sidebar

  const data = {
    navMain: [
      {
        title: t?.dashboard || 'Gösterge Paneli',
        url: routes.dashboard(),
        icon: LayoutDashboard,
        isActive: true,
      },
      {
        title: t?.leads || 'Leads',
        url: routes.leads.list(),
        icon: Users,
        items: [
          {
            title: t?.allLeads || 'Tüm Leads',
            url: routes.leads.list(),
          },
          {
            title: t?.newLead || 'Yeni Lead',
            url: routes.leads.new(),
          },
        ],
      },
      {
        title: t?.generalSettings || 'Ayarlar',
        url: routes.settings.general(),
        icon: Settings,
        items: [
          {
            title: t?.accountMenuItem || 'Hesap',
            url: routes.settings.account(),
          },
          {
            title: t?.notifications || 'Bildirimler',
            url: routes.settings.notifications(),
          },
          {
            title: t?.apiKeys || 'API Anahtarları',
            url: routes.settings.apiKeys(),
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: t?.notifications || 'Bildirimler',
        url: routes.notifications(),
        icon: Bell,
      },
    ],
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={routes.dashboard()}>
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold">
                    {t?.appName || 'GoCRM'}
                  </span>
                  <span className="truncate text-xs">
                    {t?.appSubtitle || 'Enterprise'}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
