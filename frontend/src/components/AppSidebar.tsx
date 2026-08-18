import { BookOpenText, Sparkles, Ticket } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const NAV_ITEMS = [
  { to: '/', label: 'Assistant', icon: Sparkles, end: true },
  { to: '/tickets', label: 'Tickets', icon: Ticket, end: false },
  { to: '/knowledge-base', label: 'Knowledge Base', icon: BookOpenText, end: false },
]

export function AppSidebar() {
  const { pathname } = useLocation()

  return (
    <Sidebar
      collapsible="icon"
      style={
        {
          '--sidebar-width': '17rem',
          '--sidebar-width-icon': '4rem',
        } as React.CSSProperties
      }
    >
      <SidebarHeader className="h-14 justify-center px-3">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex size-8 shrink-0 items-center justify-center bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </div>
          <span className="truncate text-sm font-semibold tracking-tight group-data-[collapsible=icon]:hidden">
            SmartHelp AI
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3 py-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-[0.7rem] tracking-wider uppercase">
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = item.end ? pathname === item.to : pathname.startsWith(item.to)
                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                      className="h-9 border-l-2 border-transparent pl-2.5 data-[active=true]:border-primary"
                    >
                      <NavLink to={item.to} end={item.end}>
                        <item.icon />
                        <span>{item.label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
