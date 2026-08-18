import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  aiApi,
  backendApi,
  getOrCreateDemoUser,
  type ClassifyResponse,
  type RetrieveResponse,
  type Ticket,
} from '@/api'
import { AnalysisResult, AnalysisResultSkeleton } from '@/components/AnalysisResult'
import { ProblemForm } from '@/components/ProblemForm'
import { TicketsTable } from '@/components/TicketsTable'
import { Toaster } from '@/components/ui/sonner'

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

  useEffect(() => {
    refreshTickets()
  }, [])

  function refreshTickets() {
    backendApi.getTickets().then(setTickets).catch(() => setTickets([]))
  }

  async function handleAnalyze() {
    if (!problemText.trim()) return

    setAnalysis({ status: 'loading' })
    try {
      const [classification, retrieval] = await Promise.all([
        aiApi.classify(problemText),
        aiApi.retrieve(problemText),
      ])
      setAnalysis({ status: 'done', classification, retrieval })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'AI service unavailable'
      setAnalysis({ status: 'error', message })
      toast.error('Could not reach the AI service', { description: message })
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
      toast.success(`Ticket ${ticket.displayCode} created`, {
        description: `Status: ${ticket.status}`,
      })
      refreshTickets()
    } catch (err) {
      toast.error('Failed to create ticket', {
        description: err instanceof Error ? err.message : undefined,
      })
    } finally {
      setEscalating(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10">
      <Toaster />
      <header>
        <h1 className="text-3xl font-bold tracking-tight">SmartHelp AI</h1>
        <p className="text-muted-foreground">
          Offline IT Help Desk assistant — describe a problem to get a suggested solution
        </p>
      </header>

      <ProblemForm
        value={problemText}
        onChange={setProblemText}
        onSubmit={handleAnalyze}
        loading={analysis.status === 'loading'}
      />

      {analysis.status === 'loading' && <AnalysisResultSkeleton />}

      {analysis.status === 'done' && (
        <AnalysisResult
          classification={analysis.classification}
          retrieval={analysis.retrieval}
          onEscalate={() => handleEscalate(analysis.classification.predicted_category)}
          escalating={escalating}
        />
      )}

      <TicketsTable tickets={tickets} />
    </div>
  )
}

export default App
