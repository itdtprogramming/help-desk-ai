import { useEffect, useState } from 'react'
import { backendApi, type Ticket } from '@/api'
import { TicketsTable } from '@/components/TicketsTable'

export function Tickets() {
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
        <h1 className="text-2xl font-semibold tracking-tight">Tickets</h1>
        <p className="text-sm text-muted-foreground">
          Every incident reported through the assistant or escalated by a technician.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <TicketsTable tickets={tickets} />
      )}
    </>
  )
}
