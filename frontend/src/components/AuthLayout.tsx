import { BookOpenText, LifeBuoy, MessageCircleQuestion, ShieldCheck } from 'lucide-react'
import type { ReactNode } from 'react'
import { LanguageToggle } from '@/components/LanguageToggle'
import { useLanguage, type TranslationKey } from '@/i18n'

const FEATURES: { icon: typeof MessageCircleQuestion; titleKey: TranslationKey; descKey: TranslationKey }[] = [
  {
    icon: MessageCircleQuestion,
    titleKey: 'auth.feature1Title',
    descKey: 'auth.feature1Desc',
  },
  {
    icon: BookOpenText,
    titleKey: 'auth.feature2Title',
    descKey: 'auth.feature2Desc',
  },
  {
    icon: ShieldCheck,
    titleKey: 'auth.feature3Title',
    descKey: 'auth.feature3Desc',
  },
]

export function AuthLayout({ children }: { children: ReactNode }) {
  const { t } = useLanguage()

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-foreground p-10 text-background lg:flex">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <LifeBuoy className="size-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight">SmartHelp AI</span>
        </div>

        <div className="flex flex-col gap-8">
          <h1 className="text-3xl font-semibold text-balance">{t('auth.heroTitle')}</h1>
          <div className="flex flex-col gap-5">
            {FEATURES.map((f) => (
              <div key={f.titleKey} className="flex items-start gap-3">
                <f.icon className="mt-0.5 size-5 shrink-0 text-background/70" />
                <div>
                  <p className="text-sm font-medium">{t(f.titleKey)}</p>
                  <p className="text-sm text-background/60">{t(f.descKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-background/50">{t('auth.footer')}</p>
      </div>

      <div className="flex flex-col gap-6 p-6 sm:p-10">
        <div className="flex justify-end">
          <LanguageToggle />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
    </div>
  )
}
