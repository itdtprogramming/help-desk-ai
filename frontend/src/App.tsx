import { useEffect, useState } from 'react'
import {
  aiApi,
  backendApi,
  getOrCreateDemoUser,
  type ClassifyResponse,
  type RetrieveResponse,
  type Ticket,
} from './api'
import './App.css'

type AnalysisState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'done'; classification: ClassifyResponse; retrieval: RetrieveResponse }

function App() {
  const [problemText, setProblemText] = useState('')
  const [analysis, setAnalysis] = useState<AnalysisState>({ status: 'idle' })
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [escalating, setEscalating] = useState(false)
  const [lastTicket, setLastTicket] = useState<Ticket | null>(null)

  useEffect(() => {
    refreshTickets()
  }, [])

  function refreshTickets() {
    backendApi.getTickets().then(setTickets).catch(() => setTickets([]))
  }

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault()
    if (!problemText.trim()) return

    setAnalysis({ status: 'loading' })
    setLastTicket(null)
    try {
      const [classification, retrieval] = await Promise.all([
        aiApi.classify(problemText),
        aiApi.retrieve(problemText),
      ])
      setAnalysis({ status: 'done', classification, retrieval })
    } catch (err) {
      setAnalysis({
        status: 'error',
        message: err instanceof Error ? err.message : 'AI service unavailable',
      })
    }
  }

  async function handleEscalate(category: string) {
    setEscalating(true)
    try {
      const user = await getOrCreateDemoUser()
      const ticket = await backendApi.createTicket({
        reportedByUserId: user.id,
        problemDescription: problemText,
        category,
      })
      setLastTicket(ticket)
      refreshTickets()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create ticket')
    } finally {
      setEscalating(false)
    }
  }

  return (
    <div className="page">
      <header className="header">
        <h1>SmartHelp AI</h1>
        <p>Offline IT Help Desk assistant — describe a problem to get a suggested solution</p>
      </header>

      <section className="panel">
        <form onSubmit={handleAnalyze}>
          <label htmlFor="problem">Describe your problem (Arabic or English)</label>
          <textarea
            id="problem"
            dir="auto"
            rows={4}
            value={problemText}
            onChange={(e) => setProblemText(e.target.value)}
            placeholder="e.g. البرنامج لا يفتح ويظهر رسالة VCRUNTIME140.dll missing"
          />
          <button type="submit" disabled={analysis.status === 'loading' || !problemText.trim()}>
            {analysis.status === 'loading' ? 'Analyzing…' : 'Ask SmartHelp AI'}
          </button>
        </form>
      </section>

      {analysis.status === 'error' && (
        <section className="panel error">
          <p>Could not reach the AI service: {analysis.message}</p>
          <p className="hint">Is the ai-service running on http://localhost:8000?</p>
        </section>
      )}

      {analysis.status === 'done' && (
        <AnalysisResult
          analysis={analysis}
          onEscalate={handleEscalate}
          escalating={escalating}
        />
      )}

      {lastTicket && (
        <section className="panel success">
          <p>
            Ticket <strong>{lastTicket.displayCode}</strong> created — status:{' '}
            {lastTicket.status}
          </p>
        </section>
      )}

      <section className="panel">
        <h2>Recent tickets</h2>
        {tickets.length === 0 ? (
          <p className="hint">No tickets yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Category</th>
                <th>Status</th>
                <th>Problem</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id}>
                  <td>{t.displayCode}</td>
                  <td>{t.category}</td>
                  <td>{t.status}</td>
                  <td className="truncate">{t.problemDescription}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}

function AnalysisResult({
  analysis,
  onEscalate,
  escalating,
}: {
  analysis: Extract<AnalysisState, { status: 'done' }>
  onEscalate: (category: string) => void
  escalating: boolean
}) {
  const { classification, retrieval } = analysis

  return (
    <section className="panel">
      <h2>AI analysis</h2>
      <p>
        Predicted category: <strong>{classification.predicted_category}</strong>{' '}
        <span className="confidence">
          ({Math.round(classification.confidence * 100)}% confidence)
        </span>
        {classification.needs_review && <span className="badge warn">needs review</span>}
      </p>

      {retrieval.needs_escalation && (
        <div className="escalation-notice">
          <p>
            Low confidence match — the closest approved article may not apply. Review the
            suggestions below before trusting them, or escalate directly.
          </p>
        </div>
      )}

      {retrieval.results.length === 0 ? (
        <p className="hint">No knowledge base articles found.</p>
      ) : (
        <>
          <h3>Closest approved articles</h3>
          <div className="kb-results">
            {retrieval.results.map((r) => (
              <article key={r.kb_id} className="kb-card">
                <header>
                  <span className="kb-id">{r.kb_id}</span>
                  <span className="score">{Math.round(r.similarity_score * 100)}% match</span>
                </header>
                <p className="problem" dir="auto">
                  {r.problem_en} / {r.problem_ar}
                </p>
                <p className="solution" dir="auto">
                  {r.solution_en}
                </p>
                <p className="escalation-note" dir="auto">
                  Escalate if: {r.escalation_note_en}
                </p>
              </article>
            ))}
          </div>
        </>
      )}

      <button
        className="secondary"
        onClick={() => onEscalate(classification.predicted_category)}
        disabled={escalating}
      >
        {escalating ? 'Creating ticket…' : "None of these worked — escalate to Help Desk"}
      </button>
    </section>
  )
}

export default App
