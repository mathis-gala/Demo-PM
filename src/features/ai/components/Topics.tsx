import { Badge } from "@ui/Badge";
import { groupByTheme } from "../utils/groupByTheme";
import { pluralize } from "@utils/pluralize";
import { formatTime } from "@utils/formatTime";
import type { ResLike } from "../types";
import { TopicLegend } from "./TopicLegend";
import { TopicSection } from "./TopicSection";

export function Topics({ res }: { res: ResLike }) {
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
            Catégories
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {grouped.length} catégories • {totalSubtopics} sous-catégories • {res.results.length} {pluralize(res.results.length, "idée", "idées")} • {formatTime(res.time)}
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-2 text-xs">
          <span className="text-slate-500">Modèle</span>{" "}
          <span className="font-medium text-slate-900">{res.name}</span>
        </Badge>
      </div>

      <TopicLegend />

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {grouped.map((group) => (
          <TopicSection key={group.topicLvl1} group={group} />
        ))}
      </div>
    </div>
  );
}
