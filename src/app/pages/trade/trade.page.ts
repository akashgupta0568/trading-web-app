import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonInput,
  IonButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonText,
} from '@ionic/angular/standalone';
import { Auth } from '@angular/fire/auth';
import { TradeType, TradingService } from 'src/app/app/core/services/trading';
import { MarketService } from 'src/app/app/core/services/market';
// import { MarketService } from '../../core/services/market.service';
// import {
//   TradingService,
//   TradeType,
// } from '../../core/services/trading.service';

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
  selector: 'app-trade',
  templateUrl: './trade.page.html',
  styleUrls: ['./trade.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonInput,
    IonButton,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonText,
  ],
})
export class TradePage implements OnInit, OnDestroy {
  selectedSymbol = 'BTCUSDT';
  tradeType: TradeType = 'BUY';

  quantity = 0.01;
  stopLoss = 0;
  target = 0;

  demoBalance = 25000;
  errorMessage = '';
  successMessage = '';

  private priceTimer: any;

  assets: Asset[] = [
    { symbol: 'BTCUSDT', name: 'Bitcoin', price: 0, change: 0, high: 0, low: 0, volume: '0', type: 'Crypto' },
    { symbol: 'ETHUSDT', name: 'Ethereum', price: 0, change: 0, high: 0, low: 0, volume: '0', type: 'Crypto' },
    { symbol: 'SOLUSDT', name: 'Solana', price: 0, change: 0, high: 0, low: 0, volume: '0', type: 'Crypto' },
    { symbol: 'XAUUSDT', name: 'Gold', price: 0, change: 0, high: 0, low: 0, volume: '0', type: 'Metal' },
    { symbol: 'XAGUSDT', name: 'Silver', price: 0, change: 0, high: 0, low: 0, volume: '0', type: 'Metal' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: Auth,
    private marketService: MarketService,
    private tradingService: TradingService
  ) {}

  ngOnInit(): void {
    const symbol = this.route.snapshot.queryParamMap.get('symbol');

    if (symbol) {
      this.selectedSymbol = symbol;
    }

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

  get selectedAsset(): Asset {
    return (
      this.assets.find((asset) => asset.symbol === this.selectedSymbol) ??
      this.assets[0]
    );
  }

  get estimatedMargin(): number {
    return this.selectedAsset.price * this.quantity;
  }

  get pnlPreview(): number {
    if (!this.selectedAsset.price || !this.target) {
      return 0;
    }

    const direction = this.tradeType === 'BUY' ? 1 : -1;
    return (this.target - this.selectedAsset.price) * this.quantity * direction;
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

      if (this.stopLoss === 0 && this.selectedAsset.price > 0) {
        this.setDefaultLevels();
      }
    } catch (error) {
      console.error('Trade live price error:', error);
    }
  }

  setDefaultLevels(): void {
    const price = this.selectedAsset.price;

    if (this.tradeType === 'BUY') {
      this.stopLoss = Number((price * 0.98).toFixed(4));
      this.target = Number((price * 1.03).toFixed(4));
    } else {
      this.stopLoss = Number((price * 1.02).toFixed(4));
      this.target = Number((price * 0.97).toFixed(4));
    }
  }

  onTradeTypeChange(): void {
    this.setDefaultLevels();
  }

  async placeTrade(): Promise<void> {
    try {
      this.errorMessage = '';
      this.successMessage = '';

      const user = this.auth.currentUser;

      if (!user) {
        this.errorMessage = 'Please login first.';
        this.router.navigateByUrl('/login');
        return;
      }

      if (this.selectedAsset.price <= 0) {
        this.errorMessage = 'Live price not loaded yet.';
        return;
      }

      if (this.quantity <= 0) {
        this.errorMessage = 'Quantity must be greater than 0.';
        return;
      }

      if (this.estimatedMargin > this.demoBalance) {
        this.errorMessage = 'Insufficient demo balance.';
        return;
      }

      await this.tradingService.createPaperTrade({
        userId: user.uid,
        symbol: this.selectedAsset.symbol,
        assetName: this.selectedAsset.name,
        tradeType: this.tradeType,
        entryPrice: this.selectedAsset.price,
        quantity: this.quantity,
        marginUsed: this.estimatedMargin,
        stopLoss: this.stopLoss,
        target: this.target,
      });

      this.successMessage = 'Paper trade placed successfully.';
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }

  goBack(): void {
    this.router.navigateByUrl('/market');
  }
}