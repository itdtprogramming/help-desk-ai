import { Outlet } from 'react-router-dom'
import { AppSidebar } from '@/components/AppSidebar'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'

export function AppLayout() {
  return (
    <SidebarProvider>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background"
      >
        <div className="absolute -top-32 -left-24 size-[34rem] rounded-full bg-foreground/[0.05] blur-3xl" />
        <div className="absolute bottom-0 right-0 size-[30rem] rounded-full bg-foreground/[0.04] blur-3xl" />
      </div>

      <AppSidebar />
      <SidebarInset className="bg-transparent">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4!" />
          <span className="text-sm text-muted-foreground">
            Offline IT Help Desk assistant
          </span>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
}
