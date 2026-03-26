type IdeaItem = {
  id: string
  text: string
  score?: number
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
            <p className="text-sm leading-relaxed text-slate-800">{idea.text}</p>
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
