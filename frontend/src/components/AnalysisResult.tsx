import { AlertTriangle, Loader2, TriangleAlert } from 'lucide-react'
import type { ClassifyResponse, RetrieveResponse } from '@/api'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface AnalysisResultProps {
  classification: ClassifyResponse
  retrieval: RetrieveResponse
  onEscalate: () => void
  escalating: boolean
}

export function AnalysisResultSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI analysis</CardTitle>
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
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI analysis</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span>Predicted category:</span>
          <Badge variant="secondary">{classification.predicted_category}</Badge>
          <span className="text-muted-foreground">
            {Math.round(classification.confidence * 100)}% confidence
          </span>
          {classification.needs_review && (
            <Badge variant="outline" className="gap-1 text-amber-600 dark:text-amber-500">
              <AlertTriangle className="size-3.5" />
              needs review
            </Badge>
          )}
        </div>

        {retrieval.needs_escalation && (
          <Alert>
            <TriangleAlert />
            <AlertTitle>Low confidence match</AlertTitle>
            <AlertDescription>
              The closest approved article may not apply — review the suggestions below
              before trusting them, or escalate directly.
            </AlertDescription>
          </Alert>
        )}

        {retrieval.results.length === 0 ? (
          <p className="text-sm text-muted-foreground">No knowledge base articles found.</p>
        ) : (
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">Closest approved articles</h3>
            <div className="grid gap-3">
              {retrieval.results.map((r) => (
                <div key={r.kb_id} className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-mono font-semibold text-foreground">{r.kb_id}</span>
                    <Badge variant="outline">{Math.round(r.similarity_score * 100)}% match</Badge>
                  </div>
                  <p className="mb-1 font-medium" dir="auto">
                    {r.problem_en} / {r.problem_ar}
                  </p>
                  <p className="mb-2 whitespace-pre-line text-sm" dir="auto">
                    {r.solution_en}
                  </p>
                  <p className="text-xs text-muted-foreground" dir="auto">
                    Escalate if: {r.escalation_note_en}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button variant="outline" onClick={onEscalate} disabled={escalating} className="self-start">
          {escalating && <Loader2 className="animate-spin" />}
          {escalating ? 'Creating ticket…' : "None of these worked — escalate to Help Desk"}
        </Button>
      </CardContent>
    </Card>
  )
}
