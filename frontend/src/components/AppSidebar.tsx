import { BookOpenText, LifeBuoy, LogOut, MessageCircleQuestion, Ticket, Users as UsersIcon } from 'lucide-react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth, type AuthUser } from '@/auth'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useLanguage, type TranslationKey } from '@/i18n'

const NAV_ITEMS: { to: string; labelKey: TranslationKey; icon: typeof LifeBuoy; end: boolean; roles?: AuthUser['role'][] }[] = [
  { to: '/', labelKey: 'nav.assistant', icon: MessageCircleQuestion, end: true },
  { to: '/tickets', labelKey: 'nav.tickets', icon: Ticket, end: false },
  { to: '/knowledge-base', labelKey: 'nav.knowledgeBase', icon: BookOpenText, end: false },
  { to: '/users', labelKey: 'nav.users', icon: UsersIcon, end: false, roles: ['Admin'] },
]

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function AppSidebar() {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const { t, language } = useLanguage()
  const navigate = useNavigate()

  const visibleItems = NAV_ITEMS.filter((item) => !item.roles || (user && item.roles.includes(user.role)))

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <Sidebar
      collapsible="icon"
      side={language === 'ar' ? 'right' : 'left'}
      style={
        {
          '--sidebar-width': '17rem',
          '--sidebar-width-icon': '4rem',
        } as React.CSSProperties
      }
    >
      <SidebarHeader className="h-14 justify-center px-3">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <LifeBuoy className="size-4" />
          </div>
          <span className="truncate text-sm font-semibold tracking-tight group-data-[collapsible=icon]:hidden">
            SmartHelp AI
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3 py-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-[0.7rem] tracking-wider uppercase">
            {t('sidebar.workspace')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {visibleItems.map((item) => {
                const isActive = item.end ? pathname === item.to : pathname.startsWith(item.to)
                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={t(item.labelKey)}
                      className="h-9 border-s-2 border-transparent ps-2.5 data-[active=true]:border-primary"
                    >
                      <NavLink to={item.to} end={item.end}>
                        <item.icon />
                        <span>{t(item.labelKey)}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {user && (
        <SidebarFooter className="px-3 py-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-2.5 overflow-hidden text-left hover:opacity-80">
                <Avatar className="size-7 shrink-0">
                  <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                    {initials(user.fullName)}
                  </AvatarFallback>
                </Avatar>
                <span className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
                  <span className="truncate text-sm font-medium">{user.fullName}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {t(`role.${user.role}` as TranslationKey)}
                  </span>
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-56">
              <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut />
                {t('sidebar.logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      )}
    </Sidebar>
  )
}
