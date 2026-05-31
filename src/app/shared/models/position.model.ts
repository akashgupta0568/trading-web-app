export type TradeType = 'BUY' | 'SELL';
export type PositionStatus = 'OPEN' | 'CLOSED';

export interface Position {
  id?: string;
  userId?: string;
  symbol: string;
  type: TradeType;
  entry: number;
  current: number;
  quantity: number;
  pnl: number;
  stopLoss?: number;
  target?: number;
  status: PositionStatus;
  openedAt?: Date;
  closedAt?: Date;
}