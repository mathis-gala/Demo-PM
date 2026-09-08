import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Gift,
  RotateCcw,
  Dice5,
  Store,
  SlidersHorizontal,
  TrendingUp,
} from 'lucide-react';
import { probabilities, simulate } from './simulation';
import { formatNumber, formatPercent, shopColors, strategies, type Shop } from './presentation';
import ExposureChart from './ExposureChart';
import ShopEditor from './ShopEditor';
import SimulationDetails from './SimulationDetails';
import './gifts.css';

const initialShops: Shop[] = [
  { id: 1, name: 'Petit atelier', catalog: 20, match: 50 },
  { id: 2, name: 'Maison locale', catalog: 200, match: 50 },
  { id: 3, name: 'Grand magasin', catalog: 2000, match: 50 },
];
const presets = ['Petites et grandes', 'Tailles proches', 'Un très grand catalogue'];
const catalogs = [
  [20, 200, 2000],
  [160, 200, 240],
  [20, 200, 20000],
];

export default function GiftSimulation() {
  const [shops, setShops] = useState(initialShops);
  const [preset, setPreset] = useState(0);
  const [alpha, setAlpha] = useState(0.5);
  const [draws, setDraws] = useState(10000);
  const [selected, setSelected] = useState(1);
  const [result, setResult] = useState<{ key: string; hits: number[][] } | null>(null);
  const [observed, setObserved] = useState(false);
  const [roll, setRoll] = useState(0);
  const balanceFillStyle = { transform: `scaleX(${alpha})` };
  const balanceThumbStyle = { left: `${alpha * 100}%` };
  const counts = shops.map((shop) => Math.floor((shop.catalog * shop.match) / 100));
  const eligible = counts.filter((n) => n > 0).length;
  const total = counts.reduce((a, b) => a + b, 0);
  const powers = [0, alpha, 1];
  const distributions = powers.map((power) => probabilities(counts, power));
  const key = JSON.stringify([counts, alpha, draws]);
  const current = result?.key === key;
  const showObserved = observed && current;
  const displayedShares = showObserved
    ? result.hits[selected].map((n) => n / draws)
    : distributions[selected];
  const displayedVolumes = showObserved
    ? result.hits[selected]
    : distributions[selected].map((p) => p * draws);
  const comparisonVolumes = showObserved
    ? result.hits
    : distributions.map((shares) => shares.map((share) => share * draws));
  const smallest = counts.reduce(
    (best, n, index) => (n > 0 && (best < 0 || n < counts[best]) ? index : best),
    -1
  );
  let insight = 'Ajoutez des produits retenus pour comparer les méthodes.';
  if (smallest >= 0) {
    const name = shops[smallest].name || `Boutique ${smallest + 1}`;
    insight = `${name} : environ ${formatNumber(distributions[selected][smallest] * draws)} affichages attendus avec cette méthode, contre ${formatNumber(distributions[2][smallest] * draws)} en donnant la priorité au catalogue.`;
    if (selected === 2)
      insight = `${name} possède ${formatPercent(counts[smallest] / total)} des produits retenus et reçoit donc ${formatPercent(distributions[2][smallest])} des affichages attendus.`;
  }
  let insightTitle = 'La visibilité, en clair';
  if (smallest >= 0 && selected !== 2) {
    const gain = distributions[selected][smallest] / distributions[2][smallest];
    insightTitle = `${gain.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} fois la visibilité pour la plus petite boutique`;
  }
  function choosePreset(index: number) {
    setPreset(index);
    setShops(
      initialShops.map((shop, shopIndex) => ({ ...shop, catalog: catalogs[index][shopIndex] }))
    );
    setObserved(false);
  }
  function editShops(next: Shop[]) {
    setShops(next);
    setPreset(-1);
  }
  function reset() {
    choosePreset(0);
    setAlpha(0.5);
    setDraws(10000);
    setSelected(1);
    setResult(null);
  }
  function run() {
    setResult({ key, hits: powers.map((power) => simulate(counts, power, draws)) });
    setObserved(true);
    setRoll((value) => value + 1);
  }

  return (
    <main className="gift-page" lang="fr">
      <nav className="gift-nav">
        <Link to="/">
          <ArrowLeft size={17} /> Toutes les démos
        </Link>
        <span className="gift-brand">
          <span className="gift-brand-mark">
            <Gift size={21} />
          </span>{' '}
          Cadeaux <span className="gift-brand-subtitle">/ Le simulateur</span>
        </span>
      </nav>
      <header className="gift-header">
        <div>
          <h1>La bonne place pour chaque boutique.</h1>
          <p>Un grand catalogue, oui. Toute la visibilité ? À vous de choisir.</p>
        </div>
        <div
          className="gift-flow"
          aria-label="Le principe : des boutiques, une règle, des cadeaux affichés"
        >
          <span>
            <Store size={18} /> Vos boutiques
          </span>
          <ArrowRight size={14} />
          <span>
            <SlidersHorizontal size={18} /> Votre règle
          </span>
          <ArrowRight size={14} />
          <span>
            <Gift size={18} /> Les cadeaux
          </span>
        </div>
      </header>
      <div className="gift-workspace">
        <div className="gift-main">
          <SimulationDetails
            shops={shops}
            volumes={comparisonVolumes}
            draws={draws}
            observed={showObserved}
          />
          <section className="gift-chart-section" aria-label="Résultats de la répartition">
            <div className="gift-chart-heading">
              <div>
                <span className="gift-mode">
                  <i />
                  {showObserved ? 'Tirage simulé' : 'Prévision en direct'}
                </span>
                <h2>Sur {formatNumber(draws)} cadeaux affichés</h2>
              </div>
              <button
                className="gift-primary gift-roll-button"
                onClick={run}
                disabled={!eligible}
                aria-label={`Lancer ${formatNumber(draws)} tirages par méthode`}
              >
                <Dice5
                  key={roll}
                  size={22}
                  className={roll ? 'gift-dice gift-dice-rolled' : 'gift-dice'}
                  aria-hidden="true"
                />
                <span>
                  {current ? 'Relancer les dés' : 'Lancer les dés'}
                  <small>{formatNumber(draws)} tirages / méthode</small>
                </span>
              </button>
            </div>
            <section className="gift-method-choice">
              <div className="gift-strategies" role="group" aria-label="Méthode de répartition">
                {strategies.map((strategy, index) => (
                  <button
                    key={strategy.name}
                    aria-pressed={selected === index}
                    onClick={() => setSelected(index)}
                  >
                    <span className="strategy-glyph" aria-hidden="true">
                      {distributions[index].slice(0, 3).map((share, shopIndex) => (
                        <i
                          key={shopIndex}
                          style={{
                            height: `${Math.max(4, share * 36)}px`,
                            background: shopColors[shopIndex],
                          }}
                        />
                      ))}
                    </span>
                    <span className="strategy-label">
                      {strategy.name}
                      <small>
                        {['Même poids pour tous', 'Un avantage modéré', 'Le volume décide'][index]}
                      </small>
                    </span>
                    <span className="strategy-check" aria-hidden="true">
                      {selected === index && <Check size={12} />}
                    </span>
                  </button>
                ))}
              </div>
              <p className="gift-method-description">
                <span>Le principe</span>
                {strategies[selected].description}
              </p>
            </section>
            {!eligible ? (
              <div className="gift-empty" role="status">
                <Gift size={28} />
                <h3>Aucun cadeau à proposer pour le moment</h3>
                <p>
                  Dans « Personnaliser les boutiques », augmentez le catalogue ou la part retenue
                  par le filtre.
                </p>
                <button className="gift-secondary" onClick={reset}>
                  Reprendre l’exemple de départ
                </button>
              </div>
            ) : (
              <>
                <ExposureChart
                  shops={shops}
                  counts={counts}
                  shares={displayedShares}
                  volumes={displayedVolumes}
                  observed={showObserved}
                />
                <p className="gift-chart-note">
                  {showObserved
                    ? 'Comptages réels de ce tirage. Les pourcentages sont arrondis.'
                    : '≈ Affichages attendus, arrondis. Lancez les dés pour observer le hasard.'}
                </p>
                {selected === 1 && (
                  <div className="gift-balance">
                    <div>
                      <label htmlFor="balance">Avantage aux grands catalogues</label>
                      <output htmlFor="balance">{Math.round(alpha * 100)} / 100</output>
                    </div>
                    <div className="gift-range-group">
                      <div className="gift-range-control">
                        <div className="gift-range-rail" aria-hidden="true">
                          <span style={balanceFillStyle} />
                          <i style={balanceThumbStyle}>
                            <span />
                            <span />
                          </i>
                        </div>
                        <input
                          id="balance"
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={alpha}
                          onChange={(event) => setAlpha(Number(event.target.value))}
                        />
                      </div>
                      <div className="gift-range-stops">
                        <button onClick={() => setAlpha(0)} aria-pressed={alpha === 0}>
                          Égalité
                        </button>
                        <button onClick={() => setAlpha(0.5)} aria-pressed={alpha === 0.5}>
                          Équilibré
                        </button>
                        <button onClick={() => setAlpha(1)} aria-pressed={alpha === 1}>
                          Catalogue
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                <div className="gift-insight">
                  <TrendingUp size={22} aria-hidden="true" />
                  <div>
                    <strong>{insightTitle}</strong>
                    <p>{insight}</p>
                  </div>
                </div>
              </>
            )}
            <div className="gift-result-status" role="status">
              {current ? (
                <>
                  <span>
                    <Check size={15} /> {formatNumber(draws)} affichages simulés pour chacune des 3
                    méthodes.
                  </span>
                  <button onClick={() => setObserved(!observed)}>
                    {showObserved ? 'Voir les valeurs attendues' : 'Voir le dernier tirage'}
                  </button>
                </>
              ) : result ? (
                'Les réglages ont changé. L’aperçu est à jour ; relancez un tirage pour tester ce scénario.'
              ) : (
                'Vous pouvez déjà comparer les méthodes. La simulation permet d’observer les variations du hasard.'
              )}
            </div>
          </section>
        </div>
        <aside className="gift-settings">
          <section>
            <h2>
              <SlidersHorizontal size={17} /> Votre terrain de jeu
            </h2>
            <p className="gift-help">Des exemples prêts à tester ou vos propres chiffres.</p>
            <div className="gift-presets">
              {presets.map((name, index) => (
                <button
                  key={name}
                  aria-pressed={preset === index}
                  onClick={() => choosePreset(index)}
                >
                  <span>{name}</span>
                  {preset === index ? <Check size={17} /> : <ArrowRight size={17} />}
                </button>
              ))}
            </div>
            <div className="gift-inventory-heading">
              <span>VOS BOUTIQUES</span>
              <span>{eligible} actives</span>
            </div>
            <ul className="gift-shop-summary">
              {shops.map((shop, index) => (
                <li key={shop.id}>
                  <span>
                    <i className="shop-avatar" style={{ background: shopColors[index] }}>
                      <Store size={17} />
                    </i>
                    {shop.name || `Boutique ${index + 1}`}
                  </span>
                  <strong>
                    {formatNumber(counts[index])}
                    <small> produits</small>
                  </strong>
                </li>
              ))}
            </ul>
            <p className="gift-caption">Produits retenus après les critères du client.</p>
            <details className="gift-customize">
              <summary>
                Personnaliser les boutiques <ChevronDown size={17} />
              </summary>
              <ShopEditor shops={shops} onChange={editShops} />
            </details>
          </section>
          <section className="gift-volume">
            <h2>
              <Dice5 size={18} /> Faites tourner la simulation
            </h2>
            <label htmlFor="draws">Nombre d’affichages par méthode</label>
            <input
              id="draws"
              key={draws}
              type="number"
              onKeyDown={(event) => {
                if (event.key === 'Enter') event.currentTarget.blur();
              }}
              min="1"
              max="1000000"
              defaultValue={draws}
              onBlur={(event) => {
                const value = Math.min(
                  1000000,
                  Math.max(1, Math.floor(Number(event.target.value) || 1))
                );
                setDraws(value);
                event.target.value = String(value);
              }}
            />
            <div className="gift-volume-presets">
              {[1000, 10000, 100000].map((n) => (
                <button key={n} aria-pressed={draws === n} onClick={() => setDraws(n)}>
                  {formatNumber(n)}
                </button>
              ))}
            </div>
            <p className="gift-caption">
              Un affichage = un cadeau proposé. Le même produit peut apparaître plusieurs fois.
            </p>
          </section>
          <button className="gift-reset" onClick={reset}>
            <RotateCcw size={16} /> Revenir à l’exemple de départ
          </button>
        </aside>
      </div>
    </main>
  );
}
