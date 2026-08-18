import { Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { backendApi, type KnowledgeArticle } from '@/api'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export function KnowledgeBase() {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    backendApi
      .getKnowledgeArticles()
      .then(setArticles)
      .catch(() => setArticles([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return articles
    return articles.filter(
      (a) =>
        a.id.toLowerCase().includes(q) ||
        a.problemEn.toLowerCase().includes(q) ||
        a.problemAr.includes(q) ||
        a.category.toLowerCase().includes(q),
    )
  }, [articles, query])

  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Knowledge Base</h1>
        <p className="text-sm text-muted-foreground">
          Approved articles the assistant retrieves solutions from.
        </p>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by problem, category, or KB id…"
          className="pl-9"
        />
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">No matching articles.</p>
      ) : (
        <div className="grid gap-3">
          {filtered.map((a) => (
            <Card key={a.id}>
              <CardContent className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-mono font-semibold text-foreground">{a.id}</span>
                  <Badge variant="outline">{a.category}</Badge>
                </div>
                <p className="font-medium" dir="auto">
                  {a.problemEn} / {a.problemAr}
                </p>
                <p className="text-sm whitespace-pre-line text-muted-foreground" dir="auto">
                  {a.solutionEn}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
