import { Outlet } from 'react-router-dom'
import { AppSidebar } from '@/components/AppSidebar'
import { LanguageToggle } from '@/components/LanguageToggle'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import { useLanguage } from '@/i18n'

export function AppLayout() {
  const { t } = useLanguage()

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-background">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4!" />
          <span className="hidden text-sm text-muted-foreground sm:inline">
            {t('app.subtitle')}
          </span>
          <LanguageToggle className="ms-auto" />
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
}
