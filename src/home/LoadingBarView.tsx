export default function LoadingBarView({
  title,
  subtitle,
  durationMs,
  progress,
}: {
  title: string
  subtitle?: string
  durationMs: number
  progress: number
}) {
  const pct = Math.max(0, Math.min(100, Math.round(progress * 100)))

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="text-center">
          <p className="text-base font-semibold tracking-tight text-slate-900">{title}</p>
          {subtitle ? <p className="mt-2 text-sm text-slate-600">{subtitle}</p> : null}
        </div>

        <div className="mt-6 grid gap-2">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>
              Temps simulé: <span className="font-medium text-slate-900">{durationMs}ms</span>
            </span>
            <span className="tabular-nums">{pct}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100 ring-1 ring-inset ring-slate-200">
            <div className="h-full rounded-full bg-indigo-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}

