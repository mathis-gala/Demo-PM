import { AlertTriangle } from "lucide-react";
import { cn } from "@utils/cn";
import { Badge } from "@ui/Badge";
import type { IdeaItem } from "../types";

export default function Ideas({
  ideas,
  scoreBadgeClassName = "border-slate-200 bg-white text-slate-700",
}: {
  ideas: IdeaItem[];
  scoreBadgeClassName?: string;
}) {
  return (
    <ul className="mt-4 grid gap-2">
      {ideas.map((idea) => (
        <li
          key={idea.id}
          className="group rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-slate-300 hover:shadow"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {idea.moved && (
                <span className="group/tooltip relative mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                  <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                  <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-1 w-64 -translate-x-1/2 rounded-md bg-slate-900 px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow transition-opacity group-hover/tooltip:opacity-100">
                    {idea.movedFrom
                      ? `Idée déplacée depuis: ${idea.movedFrom}`
                      : "Idée déplacée depuis une autre catégorie"}
                  </span>
                </span>
              )}
              <p className="text-sm leading-relaxed text-slate-800">{idea.text}</p>
            </div>
            {idea.score && (
              <Badge
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
                  scoreBadgeClassName,
                )}
              >
                score {Math.round(idea.score * 1000) / 1000}
              </Badge>
            )}
          </div>
          <div className="mt-2 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-0 transition group-hover:opacity-100" />
        </li>
      ))}
    </ul>
  );
}
