import { Plus, Trash2 } from 'lucide-react';
import { formatNumber, shopColors, type Shop } from './presentation';

interface ShopEditorProps {
  shops: Shop[];
  onChange: (shops: Shop[]) => void;
}
export default function ShopEditor({ shops, onChange }: ShopEditorProps) {
  function update(id: number, field: 'catalog' | 'match', value: string) {
    const max = field === 'catalog' ? 1000000 : 100;
    const parsed = Math.min(max, Math.max(0, Math.floor(Number(value) || 0)));
    onChange(shops.map((shop) => (shop.id === id ? { ...shop, [field]: parsed } : shop)));
  }
  function add() {
    const id = Math.max(...shops.map((shop) => shop.id)) + 1;
    onChange([...shops, { id, name: `Boutique ${id}`, catalog: 100, match: 50 }]);
  }
  return (
    <div className="shop-editor">
      <p>Le filtre représente les critères choisis par le client : budget, envies, occasion…</p>
      {shops.map((shop, index) => (
        <fieldset key={shop.id}>
          <legend>
            <span className="shop-dot" style={{ background: shopColors[index] }} /> Boutique{' '}
            {index + 1}
          </legend>
          <div className="shop-name">
            <label>
              Nom
              <input
                aria-label={`Nom boutique ${index + 1}`}
                maxLength={40}
                value={shop.name}
                onChange={(event) =>
                  onChange(
                    shops.map((item) =>
                      item.id === shop.id ? { ...item, name: event.target.value } : item
                    )
                  )
                }
              />
            </label>
            <button
              className="gift-icon-button"
              aria-label={`Supprimer boutique ${index + 1}`}
              disabled={shops.length === 1}
              onClick={() => onChange(shops.filter((item) => item.id !== shop.id))}
            >
              <Trash2 size={17} />
            </button>
          </div>
          <div className="shop-numbers">
            <label>
              Produits au catalogue
              <input
                key={`catalog-${shop.catalog}`}
                aria-label={`Catalogue boutique ${index + 1}`}
                type="number"
                onKeyDown={(event) => {
                  if (event.key === 'Enter') event.currentTarget.blur();
                }}
                min="0"
                max="1000000"
                defaultValue={shop.catalog}
                onBlur={(event) => {
                  update(shop.id, 'catalog', event.target.value);
                  event.target.value = String(
                    Math.min(1000000, Math.max(0, Math.floor(Number(event.target.value) || 0)))
                  );
                }}
              />
            </label>
            <label>
              Retenus par le filtre (%)
              <input
                key={`match-${shop.match}`}
                aria-label={`Filtre boutique ${index + 1}`}
                type="number"
                onKeyDown={(event) => {
                  if (event.key === 'Enter') event.currentTarget.blur();
                }}
                min="0"
                max="100"
                defaultValue={shop.match}
                onBlur={(event) => {
                  update(shop.id, 'match', event.target.value);
                  event.target.value = String(
                    Math.min(100, Math.max(0, Math.floor(Number(event.target.value) || 0)))
                  );
                }}
              />
            </label>
          </div>
          <p className="shop-retained">
            {formatNumber(Math.floor((shop.catalog * shop.match) / 100))} produits disponibles après
            filtrage
          </p>
        </fieldset>
      ))}
      <button className="gift-secondary" onClick={add} disabled={shops.length >= 12}>
        <Plus size={17} /> Ajouter une boutique
      </button>
      <small>De 1 à 12 boutiques. Jusqu’à 1 000 000 de produits par catalogue.</small>
    </div>
  );
}
