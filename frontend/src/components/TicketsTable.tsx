import { useNavigate } from 'react-router-dom'
import type { Ticket } from '@/api'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useLanguage, type TranslationKey } from '@/i18n'

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline'> = {
  New: 'default',
  InProgress: 'secondary',
  Escalated: 'secondary',
  Resolved: 'outline',
  Closed: 'outline',
}

export function TicketsTable({ tickets, title }: { tickets: Ticket[]; title?: string }) {
  const navigate = useNavigate()
  const { t } = useLanguage()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title ?? t('ticketsTable.recent')}</CardTitle>
      </CardHeader>
      <CardContent>
        {tickets.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('ticketsTable.noTickets')}</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('ticketsTable.code')}</TableHead>
                <TableHead>{t('ticketsTable.category')}</TableHead>
                <TableHead>{t('ticketsTable.status')}</TableHead>
                <TableHead>{t('ticketsTable.problem')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow
                  key={ticket.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/tickets/${ticket.id}`)}
                >
                  <TableCell className="font-mono">{ticket.displayCode}</TableCell>
                  <TableCell>{t(`category.${ticket.category}` as TranslationKey)}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[ticket.status] ?? 'default'}>
                      {t(`status.${ticket.status}` as TranslationKey)}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate" dir="auto">
                    {ticket.problemDescription}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
