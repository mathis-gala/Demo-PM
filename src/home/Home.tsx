import { useMemo, useRef, useState } from 'react'
import LoadingBarView from './LoadingBarView'
import Topics from './Topics'
import { PARAPHRASE_MULTILINGUAL_RES } from '../res/paraphrase-multilingual'

const RESOURCES = [
  {
    id: 'paraphrase-multilingual-MiniLM-L12-v2',
    label: 'paraphrase-multilingual-MiniLM-L12-v2',
    res: PARAPHRASE_MULTILINGUAL_RES,
  },
] as const

export default function Home() {
  const [selectedId, setSelectedId] = useState<(typeof RESOURCES)[number]['id']>(RESOURCES[0].id)
  const [classifiedId, setClassifiedId] = useState<(typeof RESOURCES)[number]['id'] | null>(null)
  const [isClassifying, setIsClassifying] = useState(false)
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef<number | null>(null)

  const selected = useMemo(() => RESOURCES.find((r) => r.id === selectedId) ?? RESOURCES[0], [selectedId])
  const classified = useMemo(
    () => (classifiedId ? RESOURCES.find((r) => r.id === classifiedId) ?? null : null),
    [classifiedId],
  )

  const onChangeModel = (id: (typeof RESOURCES)[number]['id']) => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setSelectedId(id)
    setClassifiedId(null)
    setIsClassifying(false)
    setProgress(0)
  }

  const onClassify = () => {
    if (isClassifying) return

    const durationMs = Math.max(120, selected.res.time)
    setIsClassifying(true)
    setProgress(0)
    setClassifiedId(null)

    const start = performance.now()
    if (intervalRef.current) window.clearInterval(intervalRef.current)

    intervalRef.current = window.setInterval(() => {
      const now = performance.now()
      const p = Math.min(1, (now - start) / durationMs)
      setProgress(p)
      if (p >= 1) {
        if (intervalRef.current) window.clearInterval(intervalRef.current)
        intervalRef.current = null
        setIsClassifying(false)
        setClassifiedId(selectedId)
      }
    }, 16)
  }

  return (
    <div className="min-h-full bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Demo PM</h1>
              <p className="mt-2 text-sm text-slate-600">
                Choisis parmi les modèles pour voir les résultats des classifications. L’objectif est de simuler la
                réactivité (temps de réponse) et la pertinence du modèle, comme si un calcul était en cours.
              </p>
            </div>

            <div className="w-full sm:w-[560px]">
              <label className="block text-xs font-medium text-slate-700">Modèle</label>
              <div className="mt-2 flex flex-col gap-3">
                <select
                  value={selectedId}
                  onChange={(e) => onChangeModel(e.target.value as (typeof RESOURCES)[number]['id'])}
                  disabled={isClassifying}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none ring-0 transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200/60"
                >
                  {RESOURCES.map((r) => (
                    <option key={r.id} value={r.id} className="bg-white">
                      {r.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500">
                  Currently loaded: {RESOURCES.length} • Temps simulé: {selected.res.time}ms
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            {classified ? (
              <Topics res={classified.res} />
            ) : isClassifying ? (
              <LoadingBarView
                title="Classification en cours…"
                subtitle="Simulation de calcul pour représenter la réactivité du modèle."
                durationMs={Math.max(120, selected.res.time)}
                progress={progress}
              />
            ) : (
              <div className="flex min-h-[260px] items-center justify-center">
                <div className="text-center">
                  <p className="text-sm text-slate-600">Clique pour lancer la simulation et afficher les topics.</p>
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
  )
}
