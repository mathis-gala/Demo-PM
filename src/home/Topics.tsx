import Ideas from "./Ideas";
import { colorForTopicLvl1, colorForTopicLvl2 } from "./topicColors";

type ResItem = {
  idea: { id: string; text: string };
  topic: { id: string; topicLvl1: string; topicLvl2: string; created?: boolean };
  score: number;
};

export type ResLike = {
  time: number;
  name: string;
  results: ResItem[];
  origin?: {
    results: ResItem[];
  };
};

function groupByTheme(items: ResItem[], originItems?: ResItem[]) {
  const originByIdeaId = new Map<string, ResItem["topic"]>();
  if (originItems) {
    for (const item of originItems) {
      originByIdeaId.set(item.idea.id, item.topic);
    }
  }

  const byTheme = new Map<
    string,
    {
      topicLvl1: string;
      subtopics: Map<
        string,
        {
          topic: ResItem["topic"];
          ideas: Array<{
            id: string;
            text: string;
            score: number;
            moved: boolean;
            movedFrom?: string;
          }>;
        }
      >;
    }
  >();

  for (const item of items) {
    const originTopic = originByIdeaId.get(item.idea.id);
    const moved = Boolean(originTopic && originTopic.id !== item.topic.id);
    const movedFrom =
      moved && originTopic
        ? `${originTopic.topicLvl1} -> ${originTopic.topicLvl2}`
        : undefined;

    let themeGroup = byTheme.get(item.topic.topicLvl1);
    if (!themeGroup) {
      themeGroup = {
        topicLvl1: item.topic.topicLvl1,
        subtopics: new Map(),
      };
      byTheme.set(item.topic.topicLvl1, themeGroup);
    }

    let subtopicGroup = themeGroup.subtopics.get(item.topic.id);
    if (!subtopicGroup) {
      subtopicGroup = {
        topic: item.topic,
        ideas: [],
      };
      themeGroup.subtopics.set(item.topic.id, subtopicGroup);
    }

    subtopicGroup.ideas.push({
      id: item.idea.id,
      text: item.idea.text,
      score: item.score,
      moved,
      movedFrom,
    });
  }

  return Array.from(byTheme.values())
    .map((themeGroup) => {
      const subtopics = Array.from(themeGroup.subtopics.values())
        .map((subtopic) => ({
          ...subtopic,
          ideas: [...subtopic.ideas].sort((a, b) => b.score - a.score),
        }))
        .sort((a, b) => {
          const countDiff = b.ideas.length - a.ideas.length;
          if (countDiff !== 0) return countDiff;
          return a.topic.topicLvl2
            .toLowerCase()
            .localeCompare(b.topic.topicLvl2.toLowerCase());
        });

      return {
        topicLvl1: themeGroup.topicLvl1,
        subtopics,
        ideasCount: subtopics.reduce(
          (acc, subtopic) => acc + subtopic.ideas.length,
          0,
        ),
      };
    })
    .sort((a, b) => {
      const countDiff = b.ideasCount - a.ideasCount;
      if (countDiff !== 0) return countDiff;
      return a.topicLvl1.toLowerCase().localeCompare(b.topicLvl1.toLowerCase());
    });
}

export default function Topics({ res }: { res: ResLike }) {
  const grouped = groupByTheme(res.results, res.origin?.results);
  const totalSubtopics = grouped.reduce(
    (acc, theme) => acc + theme.subtopics.length,
    0,
  );

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">
            Topics
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {grouped.length} themes • {totalSubtopics} subthemes •{" "}
            {res.results.length} idées • {res.time}ms
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 shadow-sm">
          <span className="text-slate-500">Model</span>{" "}
          <span className="font-medium text-slate-900">{res.name}</span>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {grouped.map(({ topicLvl1, subtopics, ideasCount }) => {
          const cLvl1 = colorForTopicLvl1(topicLvl1);
          return (
            <section
              key={topicLvl1}
              className={[
                "relative overflow-visible rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow",
                cLvl1.border,
              ].join(" ")}
            >
              <div
                className={[
                  "pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full blur-3xl",
                  cLvl1.softBg,
                ].join(" ")}
              />
              <div className="relative">
                <header>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={[
                            "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-2 ring-inset",
                            cLvl1.chip,
                          ].join(" ")}
                        >
                          {topicLvl1}
                        </span>
                        <span className="text-[11px] text-slate-500">•</span>
                        <span className="text-[11px] text-slate-600">
                          {subtopics.length} subthemes
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
                          <span
                            className={[
                              "h-2 w-2 rounded-full ring-2 ring-inset",
                              cLvl2.chip,
                            ].join(" ")}
                          />
                          <span className="text-sm font-semibold text-slate-900">
                            {topic.topicLvl2}
                          </span>
                          {topic.created ?? false ? (
                            <span
                              className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-[11px] font-bold text-emerald-700"
                              title="Created topic"
                              aria-label="Created topic"
                            >
                              +
                            </span>
                          ) : null}
                          <span className="text-[11px] text-slate-500">•</span>
                          <span className="text-[11px] text-slate-600">
                            Topic ID: {topic.id.slice(0, 8)}…
                          </span>
                          <span className="text-[11px] text-slate-500">•</span>
                          <span className="text-[11px] text-slate-600">
                            {ideas.length} idées
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
            </section>
          );
        })}
      </div>
    </div>
  );
}
