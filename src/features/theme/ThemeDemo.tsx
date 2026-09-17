import { useRef, useState, type ChangeEvent, type DragEvent, type CSSProperties } from 'react';
import { Link } from '@tanstack/react-router';
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronDown,
  ImagePlus,
  Palette,
  RotateCcw,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import { arrangements, contrastRatio, createTheme } from './colors';
import { imageAccept, readThemeImage } from './imageFile';
import { referencePalette } from './reference';
import referenceImage from './assets/reference.png';
import PhonePreview from './PhonePreview';
import './theme.css';

interface StageStyle extends CSSProperties {
  '--stage-tint': string;
  '--stage-ink': string;
}
export default function ThemeDemo() {
  const [image, setImage] = useState(referenceImage);
  const [imageName, setImageName] = useState('Noël · visuel de référence');
  const [reference, setReference] = useState(true);
  const [palette, setPalette] = useState(referencePalette);
  const [seed, setSeed] = useState('#122161');
  const [arrangement, setArrangement] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [notice, setNotice] = useState(
    'La couleur d’origine est sélectionnée. Importez une image pour découvrir son thème.'
  );
  const [hexDraft, setHexDraft] = useState('#122161');
  const [hexError, setHexError] = useState('');
  const [compared, setCompared] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const request = useRef(0);
  const theme = createTheme(seed, arrangement);
  const originalTheme = createTheme('#122161', 0);
  const previewTheme = compared ? originalTheme : theme;
  const stageStyle: StageStyle = {
    '--stage-tint': previewTheme.selection,
    '--stage-ink': previewTheme.primary,
  };
  const buttonContrast = Math.min(
    contrastRatio(theme.primary, theme.onPrimary),
    contrastRatio(theme.primaryEnd, theme.onPrimary)
  );
  const roles = [
    { name: 'Boutons & titres', color: theme.primary },
    { name: 'Fond de page', color: theme.background },
    { name: 'Sélection', color: theme.selection },
    { name: 'Texte', color: theme.text },
  ];
  function selectColor(color: string) {
    setSeed(color);
    setHexDraft(color);
    setHexError('');
    setArrangement(0);
    setCompared(false);
    setNotice(`Couleur de départ ${color}. Les variantes sont recalculées.`);
  }
  async function importImage(file: File) {
    const id = ++request.current;
    setBusy(true);
    setError('');
    try {
      const imported = await readThemeImage(file);
      if (id !== request.current) return;
      setImage(imported.url);
      setImageName(imported.name);
      setPalette(imported.colors);
      setReference(false);
      selectColor(imported.colors[0]);
      setNotice(
        `${imported.colors.length} couleur${imported.colors.length > 1 ? 's' : ''} proposée${imported.colors.length > 1 ? 's' : ''}. La première est appliquée à l’aperçu.`
      );
    } catch (cause) {
      if (id === request.current)
        setError(cause instanceof Error ? cause.message : 'L’image n’a pas pu être analysée.');
    } finally {
      if (id === request.current) setBusy(false);
    }
  }
  function chooseFile() {
    fileInput.current?.click();
  }
  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (file) void importImage(file);
  }
  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) void importImage(file);
  }
  function handleDrag(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(true);
  }
  function reset() {
    request.current++;
    setBusy(false);
    setError('');
    setDragging(false);
    setImage(referenceImage);
    setImageName('Noël · visuel de référence');
    setReference(true);
    setPalette(referencePalette);
    selectColor('#122161');
    setNotice('Le visuel et la couleur d’origine ont été restaurés.');
  }
  function handleColor(event: ChangeEvent<HTMLInputElement>) {
    selectColor(event.target.value.toUpperCase());
  }
  function applyHex() {
    const value = hexDraft.trim().toUpperCase();
    if (!/^#[0-9A-F]{6}$/.test(value)) {
      setHexError('Utilisez un code à 6 caractères, par exemple #122161.');
      return;
    }
    if (value !== seed) selectColor(value);
    else {
      setHexDraft(value);
      setHexError('');
    }
  }
  function leaveDrop(event: DragEvent<HTMLDivElement>) {
    if (
      !event.currentTarget.contains(
        event.relatedTarget instanceof Node ? event.relatedTarget : null
      )
    )
      setDragging(false);
  }
  function toggleCompare() {
    setCompared(!compared);
  }
  return (
    <main className="theme-demo" lang="fr">
      <nav className="theme-nav">
        <Link to="/">
          <ArrowLeft size={16} /> Toutes les démos
        </Link>
        <span>
          <Palette size={19} /> CEIBA <i>/</i> Couleurs en scène
        </span>
      </nav>
      <header className="theme-header">
        <div>
          <p className="theme-eyebrow">LE LABO DES AMBIANCES</p>
          <h1>Une image. Toute une ambiance.</h1>
          <p>Importez un visuel : ses couleurs habillent votre parcours cadeau.</p>
        </div>
        <div className="theme-process" aria-label="Image, couleur, interface">
          <ImagePlus size={19} />
          <span>Votre image</span>
          <ArrowUpRight size={16} />
          <Palette size={19} />
          <span>Votre thème</span>
        </div>
      </header>
      <div className="theme-workspace">
        <section className="theme-stage" style={stageStyle} aria-label="Aperçu du parcours cadeau">
          <div className="theme-stage-top">
            <span>
              <i /> Aperçu interactif
            </span>
            <button onClick={toggleCompare} aria-pressed={compared}>
              {compared ? 'Revenir à mon thème' : 'Voir les couleurs d’origine'}
            </button>
          </div>
          <div className="theme-phone-wrap">
            <PhonePreview theme={previewTheme} image={image} reference={reference} />
          </div>
          <div className="theme-stage-caption">
            <span className="theme-caption-line" />
            <p>
              {compared ? 'Couleurs d’origine · #122161' : `${arrangements[arrangement]} · ${seed}`}
              <small>
                {compared
                  ? 'Votre image est conservée pour comparer les couleurs.'
                  : 'Touchez les choix pour essayer les états sélectionnés.'}
              </small>
            </p>
          </div>
        </section>
        <aside className="theme-controls" aria-label="Personnalisation du thème">
          <section className="theme-step">
            <div className="theme-section-heading">
              <h2>
                <span>01</span> Donnez le ton
              </h2>
              <button
                className="theme-reset"
                onClick={reset}
                title="Restaurer le visuel et le thème de référence"
              >
                <RotateCcw size={14} /> Réinitialiser
              </button>
            </div>
            <p>Choisissez l’image qui donnera sa personnalité à la page.</p>
            <div
              className="theme-import"
              data-dragging={dragging}
              onDrop={handleDrop}
              onDragOver={handleDrag}
              onDragLeave={leaveDrop}
              aria-busy={busy}
            >
              <div className="theme-image-thumb">
                <img
                  className={reference ? 'theme-reference-thumb' : ''}
                  src={image}
                  alt="Image utilisée pour le thème"
                />
              </div>
              <div>
                <strong>{busy ? 'Analyse des couleurs…' : imageName}</strong>
                <span>JPG, PNG ou WebP · 15 Mo max.</span>
                <button className="theme-upload-button" onClick={chooseFile} disabled={busy}>
                  <Upload size={15} /> {busy ? 'Analyse en cours' : 'Importer une image'}
                </button>
              </div>
              <input
                ref={fileInput}
                className="sr-only"
                tabIndex={-1}
                aria-label="Importer une image de thème"
                type="file"
                accept={imageAccept}
                onChange={handleFile}
              />
            </div>
            <p className="theme-local-note">
              Vous pouvez aussi glisser une image ici. Elle reste sur votre appareil.
            </p>
            {error && (
              <p className="theme-error" role="alert">
                {error}
              </p>
            )}
          </section>
          <section className="theme-step">
            <div className="theme-section-heading">
              <h2>
                <span>02</span> Choisissez le point de départ
              </h2>
              <span className="theme-small-label">
                {palette.length} couleur{palette.length > 1 ? 's' : ''} extraite
                {palette.length > 1 ? 's' : ''}
              </span>
            </div>
            <p>Une couleur vous plaît ? Cliquez dessus pour l’appliquer.</p>
            <div className="theme-swatches" role="group" aria-label="Couleurs extraites de l’image">
              {palette.map((color, index) => (
                <button
                  key={color}
                  onClick={() => selectColor(color)}
                  aria-label={`Choisir ${color}${index === 0 ? ', couleur suggérée' : ''}`}
                  aria-pressed={seed === color}
                >
                  <span style={{ background: color }}>{seed === color && <Check size={17} />}</span>
                  <small>{color}</small>
                  {index === 0 && <em>Suggérée</em>}
                </button>
              ))}
            </div>
            <div className="theme-custom-color">
              <label className="theme-color-picker">
                Couleur de départ
                <input
                  aria-label="Choisir une couleur personnalisée"
                  type="color"
                  value={seed}
                  onChange={handleColor}
                />
              </label>
              <label className="theme-hex-label">
                <span className="sr-only">Code hexadécimal de la couleur</span>
                <input
                  aria-label="Code hexadécimal de la couleur"
                  value={hexDraft}
                  maxLength={7}
                  spellCheck={false}
                  onChange={(event) => setHexDraft(event.target.value)}
                  onBlur={applyHex}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') applyHex();
                  }}
                  aria-invalid={Boolean(hexError)}
                />
              </label>
              <span>{reference && seed === '#122161' ? 'Couleur d’origine' : 'Votre couleur'}</span>
            </div>
            {hexError && (
              <p className="theme-error" role="alert">
                {hexError}
              </p>
            )}
          </section>
          <section className="theme-step">
            <div className="theme-section-heading">
              <h2>
                <span>03</span> Faites varier l’ambiance
              </h2>
            </div>
            <p>La couleur de départ reste la même. Son intensité et sa place changent.</p>
            <div className="theme-arrangements" role="group" aria-label="Répartition des couleurs">
              {arrangements.map((name, index) => (
                <button
                  key={name}
                  aria-pressed={arrangement === index}
                  onClick={() => {
                    setArrangement(index);
                    setCompared(false);
                  }}
                >
                  <i className={`theme-arrangement-glyph tone-${index}`} aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </i>
                  {name}
                </button>
              ))}
            </div>
            <div
              className="theme-ramp"
              aria-label="Nuances générées à partir de la couleur choisie"
            >
              {theme.scale.map((color, index) => (
                <div
                  key={index}
                  style={{ background: color }}
                  title={`${index === 0 ? 'Départ' : 'Variante'} : ${color}`}
                >
                  <span>{index === 0 && 'Départ'}</span>
                </div>
              ))}
            </div>
            <div className="theme-role-list">
              {roles.map((role) => (
                <div key={role.name}>
                  <i style={{ background: role.color }} />
                  <span>{role.name}</span>
                  <code>{role.color}</code>
                </div>
              ))}
            </div>
            <div className="theme-contrast">
              <ShieldCheck size={17} />
              <span>
                Texte des boutons lisible{' '}
                <strong>
                  {buttonContrast.toLocaleString('fr-FR', {
                    maximumFractionDigits: 1,
                  })}
                  :1
                </strong>
              </span>
            </div>
            {theme.primary !== seed && (
              <p className="theme-adjustment">
                La variante des boutons est ajustée pour rester lisible. Votre couleur de départ est
                conservée.
              </p>
            )}
          </section>
          <p className="theme-notice" role="status">
            {busy ? 'Lecture de l’image et recherche des couleurs…' : notice}
          </p>
          <details className="theme-algorithm">
            <summary>
              Comment l’algorithme choisit les couleurs <ChevronDown size={16} />
            </summary>
            <ol>
              <li>
                Une version réduite de l’image est analysée. Les pixels majoritairement transparents
                sont ignorés.
              </li>
              <li>
                Les pixels proches sont regroupés. Les couleurs sont classées selon leur présence et
                leur intensité, avec moins de poids pour les teintes presque grises. Une image
                monochrome garde sa teinte.
              </li>
              <li>
                À partir de votre choix, des nuances perceptuelles HCT sont générées. Les contrastes
                des textes et boutons sont vérifiés ; une couleur trop claire est assombrie pour ces
                usages.
              </li>
            </ol>
            <p>
              Les couleurs extraites représentent des groupes de pixels : ce ne sont pas
              nécessairement les valeurs d’un pixel unique. Le bleu de référence #122161 est, lui,
              relevé dans la capture fournie.
            </p>
            <a
              href="https://github.com/material-foundation/material-color-utilities"
              target="_blank"
              rel="noreferrer"
            >
              Calculs basés sur Material Color Utilities <ArrowUpRight size={13} />
            </a>
          </details>
        </aside>
      </div>
    </main>
  );
}
