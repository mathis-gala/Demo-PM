import Ideas from './Ideas'
import { colorForTopicLvl1, colorForTopicLvl2 } from './topicColors'

type ResItem = {
  idea: { id: string; text: string }
  topic: { id: string; topicLvl1: string; topicLvl2: string }
  score: number
}

export type ResLike = {
  time: number
  name: string
  results: ResItem[]
  origin?: {
    results: ResItem[]
  }
}

function groupByTopic(items: ResItem[], originItems?: ResItem[]) {
  const originByIdeaId = new Map<string, ResItem['topic']>()
  if (originItems) {
    for (const item of originItems) originByIdeaId.set(item.idea.id, item.topic)
  }

  const byId = new Map<
    string,
    { topic: ResItem['topic']; ideas: Array<{ id: string; text: string; score: number; moved: boolean }> }
  >()

  for (const item of items) {
    const originTopic = originByIdeaId.get(item.idea.id)
    const moved = Boolean(originTopic && originTopic.id !== item.topic.id)

    const existing = byId.get(item.topic.id)
    if (!existing) {
      byId.set(item.topic.id, {
        topic: item.topic,
        ideas: [{ id: item.idea.id, text: item.idea.text, score: item.score, moved }],
      })
      continue
    }
    existing.ideas.push({ id: item.idea.id, text: item.idea.text, score: item.score, moved })
  }

  for (const group of byId.values()) {
    group.ideas.sort((a, b) => b.score - a.score)
  }

  return Array.from(byId.values()).sort((a, b) => {
    const countDiff = b.ideas.length - a.ideas.length
    if (countDiff !== 0) return countDiff
    const aKey = `${a.topic.topicLvl1} — ${a.topic.topicLvl2}`.toLowerCase()
    const bKey = `${b.topic.topicLvl1} — ${b.topic.topicLvl2}`.toLowerCase()
    return aKey.localeCompare(bKey)
  })
}

export default function Topics({ res }: { res: ResLike }) {
  const grouped = groupByTopic(res.results, res.origin?.results)

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">Topics</h2>
          <p className="mt-1 text-sm text-slate-600">
            {grouped.length} topics • {res.results.length} idées • {res.time}ms
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 shadow-sm">
          <span className="text-slate-500">Model</span>{' '}
          <span className="font-medium text-slate-900">{res.name}</span>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {grouped.map(({ topic, ideas }) => {
          const cLvl1 = colorForTopicLvl1(topic.topicLvl1)
          const cLvl2 = colorForTopicLvl2(topic.topicLvl1, topic.topicLvl2)
          return (
            <section
              key={topic.id}
              className={[
                'relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow',
                cLvl2.border,
              ].join(' ')}
            >
              <div
                className={[
                  'pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full blur-3xl',
                  cLvl2.softBg,
                ].join(' ')}
              />
              <div className="relative">
                <header>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={[
                            'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-2 ring-inset',
                            cLvl1.chip,
                          ].join(' ')}
                        >
                          {topic.topicLvl1}
                        </span>
                        <span className={['h-2 w-2 rounded-full ring-2 ring-inset', cLvl2.chip].join(' ')} />
                        <span className="text-[11px] text-slate-500">•</span>
                        <span className="text-[11px] text-slate-600">Topic ID: {topic.id.slice(0, 8)}…</span>
                      </div>
                      <h3 className="mt-2 text-base font-semibold leading-snug text-slate-900">
                        {topic.topicLvl2}
                      </h3>
                    </div>

                    <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
                      {ideas.length}
                    </span>
                  </div>

                  <div className="mt-4 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                </header>

                <Ideas
                  ideas={ideas}
                  scoreBadgeClassName={`${cLvl2.border} ${cLvl2.softBg} text-slate-800 ring-slate-200`}
                />
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
