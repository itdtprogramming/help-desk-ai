import { Loader2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useLanguage } from '@/i18n'

interface ProblemFormProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  loading: boolean
}

export function ProblemForm({ value, onChange, onSubmit, loading }: ProblemFormProps) {
  const { t } = useLanguage()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('problemForm.title')}</CardTitle>
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
            <Label htmlFor="problem">{t('problemForm.label')}</Label>
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
                {t('problemForm.analyzing')}
              </>
            ) : (
              <>
                <Send />
                {t('problemForm.submit')}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
