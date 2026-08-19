import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { backendApi, type AppUser, type TicketDetail as TicketDetailType } from '@/api'
import { useAuth } from '@/auth'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useLanguage, type TranslationKey } from '@/i18n'

const STATUSES = ['New', 'InProgress', 'Escalated', 'Resolved', 'Closed']

export function TicketDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { t } = useLanguage()
  // Separation of duties: Technician does resolution work (status, internal
  // notes); Admin governs routing (reassign) and record-level CRUD (delete)
  // but doesn't personally resolve tickets. A ticket is only ever visible
  // here if the backend already granted access — see TicketsController.cs.
  const isTechnician = user?.role === 'Technician'
  const isAdmin = user?.role === 'Admin'

  const [ticket, setTicket] = useState<TicketDetailType | null>(null)
  const [loading, setLoading] = useState(true)
  const [nextStatus, setNextStatus] = useState<string>('')
  const [statusNote, setStatusNote] = useState('')
  const [commentBody, setCommentBody] = useState('')
  const [commentInternal, setCommentInternal] = useState(false)
  const [busy, setBusy] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [technicians, setTechnicians] = useState<AppUser[]>([])
  const [reassignTo, setReassignTo] = useState<string>('')

  useEffect(() => {
    if (!id) return
    setLoading(true)
    backendApi
      .getTicket(Number(id))
      .then((t) => {
        setTicket(t)
        setNextStatus(t.status)
      })
      .catch(() => {
        toast.error(t('ticketDetail.loadFailed'))
        navigate('/tickets')
      })
      .finally(() => setLoading(false))
  }, [id, refreshKey, navigate, t])

  useEffect(() => {
    if (!isAdmin) return
    backendApi
      .getUsers()
      .then((users) => setTechnicians(users.filter((u) => u.roleId === 2)))
      .catch(() => setTechnicians([]))
  }, [isAdmin])

  function reload() {
    setRefreshKey((k) => k + 1)
  }

  async function handleReassign() {
    if (!ticket || !reassignTo) return
    setBusy(true)
    try {
      await backendApi.reassignTicket(ticket.id, Number(reassignTo))
      toast.success(t('ticketDetail.reassigned'))
      reload()
    } catch (err) {
      toast.error(t('ticketDetail.reassignFailed'), {
        description: err instanceof Error ? err.message : undefined,
      })
    } finally {
      setBusy(false)
    }
  }

  async function handleStatusUpdate() {
    if (!ticket) return
    setBusy(true)
    try {
      await backendApi.updateTicketStatus(ticket.id, nextStatus, statusNote || undefined)
      setStatusNote('')
      toast.success(t('ticketDetail.statusUpdated', { status: t(`status.${nextStatus}` as TranslationKey) }))
      reload()
    } catch (err) {
      toast.error(t('ticketDetail.statusFailed'), {
        description: err instanceof Error ? err.message : undefined,
      })
    } finally {
      setBusy(false)
    }
  }

  async function handleAddComment() {
    if (!ticket || !commentBody.trim()) return
    setBusy(true)
    try {
      await backendApi.addTicketComment(ticket.id, commentBody, commentInternal)
      setCommentBody('')
      setCommentInternal(false)
      reload()
    } catch (err) {
      toast.error(t('ticketDetail.commentFailed'), {
        description: err instanceof Error ? err.message : undefined,
      })
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete() {
    if (!ticket) return
    if (!window.confirm(t('ticketDetail.deleteConfirm'))) return
    setBusy(true)
    try {
      await backendApi.deleteTicket(ticket.id)
      toast.success(t('ticketDetail.deleted'))
      navigate('/tickets')
    } catch (err) {
      toast.error(t('ticketDetail.deleteFailed'), {
        description: err instanceof Error ? err.message : undefined,
      })
      setBusy(false)
    }
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
  }
  if (!ticket) {
    return null
  }

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-mono text-2xl font-semibold tracking-tight">
            {ticket.displayCode}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <Badge variant="default">{t(`status.${ticket.status}` as TranslationKey)}</Badge>
            <Badge variant="secondary">{t(`category.${ticket.category}` as TranslationKey)}</Badge>
            <Badge variant="outline">{t(`priority.${ticket.priority}` as TranslationKey)}</Badge>
          </div>
        </div>
        {isAdmin && (
          <Button variant="destructive" onClick={handleDelete} disabled={busy}>
            {t('ticketDetail.deleteTicket')}
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('ticketDetail.problem')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <p dir="auto">{ticket.problemDescription}</p>
          {ticket.errorMessage && (
            <p className="font-mono text-sm text-muted-foreground">{ticket.errorMessage}</p>
          )}
        </CardContent>
      </Card>

      {isTechnician && (
        <Card>
          <CardHeader>
            <CardTitle>{t('ticketDetail.updateStatus')}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Select value={nextStatus} onValueChange={setNextStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {t(`status.${s}` as TranslationKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleStatusUpdate}
                disabled={busy || nextStatus === ticket.status}
              >
                {t('ticketDetail.update')}
              </Button>
            </div>
            <Textarea
              placeholder={t('ticketDetail.notePlaceholder')}
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              rows={2}
            />
          </CardContent>
        </Card>
      )}

      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>{t('ticketDetail.reassign')}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-2">
            <Select value={reassignTo} onValueChange={setReassignTo}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder={t('ticketDetail.chooseTechnician')} />
              </SelectTrigger>
              <SelectContent>
                {technicians.map((tech) => (
                  <SelectItem key={tech.id} value={String(tech.id)}>
                    {tech.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleReassign} disabled={busy || !reassignTo}>
              {t('ticketDetail.reassign')}
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t('ticketDetail.history')}</CardTitle>
        </CardHeader>
        <CardContent>
          {ticket.statusHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('ticketDetail.noHistory')}</p>
          ) : (
            <ul className="flex flex-col gap-2 text-sm">
              {ticket.statusHistory.map((h) => (
                <li key={h.id} className="flex flex-col">
                  <span>
                    <span className="text-muted-foreground">
                      {t(`status.${h.oldStatus}` as TranslationKey)} →{' '}
                    </span>
                    <span className="font-medium">{t(`status.${h.newStatus}` as TranslationKey)}</span>
                  </span>
                  {h.note && <span className="text-muted-foreground">{h.note}</span>}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('ticketDetail.comments')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {ticket.comments.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('ticketDetail.noComments')}</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {ticket.comments.map((c) => (
                <li key={c.id} className="rounded-lg border p-3 text-sm">
                  <div className="mb-1 flex items-center gap-2">
                    {c.isInternal && <Badge variant="outline">{t('ticketDetail.internal')}</Badge>}
                  </div>
                  <p dir="auto">{c.body}</p>
                </li>
              ))}
            </ul>
          )}

          <Separator />

          <div className="flex flex-col gap-2">
            <Label htmlFor="comment">{t('ticketDetail.addComment')}</Label>
            <Textarea
              id="comment"
              dir="auto"
              rows={3}
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
            />
            {(isTechnician || isAdmin) && (
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox
                  checked={commentInternal}
                  onCheckedChange={(v) => setCommentInternal(v === true)}
                />
                {t('ticketDetail.internalNote')}
              </label>
            )}
            <Button
              onClick={handleAddComment}
              disabled={busy || !commentBody.trim()}
              className="self-start"
            >
              {t('ticketDetail.postComment')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
