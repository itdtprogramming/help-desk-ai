const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5299'
const AI_BASE_URL = import.meta.env.VITE_AI_BASE_URL ?? 'http://localhost:8000'

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
  createdAt: string
}

export interface AppUser {
  id: number
  fullName: string
  email: string
  roleId: number
}

async function asJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.text()
    throw new Error(`${response.status} ${response.statusText}: ${body}`)
  }
  return response.json() as Promise<T>
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

export const backendApi = {
  createTicket: (input: {
    reportedByUserId: number
    problemDescription: string
    errorMessage?: string
    category: string
    priority?: string
  }) =>
    fetch(`${API_BASE_URL}/api/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }).then((r) => asJson<Ticket>(r)),

  getTickets: () =>
    fetch(`${API_BASE_URL}/api/tickets`).then((r) => asJson<Ticket[]>(r)),

  getKnowledgeArticles: () =>
    fetch(`${API_BASE_URL}/api/knowledgearticles`).then((r) => asJson<KnowledgeArticle[]>(r)),

  getUsers: () => fetch(`${API_BASE_URL}/api/users`).then((r) => asJson<AppUser[]>(r)),

  createUser: (input: { fullName: string; email: string; password: string; roleId: number }) =>
    fetch(`${API_BASE_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }).then((r) => asJson<AppUser>(r)),
}

const DEMO_USER_EMAIL = 'demo.reporter@smarthelp.local'

// The MVP has no login flow yet, so every ticket needs a reporter — this
// finds or creates a single standing demo user rather than blocking the
// retrieval/classification demo on building auth first.
export async function getOrCreateDemoUser(): Promise<AppUser> {
  const users = await backendApi.getUsers()
  const existing = users.find((u) => u.email === DEMO_USER_EMAIL)
  if (existing) return existing

  return backendApi.createUser({
    fullName: 'Demo Reporter',
    email: DEMO_USER_EMAIL,
    password: 'Demo@12345',
    roleId: 3,
  })
}
