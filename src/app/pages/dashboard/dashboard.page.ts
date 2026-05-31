import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';

interface Asset {
  symbol: string;
  name: string;
  price: number;
  change: number;
  type: 'Crypto' | 'Metal';
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
  ],
})
export class DashboardPage {
  demoBalance = 25000;
  todayPnl = 1240.5;
  activeTrades = 2;

  assets: Asset[] = [
    {
      symbol: 'BTCUSDT',
      name: 'Bitcoin',
      price: 68420,
      change: 2.64,
      type: 'Crypto',
    },
    {
      symbol: 'ETHUSDT',
      name: 'Ethereum',
      price: 3715,
      change: 1.18,
      type: 'Crypto',
    },
    {
      symbol: 'SOLUSDT',
      name: 'Solana',
      price: 164.32,
      change: -0.82,
      type: 'Crypto',
    },
    {
      symbol: 'XAUUSDT',
      name: 'Gold',
      price: 2355.4,
      change: 0.46,
      type: 'Metal',
    },
    {
      symbol: 'XAGUSDT',
      name: 'Silver',
      price: 30.84,
      change: -0.22,
      type: 'Metal',
    },
  ];
}