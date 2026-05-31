import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { MarketService } from 'src/app/app/core/services/market';
import { Router } from '@angular/router';


interface Asset {
  symbol: string;
  name: string;
  price: number;
  change: number;
  high: number;
  low: number;
  volume: string;
  type: 'Crypto' | 'Metal';
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent],
})
export class DashboardPage implements OnInit, OnDestroy {
  demoBalance = 25000;
  todayPnl = 0;
  activeTrades = 0;

  private priceTimer: any;

  assets: Asset[] = [
    {
      symbol: 'BTCUSDT',
      name: 'Bitcoin',
      price: 0,
      change: 0,
      high: 0,
      low: 0,
      volume: '0',
      type: 'Crypto',
    },
    {
      symbol: 'ETHUSDT',
      name: 'Ethereum',
      price: 0,
      change: 0,
      high: 0,
      low: 0,
      volume: '0',
      type: 'Crypto',
    },
    {
      symbol: 'SOLUSDT',
      name: 'Solana',
      price: 0,
      change: 0,
      high: 0,
      low: 0,
      volume: '0',
      type: 'Crypto',
    },
    {
      symbol: 'XAUUSDT',
      name: 'Gold',
      price: 0,
      change: 0,
      high: 0,
      low: 0,
      volume: '0',
      type: 'Metal',
    },
    {
      symbol: 'XAGUSDT',
      name: 'Silver',
      price: 0,
      change: 0,
      high: 0,
      low: 0,
      volume: '0',
      type: 'Metal',
    },
  ];

  constructor(private marketService: MarketService,   private router: Router) {}

  ngOnInit(): void {
    this.loadLivePrices();

    this.priceTimer = setInterval(() => {
      this.loadLivePrices();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.priceTimer) {
      clearInterval(this.priceTimer);
    }
  }

  goMarket(): void {
  this.router.navigateByUrl('/market');
}

  async loadLivePrices(): Promise<void> {
    try {
      const livePrices = await this.marketService.getAllLivePrices();

      this.assets = this.assets.map((asset) => {
        const liveAsset = livePrices.find(
          (item) => item.symbol === asset.symbol
        );

        if (!liveAsset) {
          return asset;
        }

        return {
          ...asset,
          price: liveAsset.price,
          change: liveAsset.change,
          high: liveAsset.high,
          low: liveAsset.low,
          volume: liveAsset.volume,
        };
      });

      console.table(this.assets);
    } catch (error) {
      console.error('Live price error:', error);
    }
  }
}