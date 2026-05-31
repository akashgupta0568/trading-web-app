import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  constructor(private firestore: Firestore) {}

  async getDemoBalance(userId: string): Promise<number> {
    const userRef = doc(this.firestore, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return 0;
    }

    const userData: any = userSnap.data();
    return Number(userData.demoBalance ?? 0);
  }

  async addDemoBalance(userId: string, amount: number): Promise<void> {
    const currentBalance = await this.getDemoBalance(userId);
    const newBalance = currentBalance + amount;

    const userRef = doc(this.firestore, 'users', userId);

    await updateDoc(userRef, {
      demoBalance: newBalance,
    });

    await addDoc(collection(this.firestore, 'walletTransactions'), {
      userId,
      type: 'DEMO_DEPOSIT',
      amount,
      balanceAfter: newBalance,
      status: 'SUCCESS',
      createdAt: serverTimestamp(),
    });
  }
}