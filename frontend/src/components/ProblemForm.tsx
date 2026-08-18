import { Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface ProblemFormProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  loading: boolean
}

export function ProblemForm({ value, onChange, onSubmit, loading }: ProblemFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Describe your problem</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit()
          }}
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="problem">Arabic or English — mix freely</Label>
            <Textarea
              id="problem"
              dir="auto"
              rows={4}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="e.g. البرنامج لا يفتح ويظهر رسالة VCRUNTIME140.dll missing"
            />
          </div>
          <Button type="submit" disabled={loading || !value.trim()} className="self-start">
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                Analyzing…
              </>
            ) : (
              <>
                <Sparkles />
                Ask SmartHelp AI
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
