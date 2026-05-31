export type WalletTransactionType =
  | 'DEMO_DEPOSIT'
  | 'DEMO_WITHDRAW'
  | 'TRADE_MARGIN'
  | 'TRADE_REFUND'
  | 'PROFIT'
  | 'LOSS';

export interface WalletTransaction {
  id?: string;
  userId: string;
  type: WalletTransactionType;
  amount: number;
  balanceAfter: number;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  createdAt: Date;
}