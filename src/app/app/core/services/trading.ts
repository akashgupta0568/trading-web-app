import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  collectionData,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export type TradeType = 'BUY' | 'SELL';
export type PositionStatus = 'OPEN' | 'CLOSED';

export interface CreateTradeRequest {
  userId: string;
  symbol: string;
  assetName: string;
  tradeType: TradeType;
  entryPrice: number;
  quantity: number;
  marginUsed: number;
  stopLoss: number;
  target: number;
}

export interface Position {
  id?: string;
  userId: string;
  symbol: string;
  assetName: string;
  tradeType: TradeType;
  entryPrice: number;
  currentPrice: number;
  quantity: number;
  marginUsed: number;
  stopLoss: number;
  target: number;
  pnl: number;
  status: PositionStatus;
  openedAt?: any;
  closedAt?: any;
  exitPrice?: number | null;
}

@Injectable({
  providedIn: 'root',
})
export class TradingService {
  constructor(private firestore: Firestore) {}

  async createPaperTrade(trade: CreateTradeRequest): Promise<void> {
    const positionsRef = collection(this.firestore, 'positions');

    await addDoc(positionsRef, {
      ...trade,
      currentPrice: trade.entryPrice,
      pnl: 0,
      status: 'OPEN',
      openedAt: serverTimestamp(),
      closedAt: null,
      exitPrice: null,
    });
  }

  getOpenPositions(userId: string): Observable<Position[]> {
    const positionsRef = collection(this.firestore, 'positions');

    const q = query(
      positionsRef,
      where('userId', '==', userId),
      where('status', '==', 'OPEN')
    );

    return collectionData(q, { idField: 'id' }) as Observable<Position[]>;
  }

  async closePosition(position: Position, exitPrice: number): Promise<void> {
    if (!position.id) return;

    const direction = position.tradeType === 'BUY' ? 1 : -1;

    const finalPnl =
      (exitPrice - position.entryPrice) * position.quantity * direction;

    const positionRef = doc(this.firestore, 'positions', position.id);

    await updateDoc(positionRef, {
      currentPrice: exitPrice,
      exitPrice,
      pnl: finalPnl,
      status: 'CLOSED',
      closedAt: serverTimestamp(),
    });
  }
}