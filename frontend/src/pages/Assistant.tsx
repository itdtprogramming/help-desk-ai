import { useState } from 'react'
import { toast } from 'sonner'
import { aiApi, backendApi, type ClassifyResponse, type RetrieveResponse } from '@/api'
import { AnalysisResult, AnalysisResultSkeleton } from '@/components/AnalysisResult'
import { ProblemForm } from '@/components/ProblemForm'
import { useLanguage } from '@/i18n'

type AnalysisState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'done'; classification: ClassifyResponse; retrieval: RetrieveResponse }

export function Assistant() {
  const { t } = useLanguage()
  const [problemText, setProblemText] = useState('')
  const [analysis, setAnalysis] = useState<AnalysisState>({ status: 'idle' })
  const [escalating, setEscalating] = useState(false)

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
      const message = err instanceof Error ? err.message : t('assistant.aiUnavailable')
      setAnalysis({ status: 'error', message })
      toast.error(t('assistant.aiUnavailable'), { description: message })
    }
  }

  async function handleEscalate(category: string) {
    setEscalating(true)
    try {
      const ticket = await backendApi.createTicket({
        problemDescription: problemText,
        category,
      })
      toast.success(t('assistant.ticketCreated', { code: ticket.displayCode }), {
        description: t('assistant.status', { status: ticket.status }),
      })
    } catch (err) {
      toast.error(t('assistant.ticketFailed'), {
        description: err instanceof Error ? err.message : undefined,
      })
    } finally {
      setEscalating(false)
    }
  }

  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t('assistant.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('assistant.subtitle')}</p>
      </div>

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
    </>
  )
}
