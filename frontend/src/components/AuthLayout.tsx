import { BookOpenText, MessageCircleQuestion, ShieldCheck, Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'

const FEATURES = [
  {
    icon: Sparkles,
    title: 'Understands Arabic and English',
    description: 'Describe a problem in either language, or mix both freely.',
  },
  {
    icon: BookOpenText,
    title: 'Grounded in approved knowledge',
    description: 'Every suggestion traces back to a reviewed knowledge base article.',
  },
  {
    icon: ShieldCheck,
    title: 'Human-in-the-loop',
    description: 'Low-confidence cases escalate to a technician instead of guessing.',
  },
]

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden p-10 text-primary-foreground lg:flex">
        <div className="absolute inset-0 -z-10 bg-linear-to-br from-indigo-500 via-violet-500 to-fuchsia-500" />
        <div className="absolute -top-24 -left-16 -z-10 size-96 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -right-16 -bottom-24 -z-10 size-96 rounded-full bg-black/10 blur-3xl" />

        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center bg-white/15 backdrop-blur-sm">
            <Sparkles className="size-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight">SmartHelp AI</span>
        </div>

        <div className="flex flex-col gap-8">
          <div>
            <MessageCircleQuestion className="mb-4 size-10 opacity-90" />
            <h1 className="text-3xl font-semibold text-balance">
              Offline IT support that actually understands the problem.
            </h1>
          </div>
          <div className="flex flex-col gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <f.icon className="mt-0.5 size-5 shrink-0 opacity-90" />
                <div>
                  <p className="text-sm font-medium">{f.title}</p>
                  <p className="text-sm text-white/70">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-white/60">
          A student sprint project — runs entirely on your local network.
        </p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  )
}
