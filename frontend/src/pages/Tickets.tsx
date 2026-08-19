import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { backendApi, type Ticket } from '@/api'
import { useAuth } from '@/auth'
import { TicketsTable } from '@/components/TicketsTable'
import { useLanguage } from '@/i18n'

export function Tickets() {
  const { user } = useAuth()
  const { t } = useLanguage()
  // Visibility is enforced by the backend (Admin: all, Technician: assigned
  // to them, User: reported by them) — this only picks the matching copy.
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    backendApi
      .getTickets()
      .then(setTickets)
      .catch(() => toast.error(t('tickets.loadFailed')))
      .finally(() => setLoading(false))
  }, [t])

  const titleKey = user?.role === 'Admin' ? 'tickets.queueTitle' : user?.role === 'Technician' ? 'tickets.assignedTitle' : 'tickets.myTitle'
  const descKey = user?.role === 'Admin' ? 'tickets.queueDesc' : user?.role === 'Technician' ? 'tickets.assignedDesc' : 'tickets.myDesc'
  const tableTitleKey = user?.role === 'Admin' ? 'tickets.allTable' : 'tickets.yourTable'

  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t(titleKey)}</h1>
        <p className="text-sm text-muted-foreground">{t(descKey)}</p>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
      ) : (
        <TicketsTable tickets={tickets} title={t(tableTitleKey)} />
      )}
    </>
  )
}
