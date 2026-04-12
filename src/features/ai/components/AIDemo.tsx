import { Button } from '@ui/Button';
import { Card } from '@ui/Card';
import { Progress } from '@ui/Progress';
import { useAIDemoSimulation } from '@features/ai/hooks/useAIDemoSimulation';
import { Topics } from './Topics';
import { ResourceSelector } from './ResourceSelector';
import { formatTime } from '@utils/formatTime';
import {
  COHERE_EMBED_RES,
  COHERE_EMBED_RES_NO_ORPHANS,
  CURRENT_RES,
  HYBRID_NO_ORPHANS_RES,
  HYBRID_RES,
} from '@res';

const RESOURCES = [
  CURRENT_RES,
  HYBRID_RES,
  HYBRID_NO_ORPHANS_RES,
  COHERE_EMBED_RES,
  COHERE_EMBED_RES_NO_ORPHANS,
] as const;

export function AIDemo() {
  const {
    selected,
    classified,
    selectedIndex,
    progress,
    isClassifying,
    onChangeModel,
    onClassify,
    onSkipClassify,
  } = useAIDemoSimulation(RESOURCES);

  const progressValue = Math.max(0, Math.min(100, Math.round(progress * 100)));
  const durationMs = Math.max(120, selected.time);

  return (
    <div className="min-h-full bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <Card className="p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <section>
              <h1 className="text-2xl font-semibold tracking-tight">Demo AI</h1>
              <p className="mt-2 text-sm text-slate-600">
                Choisis parmi les modèles pour voir les résultats des classifications. L'objectif
                est de simuler la réactivité (temps de réponse) et la pertinence du modèle, comme si
                un calcul était en cours.
              </p>
            </section>

            <ResourceSelector
              resources={RESOURCES}
              selectedIndex={selectedIndex}
              isDisabled={isClassifying}
              onChangeModel={onChangeModel}
              selectedTime={selected.time}
            />
          </div>

          <div className="mt-10">
            {classified ? (
              <Topics res={classified} />
            ) : isClassifying ? (
              <div className="space-y-4">
                <Card className="p-8 w-3/4 mx-auto">
                  <div className="text-center">
                    <p className="text-base font-semibold tracking-tight text-slate-900">
                      Classification en cours…
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      Simulation de calcul pour représenter la réactivité du modèle.
                    </p>
                  </div>

                  <div className="mt-6 grid gap-2">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>
                        Temps simulé:{' '}
                        <span className="font-medium text-slate-900">{formatTime(durationMs)}</span>
                      </span>
                      <span className="tabular-nums">{progressValue}%</span>
                    </div>
                    <Progress value={progressValue} />
                  </div>
                </Card>
                <div className="flex justify-center">
                  <Button variant="secondary" onClick={onSkipClassify}>
                    Ignorer le chargement
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[260px] items-center justify-center">
                <div className="text-center">
                  <p className="text-sm text-slate-600">
                    Clique pour lancer la simulation et afficher les catégories.
                  </p>
                  <Button className="mt-4" onClick={onClassify}>
                    Classifier
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
