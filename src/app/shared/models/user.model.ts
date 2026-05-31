export interface AppUser {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  demoBalance: number;
  totalProfitLoss: number;
  createdAt: Date;
  isActive: boolean;
}