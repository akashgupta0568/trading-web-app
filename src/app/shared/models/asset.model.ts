export type AssetType = 'Crypto' | 'Metal';

export interface Asset {
  symbol: string;
  name: string;
  type: AssetType;
  price: number;
  change: number;
  high: number;
  low: number;
  volume: string;
  points: number[];
}