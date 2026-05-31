import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  user,
  User,
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  setDoc,
  serverTimestamp,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser$: Observable<User | null>;

  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {
    this.currentUser$ = user(this.auth);
  }

  async signup(name: string, email: string, password: string): Promise<void> {
    const credential = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );

    const uid = credential.user.uid;

    await setDoc(doc(this.firestore, 'users', uid), {
      uid,
      name,
      email,
      photoURL: '',
      demoBalance: 25000,
      totalProfitLoss: 0,
      isActive: true,
      createdAt: serverTimestamp(),
    });
  }

  async login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }
}