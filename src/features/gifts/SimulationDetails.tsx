import { useRef, useState } from 'react';
import { Columns3, BookOpen, X, Store, SlidersHorizontal, Gift } from 'lucide-react';
import { formatNumber, formatPercent, shopColors, strategies, type Shop } from './presentation';

interface SimulationDetailsProps {
  shops: Shop[];
  volumes: number[][];
  draws: number;
  observed: boolean;
}
export default function SimulationDetails({
  shops,
  volumes,
  draws,
  observed,
}: SimulationDetailsProps) {
  const compareButton = useRef<HTMLButtonElement>(null);
  const helpButton = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState<'compare' | 'help' | null>(null);
  function toggleCompare() {
    setOpen(open === 'compare' ? null : 'compare');
  }
  function toggleHelp() {
    setOpen(open === 'help' ? null : 'help');
  }
  function close() {
    if (open === 'compare') compareButton.current?.focus();
    else helpButton.current?.focus();
    setOpen(null);
  }
  return (
    <section className="simulation-details" aria-label="Outils de comparaison et aide">
      <div className="simulation-tools">
        <span>À VOUS DE JOUER</span>
        <div>
          <button
            ref={compareButton}
            onClick={toggleCompare}
            aria-expanded={open === 'compare'}
            aria-controls="simulation-comparison"
          >
            <Columns3 size={16} /> Comparer les méthodes
          </button>
          <button
            ref={helpButton}
            onClick={toggleHelp}
            aria-expanded={open === 'help'}
            aria-controls="simulation-help"
          >
            <BookOpen size={16} /> Mode d’emploi
          </button>
        </div>
      </div>
      <div
        className="simulation-detail-panel"
        id="simulation-comparison"
        hidden={open !== 'compare'}
      >
        <header>
          <div>
            <h2>Chaque méthode, boutique par boutique</h2>
            <p>
              {observed ? 'Résultats du dernier tirage' : 'Prévisions moyennes, arrondies'} pour{' '}
              {formatNumber(draws)} affichages par méthode.
            </p>
          </div>
          <button aria-label="Fermer la comparaison" onClick={close}>
            <X size={19} />
          </button>
        </header>
        <div className="simulation-comparison-rows">
          {shops.map((shop, index) => (
            <section key={shop.id}>
              <h3>
                <Store size={17} style={{ color: shopColors[index] }} />
                {shop.name || `Boutique ${index + 1}`}
              </h3>
              <dl>
                {strategies.map((strategy, methodIndex) => (
                  <div key={strategy.name}>
                    <dt>{strategy.name}</dt>
                    <dd>
                      {observed ? '' : '≈ '}
                      {formatNumber(volumes[methodIndex][index])}
                      <span>
                        {formatPercent(volumes[methodIndex][index] / draws)} des affichages
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
        <p className="simulation-panel-note">
          On compte des apparitions, pas des produits uniques. Un même cadeau peut être proposé
          plusieurs fois.
        </p>
      </div>
      <div className="simulation-detail-panel" id="simulation-help" hidden={open !== 'help'}>
        <header>
          <div>
            <h2>Des boutiques aux cadeaux, en 3 étapes</h2>
            <p>Le simulateur montre qui sera vu et dans quelles proportions.</p>
          </div>
          <button aria-label="Fermer le mode d’emploi" onClick={close}>
            <X size={19} />
          </button>
        </header>
        <ol className="simulation-howto">
          <li>
            <Store size={23} />
            <div>
              <h3>1. Choisissez les produits disponibles</h3>
              <p>
                Le catalogue est filtré selon les critères du client. Seuls les produits retenus
                comptent ; une boutique sans produit est exclue.
              </p>
            </div>
          </li>
          <li>
            <SlidersHorizontal size={23} />
            <div>
              <h3>2. Décidez du poids des boutiques</h3>
              <p>
                « Même chance » les met à égalité. « Priorité au catalogue » favorise leur volume. «
                Un juste milieu » vous laisse ajuster cet avantage.
              </p>
            </div>
          </li>
          <li>
            <Gift size={23} />
            <div>
              <h3>3. Regardez les cadeaux affichés</h3>
              <p>
                On choisit une boutique, puis un de ses produits au hasard. Les barres montrent les
                prévisions ; les dés donnent un tirage réel de la simulation.
              </p>
            </div>
          </li>
        </ol>
        <details className="simulation-formula">
          <summary>Pour aller plus loin : la formule</summary>
          <p>
            Le poids d’une boutique est nᵢᵅ, où nᵢ est son nombre de produits retenus. Sa
            probabilité est P(i) = nᵢᵅ / Σ nⱼᵅ. Le réglage 50 / 100 correspond à α = 0,5 : 100 fois
            plus de produits donnent 10 fois plus de chances.
          </p>
          <p>
            Produits retenus = catalogue × pourcentage du filtre, arrondi à l’entier inférieur. Les
            tirages sont indépendants avec remise. Chaque méthode reçoit le même nombre de tirages ;
            les résultats varient à chaque lancement.
          </p>
        </details>
      </div>
    </section>
  );
}
