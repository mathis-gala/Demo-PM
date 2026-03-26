import { useMemo, useRef, useState } from "react";
import LoadingBarView from "./LoadingBarView";
import Topics from "./Topics";
import { PARAPHRASE_MULTILINGUAL_RES } from "../res/classic";
import { DISTILUSE_COSINE_WITH_DESC_RES } from "../res/distiluse-cosine";
import { CROSS_ONLY_RES } from "../res/cross-only";
import { HYBRID_RES } from "../res/hybrid";
import { HYBRID_NO_ORPHANS_RES } from "../res/hybrid-no-orphans";

const RESOURCES = [
  PARAPHRASE_MULTILINGUAL_RES,
  DISTILUSE_COSINE_WITH_DESC_RES,
  CROSS_ONLY_RES,
  HYBRID_RES,
  HYBRID_NO_ORPHANS_RES,
] as const;

export default function Home() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [classifiedIndex, setClassifiedIndex] = useState<number | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const selected = useMemo(() => RESOURCES[selectedIndex] ?? RESOURCES[0], [selectedIndex]);
  const classified = useMemo(
    () => (classifiedIndex !== null ? (RESOURCES[classifiedIndex] ?? null) : null),
    [classifiedIndex],
  );

  const onChangeModel = (index: number) => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setSelectedIndex(index);
    setClassifiedIndex(null);
    setIsClassifying(false);
    setProgress(0);
  };

  const onClassify = () => {
    if (isClassifying) return;

    const durationMs = Math.max(120, selected.time);
    setIsClassifying(true);
    setProgress(0);
    setClassifiedIndex(null);

    const start = performance.now();
    if (intervalRef.current) window.clearInterval(intervalRef.current);

    intervalRef.current = window.setInterval(() => {
      const now = performance.now();
      const p = Math.min(1, (now - start) / durationMs);
      setProgress(p);
      if (p >= 1) {
        if (intervalRef.current) window.clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsClassifying(false);
        setClassifiedIndex(selectedIndex);
      }
    }, 16);
  };

  return (
    <div className="min-h-full bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Demo PM</h1>
              <p className="mt-2 text-sm text-slate-600">
                Choisis parmi les modèles pour voir les résultats des
                classifications. L’objectif est de simuler la réactivité (temps
                de réponse) et la pertinence du modèle, comme si un calcul était
                en cours.
              </p>
            </div>

            <div className="w-full sm:w-[560px]">
              <label className="block text-xs font-medium text-slate-700">
                Modèle
              </label>
              <div className="mt-2 flex flex-col gap-3">
                <select
                  value={selectedIndex}
                  onChange={(e) =>
                    onChangeModel(Number(e.target.value))
                  }
                  disabled={isClassifying}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none ring-0 transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200/60"
                >
                  {RESOURCES.map((res, idx) => (
                    <option
                      key={`${res.name}-${idx}`}
                      value={idx}
                      className="bg-white"
                    >
                      {"origin" in res ? `${res.name} (no orphans)` : res.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500">
                  Currently loaded: {RESOURCES.length} • Temps simulé:{" "}
                  {selected.time}ms
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            {classified ? (
              <Topics res={classified} />
            ) : isClassifying ? (
              <LoadingBarView
                title="Classification en cours…"
                subtitle="Simulation de calcul pour représenter la réactivité du modèle."
                durationMs={Math.max(120, selected.time)}
                progress={progress}
              />
            ) : (
              <div className="flex min-h-[260px] items-center justify-center">
                <div className="text-center">
                  <p className="text-sm text-slate-600">
                    Clique pour lancer la simulation et afficher les topics.
                  </p>
                  <button
                    type="button"
                    onClick={onClassify}
                    className="mt-4 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
                  >
                    Classifier
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
