export const formatNumber = (value: number) =>
  value.toLocaleString('fr-FR', { maximumFractionDigits: 0 });
export const formatPercent = (value: number) =>
  `${(value * 100).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} %`;
export const shopColors = [
  'oklch(0.53 0.19 292)',
  'oklch(0.58 0.16 46)',
  'oklch(0.5 0.1 184)',
  'oklch(0.55 0.16 335)',
  'oklch(0.53 0.15 295)',
  'oklch(0.51 0.1 220)',
  'oklch(0.51 0.15 20)',
  'oklch(0.5 0.12 130)',
  'oklch(0.47 0.16 275)',
  'oklch(0.5 0.1 90)',
  'oklch(0.45 0.04 250)',
  'oklch(0.52 0.17 315)',
];
export interface Shop {
  id: number;
  name: string;
  catalog: number;
  match: number;
}
export const strategies = [
  {
    name: 'Même chance',
    description: 'Chaque boutique apparaît autant, quelle que soit sa taille.',
  },
  {
    name: 'Un juste milieu',
    description: 'Les grands catalogues apparaissent davantage, avec un avantage modéré.',
  },
  {
    name: 'Priorité au catalogue',
    description: 'Plus une boutique a de produits retenus, plus elle apparaît.',
  },
];
