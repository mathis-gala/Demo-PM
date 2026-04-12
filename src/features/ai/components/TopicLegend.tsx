import { AlertTriangle } from "lucide-react";
import { Card } from "@ui/Card";
import { Badge } from "@ui/Badge";

export function TopicLegend() {
  return (
    <Card className="mt-4 bg-slate-50/80 border-slate-200 px-4 py-2.5 text-[12px] text-slate-600 shadow-none">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <span className="font-medium text-slate-500">Légende</span>

        <span className="flex items-center gap-1.5">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-[11px] font-bold text-emerald-700">
            +
          </span>
          Catégorie créée (nouveau)
        </span>

        <span className="flex items-center gap-1.5">
          <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <AlertTriangle className="h-3 w-3" aria-hidden="true" />
          </span>
          Idée déplacée
        </span>

        <span className="flex items-center gap-1.5">
          <Badge className="px-2 py-0.5 text-[11px]">score 0.92</Badge>
          Score de confiance
        </span>

        <span className="flex items-center gap-1.5">
          <Badge variant="soft" className="px-2 py-0.5 text-[11px]">
            42
          </Badge>
          Nombre d'idées
        </span>
      </div>
    </Card>
  );
}
