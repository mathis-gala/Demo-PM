type IdeaItem = {
  id: string
  text: string
  score?: number
  moved?: boolean
}

export default function Ideas({
  ideas,
  scoreBadgeClassName = 'border-slate-200 bg-white text-slate-700',
}: {
  ideas: IdeaItem[]
  scoreBadgeClassName?: string
}) {
  return (
    <ul className="mt-4 grid gap-2">
      {ideas.map((idea) => (
        <li
          key={idea.id}
          className="group rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-slate-300 hover:shadow"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2">
              {idea.moved ? (
                <span
                  title="Idée déplacée depuis une autre catégorie"
                  className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700"
                >
                  <svg viewBox="0 0 20 20" className="h-3 w-3 fill-current" aria-hidden="true">
                    <path d="M10 2 1 18h18L10 2Zm0 5a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1Zm0 9a1.25 1.25 0 1 1 0-2.5A1.25 1.25 0 0 1 10 16Z" />
                  </svg>
                </span>
              ) : null}
              <p className="text-sm leading-relaxed text-slate-800">{idea.text}</p>
            </div>
            {typeof idea.score === 'number' ? (
              <span
                className={[
                  'shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset',
                  scoreBadgeClassName,
                ].join(' ')}
              >
                score {Math.round(idea.score * 1000) / 1000}
              </span>
            ) : null}
          </div>
          <div className="mt-2 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-0 transition group-hover:opacity-100" />
        </li>
      ))}
    </ul>
  )
}
