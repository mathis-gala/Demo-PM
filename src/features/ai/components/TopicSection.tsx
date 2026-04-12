import { Card } from '@ui/Card';
import { colorForTopicLvl1, colorForTopicLvl2 } from '../utils/topicColors';
import { pluralize } from '@utils/pluralize';
import type { GroupedTopic } from '../types';
import Ideas from './Ideas';

export function TopicSection({ group }: { group: GroupedTopic }) {
  const { topicLvl1, subtopics, ideasCount } = group;
  const cLvl1 = colorForTopicLvl1(topicLvl1);

  return (
    <Card className={`relative overflow-visible p-5 transition hover:shadow ${cLvl1.border}`}>
      <div
        className={`pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full blur-3xl ${cLvl1.softBg}`}
      />
      <div className="relative">
        <header>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-2 ring-inset ${cLvl1.chip}`}
                >
                  {topicLvl1}
                </span>
                <span className="text-[11px] text-slate-500">•</span>
                <span className="text-[11px] text-slate-600">
                  {subtopics.length} sous-catégories
                </span>
              </div>
            </div>

            <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
              {ideasCount}
            </span>
          </div>

          <div className="mt-4 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </header>

        <div className="mt-4 space-y-5">
          {subtopics.map(({ topic, ideas }) => {
            const cLvl2 = colorForTopicLvl2(topic.topicLvl1, topic.topicLvl2);
            return (
              <div key={topic.id}>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ring-2 ring-inset ${cLvl2.chip}`} />
                  <span className="text-sm font-semibold text-slate-900">{topic.topicLvl2}</span>
                  {(topic.created ?? false) ? (
                    <span
                      className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-[11px] font-bold text-emerald-700"
                      title="Catégorie créée"
                      aria-label="Catégorie créée"
                    >
                      +
                    </span>
                  ) : null}
                  <span className="text-[11px] text-slate-500">•</span>
                  <span className="text-[11px] text-slate-600">
                    ID de catégorie : {topic.id.slice(0, 8)}…
                  </span>
                  <span className="text-[11px] text-slate-500">•</span>
                  <span className="text-[11px] text-slate-600">
                    {ideas.length} {pluralize(ideas.length, 'idée', 'idées')}
                  </span>
                </div>
                <Ideas
                  ideas={ideas}
                  scoreBadgeClassName={`${cLvl2.border} ${cLvl2.softBg} text-slate-800 ring-slate-200`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
