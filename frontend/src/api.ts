const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5299'
const AI_BASE_URL = import.meta.env.VITE_AI_BASE_URL ?? 'http://localhost:8000'

export type Role = 'User' | 'Technician' | 'Admin'

const TOKEN_STORAGE_KEY = 'smarthelp.token'
let authToken: string | null = localStorage.getItem(TOKEN_STORAGE_KEY)

export function setAuthToken(token: string | null) {
  authToken = token
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
  }
}

export interface KnowledgeArticle {
  id: string
  category: string
  problemAr: string
  problemEn: string
  errorText: string | null
  solutionAr: string
  solutionEn: string
  escalationNoteAr: string
  escalationNoteEn: string
}

export interface RetrievalResult {
  rank: number
  similarity_score: number
  kb_id: string
  category: string
  problem_en: string
  problem_ar: string
  solution_en: string
  solution_ar: string
  escalation_note_en: string
  escalation_note_ar: string
  related_package: string | null
}

export interface ClassifyResponse {
  predicted_category: string
  confidence: number
  needs_review: boolean
}

export interface RetrieveResponse {
  results: RetrievalResult[]
  needs_escalation: boolean
}

export interface Ticket {
  id: number
  displayCode: string
  status: string
  category: string
  priority: string
  problemDescription: string
  errorMessage: string | null
  reportedByUserId: number
  assignedTechnicianId: number | null
  createdAt: string
  updatedAt: string
  closedAt: string | null
}

export interface TicketStatusHistoryEntry {
  id: number
  oldStatus: string
  newStatus: string
  changedByUserId: number
  changedAt: string
  note: string | null
}

export interface TicketCommentEntry {
  id: number
  authorUserId: number
  body: string
  isInternal: boolean
  createdAt: string
}

export interface TicketDetail extends Ticket {
  statusHistory: TicketStatusHistoryEntry[]
  comments: TicketCommentEntry[]
}

export interface AppUser {
  id: number
  fullName: string
  email: string
  roleId: number
  department: string | null
  isActive: boolean
}

export interface AuthResponse {
  token: string
  expiresAt: string
  userId: number
  fullName: string
  email: string
  role: Role
}

export const UNAUTHORIZED_EVENT = 'smarthelp:unauthorized'

async function asJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    if (response.status === 401 && authToken) {
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
    }
    const body = await response.text()
    throw new Error(`${response.status} ${response.statusText}: ${body}`)
  }
  if (response.status === 204) {
    return undefined as T
  }
  return response.json() as Promise<T>
}

function authHeaders(): HeadersInit {
  return authToken ? { Authorization: `Bearer ${authToken}` } : {}
}

function authedFetch(path: string, init: RequestInit = {}) {
  return fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...authHeaders(),
      ...init.headers,
    },
  })
}

export const aiApi = {
  classify: (text: string) =>
    fetch(`${AI_BASE_URL}/classify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    }).then((r) => asJson<ClassifyResponse>(r)),

  retrieve: (query: string, topK = 3) =>
    fetch(`${AI_BASE_URL}/retrieve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, top_k: topK }),
    }).then((r) => asJson<RetrieveResponse>(r)),
}

export const authApi = {
  login: (email: string, password: string) =>
    fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then((r) => asJson<AuthResponse>(r)),

  register: (input: { fullName: string; email: string; password: string; department?: string }) =>
    fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }).then((r) => asJson<AuthResponse>(r)),
}

export const backendApi = {
  createTicket: (input: {
    problemDescription: string
    errorMessage?: string
    category: string
    priority?: string
  }) =>
    authedFetch('/api/tickets', { method: 'POST', body: JSON.stringify(input) }).then((r) =>
      asJson<Ticket>(r),
    ),

  getTickets: () => authedFetch('/api/tickets').then((r) => asJson<Ticket[]>(r)),

  getTicket: (id: number) => authedFetch(`/api/tickets/${id}`).then((r) => asJson<TicketDetail>(r)),

  updateTicketStatus: (id: number, newStatus: string, note?: string) =>
    authedFetch(`/api/tickets/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ newStatus, note }),
    }).then((r) => asJson<Ticket>(r)),

  reassignTicket: (id: number, technicianUserId: number) =>
    authedFetch(`/api/tickets/${id}/reassign`, {
      method: 'PATCH',
      body: JSON.stringify({ technicianUserId }),
    }).then((r) => asJson<Ticket>(r)),

  deleteTicket: (id: number) =>
    authedFetch(`/api/tickets/${id}`, { method: 'DELETE' }).then((r) => asJson<void>(r)),

  addTicketComment: (id: number, body: string, isInternal = false) =>
    authedFetch(`/api/tickets/${id}/comments`, {
      method: 'POST',
      body: JSON.stringify({ body, isInternal }),
    }).then((r) => asJson<TicketCommentEntry>(r)),

  getKnowledgeArticles: () =>
    authedFetch('/api/knowledgearticles').then((r) => asJson<KnowledgeArticle[]>(r)),

  getUsers: () => authedFetch('/api/users').then((r) => asJson<AppUser[]>(r)),

  createUser: (input: { fullName: string; email: string; password: string; roleId: number }) =>
    authedFetch('/api/users', { method: 'POST', body: JSON.stringify(input) }).then((r) =>
      asJson<AppUser>(r),
    ),
}
