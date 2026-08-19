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

const STATUSES = ['New', 'InProgress', 'Escalated', 'Resolved', 'Closed']

export function TicketDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  // Separation of duties: Technician does resolution work (assign, status,
  // internal notes); Admin governs routing (reassign) but doesn't personally
  // resolve tickets. See backend/Controllers/TicketsController.cs.
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
        toast.error('Could not load ticket')
        navigate('/tickets')
      })
      .finally(() => setLoading(false))
  }, [id, refreshKey, navigate])

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

  async function handleAssign() {
    if (!ticket) return
    setBusy(true)
    try {
      await backendApi.assignTicketToSelf(ticket.id)
      toast.success('Ticket assigned to you')
      reload()
    } catch (err) {
      toast.error('Failed to assign ticket', {
        description: err instanceof Error ? err.message : undefined,
      })
    } finally {
      setBusy(false)
    }
  }

  async function handleReassign() {
    if (!ticket || !reassignTo) return
    setBusy(true)
    try {
      await backendApi.reassignTicket(ticket.id, Number(reassignTo))
      toast.success('Ticket reassigned')
      reload()
    } catch (err) {
      toast.error('Failed to reassign ticket', {
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
      toast.success(`Status updated to ${nextStatus}`)
      reload()
    } catch (err) {
      toast.error('Failed to update status', {
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
      toast.error('Failed to add comment', {
        description: err instanceof Error ? err.message : undefined,
      })
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading…</p>
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
            <Badge variant="default">{ticket.status}</Badge>
            <Badge variant="secondary">{ticket.category}</Badge>
            <Badge variant="outline">{ticket.priority}</Badge>
          </div>
        </div>
        {isTechnician && (
          <Button variant="outline" onClick={handleAssign} disabled={busy}>
            {ticket.assignedTechnicianId === user?.userId ? 'Assigned to you' : 'Assign to me'}
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Problem</CardTitle>
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
            <CardTitle>Update status</CardTitle>
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
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleStatusUpdate}
                disabled={busy || nextStatus === ticket.status}
              >
                Update
              </Button>
            </div>
            <Textarea
              placeholder="Optional note about this change"
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
            <CardTitle>Reassign</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-2">
            <Select value={reassignTo} onValueChange={setReassignTo}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Choose a technician" />
              </SelectTrigger>
              <SelectContent>
                {technicians.map((t) => (
                  <SelectItem key={t.id} value={String(t.id)}>
                    {t.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleReassign} disabled={busy || !reassignTo}>
              Reassign
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
        </CardHeader>
        <CardContent>
          {ticket.statusHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground">No status changes yet.</p>
          ) : (
            <ul className="flex flex-col gap-2 text-sm">
              {ticket.statusHistory.map((h) => (
                <li key={h.id} className="flex flex-col">
                  <span>
                    <span className="text-muted-foreground">{h.oldStatus} → </span>
                    <span className="font-medium">{h.newStatus}</span>
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
          <CardTitle>Comments</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {ticket.comments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No comments yet.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {ticket.comments.map((c) => (
                <li key={c.id} className="rounded-lg border p-3 text-sm">
                  <div className="mb-1 flex items-center gap-2">
                    {c.isInternal && <Badge variant="outline">internal</Badge>}
                  </div>
                  <p dir="auto">{c.body}</p>
                </li>
              ))}
            </ul>
          )}

          <Separator />

          <div className="flex flex-col gap-2">
            <Label htmlFor="comment">Add a comment</Label>
            <Textarea
              id="comment"
              dir="auto"
              rows={3}
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
            />
            {isTechnician && (
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox
                  checked={commentInternal}
                  onCheckedChange={(v) => setCommentInternal(v === true)}
                />
                Internal note (not shown to the reporter)
              </label>
            )}
            <Button
              onClick={handleAddComment}
              disabled={busy || !commentBody.trim()}
              className="self-start"
            >
              Post comment
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
