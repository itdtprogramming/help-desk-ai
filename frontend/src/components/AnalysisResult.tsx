import { AlertTriangle, Loader2, TriangleAlert } from 'lucide-react'
import type { ClassifyResponse, RetrieveResponse } from '@/api'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useLanguage, type TranslationKey } from '@/i18n'

interface AnalysisResultProps {
  classification: ClassifyResponse
  retrieval: RetrieveResponse
  onEscalate: () => void
  escalating: boolean
}

export function AnalysisResultSkeleton() {
  const { t } = useLanguage()
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('analysis.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </CardContent>
    </Card>
  )
}

export function AnalysisResult({
  classification,
  retrieval,
  onEscalate,
  escalating,
}: AnalysisResultProps) {
  const { t } = useLanguage()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('analysis.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span>{t('analysis.predictedCategory')}</span>
          <Badge variant="secondary">
            {t(`category.${classification.predicted_category}` as TranslationKey)}
          </Badge>
          <span className="text-muted-foreground">
            {t('analysis.confidence', { pct: Math.round(classification.confidence * 100) })}
          </span>
          {classification.needs_review && (
            <Badge variant="outline" className="gap-1 text-amber-600 dark:text-amber-500">
              <AlertTriangle className="size-3.5" />
              {t('analysis.needsReview')}
            </Badge>
          )}
        </div>

        {retrieval.needs_escalation && (
          <Alert>
            <TriangleAlert />
            <AlertTitle>{t('analysis.lowConfidenceTitle')}</AlertTitle>
            <AlertDescription>{t('analysis.lowConfidenceDesc')}</AlertDescription>
          </Alert>
        )}

        {retrieval.results.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('analysis.noArticles')}</p>
        ) : (
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">{t('analysis.closestArticles')}</h3>
            <div className="grid gap-3">
              {retrieval.results.map((r) => (
                <div key={r.kb_id} className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-mono font-semibold text-foreground">{r.kb_id}</span>
                    <Badge variant="outline">
                      {t('analysis.match', { pct: Math.round(r.similarity_score * 100) })}
                    </Badge>
                  </div>
                  <p className="mb-1 font-medium" dir="auto">
                    {r.problem_en} / {r.problem_ar}
                  </p>
                  <p className="mb-2 whitespace-pre-line text-sm" dir="auto">
                    {r.solution_en}
                  </p>
                  <p className="text-xs text-muted-foreground" dir="auto">
                    {t('analysis.escalateIf', { note: r.escalation_note_en })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button variant="outline" onClick={onEscalate} disabled={escalating} className="self-start">
          {escalating && <Loader2 className="animate-spin" />}
          {escalating ? t('analysis.creatingTicket') : t('analysis.escalateButton')}
        </Button>
      </CardContent>
    </Card>
  )
}
