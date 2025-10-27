import { AppSidebar } from '@gocrm/components/layout/app-sidebar'
import { DynamicBreadcrumb } from '@gocrm/components/layout/dynamic-breadcrumb'
import { Separator } from '@gocrm/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@gocrm/components/ui/sidebar'
import { RealtimeNotificationsProvider } from '@gocrm/features/notifications/components/realtime-notifications-provider'

export default function ProtectedAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <DynamicBreadcrumb />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</main>
      </SidebarInset>
      
      {/* Real-time notifications */}
      <RealtimeNotificationsProvider />
    </SidebarProvider>
  )
}
