export interface StatDefinition {
  id: string;
  target: number;
  suffix: string;
  label: string;
  detail: string;
}

export const COMPANY_STATS: StatDefinition[] = [
  {
    id: 'years',
    target: 35,
    suffix: '+',
    label: 'Years in Commercial Tyre Trading',
    detail: 'Established supply heritage across Pakistan since 1991',
  },
  {
    id: 'supplied',
    target: 250,
    suffix: 'K+',
    label: 'Commercial Tyres Supplied',
    detail: 'Verified port-to-depot nationwide freight deliveries',
  },
  {
    id: 'clients',
    target: 500,
    suffix: '+',
    label: 'Contracted Fleet Clients',
    detail: 'Logistics, cement mining, civil & passenger fleets',
  },
  {
    id: 'depots',
    target: 7,
    suffix: '',
    label: 'National Regional Depots',
    detail: 'Karachi, Lahore, Rawalpindi, Multan, Faisalabad, Peshawar, Quetta',
  },
];

export function easeOutCubic(progress: number): number {
  const clamped = Math.max(0, Math.min(1, progress));
  return 1 - Math.pow(1 - clamped, 3);
}

export function computeAnimatedStatValue(target: number, progress: number): number {
  if (target <= 0) return 0;
  const eased = easeOutCubic(progress);
  return Math.min(target, Math.max(0, Math.round(target * eased)));
}

export function formatAnimatedStat(value: number, suffix: string): string {
  return `${Math.max(0, Math.round(value)).toLocaleString()}${suffix}`;
}
