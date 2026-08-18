import { useEffect, useState } from 'react'
import { backendApi, type Ticket } from '@/api'
import { useAuth } from '@/auth'
import { TicketsTable } from '@/components/TicketsTable'

export function Tickets() {
  const { user } = useAuth()
  const isStaff = user?.role === 'Technician' || user?.role === 'Admin'
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    backendApi
      .getTickets()
      .then(setTickets)
      .catch(() => setTickets([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {isStaff ? 'Ticket queue' : 'My tickets'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isStaff
            ? 'Every incident reported through the assistant, across all users.'
            : 'Incidents you have reported through the assistant.'}
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <TicketsTable tickets={tickets} title={isStaff ? 'All tickets' : 'Your tickets'} />
      )}
    </>
  )
}
