import { Store } from 'lucide-react';
import { formatNumber, formatPercent, shopColors, type Shop } from './presentation';

interface ExposureChartProps {
  shops: Shop[];
  counts: number[];
  shares: number[];
  volumes: number[];
  observed: boolean;
}
export default function ExposureChart({
  shops,
  counts,
  shares,
  volumes,
  observed,
}: ExposureChartProps) {
  const pages = Array.from({ length: Math.ceil(shops.length / 3) }, (_, index) => index * 3);
  return (
    <div className="exposure-chart">
      {pages.map((start) => (
        <div className="exposure-panel" key={start}>
          <div className="exposure-axis" aria-hidden="true">
            {[100, 75, 50, 25, 0].map((n) => (
              <span key={n}>{n} %</span>
            ))}
          </div>
          <div className="exposure-columns">
            {shops.slice(start, start + 3).map((shop, localIndex) => {
              const index = start + localIndex;
              const style = {
                transform: `scaleY(${shares[index]})`,
                background: shopColors[index],
              };
              return (
                <div className="exposure-column" key={shop.id}>
                  <div className="exposure-value">
                    <strong>
                      {!observed && volumes[index] > 0 ? '≈ ' : ''}
                      {formatNumber(volumes[index])}
                    </strong>
                    <span className="exposure-percentage" style={{ color: shopColors[index] }}>
                      {formatPercent(shares[index])}
                      <small> des affichages</small>
                    </span>
                  </div>
                  <div className="exposure-bar-space" aria-hidden="true">
                    <div className="exposure-bar" style={style} />
                  </div>
                  <div className="exposure-caption">
                    <span
                      className="exposure-shop-icon"
                      style={{ color: shopColors[index] }}
                      aria-hidden="true"
                    >
                      <Store size={19} />
                    </span>
                    <strong>{shop.name || `Boutique ${index + 1}`}</strong>
                    <span>
                      {counts[index]
                        ? `${formatNumber(counts[index])} produits retenus`
                        : 'Aucun produit retenu'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
