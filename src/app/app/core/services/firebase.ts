import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  serverTimestamp,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(private firestore: Firestore) {}

  async testFirestoreConnection(): Promise<void> {
    try {
      const testCollection = collection(this.firestore, 'test');

      await addDoc(testCollection, {
        message: 'Firebase connected successfully',
        createdAt: serverTimestamp(),
      });

      console.log('✅ Firestore test document added');
    } catch (error) {
      console.error('❌ Firestore connection error:', error);
    }
  }
}