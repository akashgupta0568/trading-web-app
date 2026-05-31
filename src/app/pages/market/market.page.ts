import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from '@ionic/angular/standalone';
import { MarketService } from 'src/app/app/core/services/market';
import { FormsModule } from '@angular/forms';

type MarketTab = 'All' | 'Crypto' | 'Metal';

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
  selector: 'app-market',
  templateUrl: './market.page.html',
  styleUrls: ['./market.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
  ],
})
export class MarketPage implements OnInit, OnDestroy {
  searchText = '';
  selectedTab: MarketTab = 'All';
  private priceTimer: any;

  assets: Asset[] = [
    { symbol: 'BTCUSDT', name: 'Bitcoin', price: 0, change: 0, high: 0, low: 0, volume: '0', type: 'Crypto' },
    { symbol: 'ETHUSDT', name: 'Ethereum', price: 0, change: 0, high: 0, low: 0, volume: '0', type: 'Crypto' },
    { symbol: 'SOLUSDT', name: 'Solana', price: 0, change: 0, high: 0, low: 0, volume: '0', type: 'Crypto' },
    { symbol: 'XAUUSDT', name: 'Gold', price: 0, change: 0, high: 0, low: 0, volume: '0', type: 'Metal' },
    { symbol: 'XAGUSDT', name: 'Silver', price: 0, change: 0, high: 0, low: 0, volume: '0', type: 'Metal' },
  ];

  constructor(
    private marketService: MarketService,
    private router: Router
  ) {}

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

  get filteredAssets(): Asset[] {
    return this.assets.filter((asset) => {
      const matchTab =
        this.selectedTab === 'All' || asset.type === this.selectedTab;

      const keyword = this.searchText.toLowerCase();

      const matchSearch =
        asset.symbol.toLowerCase().includes(keyword) ||
        asset.name.toLowerCase().includes(keyword);

      return matchTab && matchSearch;
    });
  }

  async loadLivePrices(): Promise<void> {
    try {
      const livePrices = await this.marketService.getAllLivePrices();

      this.assets = this.assets.map((asset) => {
        const liveAsset = livePrices.find((item) => item.symbol === asset.symbol);

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
    } catch (error) {
      console.error('Market live price error:', error);
    }
  }

  openTrade(asset: Asset): void {
    this.router.navigate(['/trade'], {
      queryParams: {
        symbol: asset.symbol,
      },
    });
  }

  goDashboard(): void {
    this.router.navigateByUrl('/dashboard');
  }
}