import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonButton } from '@ionic/angular/standalone';
import { Auth } from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import { Position, TradingService } from 'src/app/app/core/services/trading';
import { MarketService } from 'src/app/app/core/services/market';



@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.page.html',
  styleUrls: ['./portfolio.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonButton],
})
export class PortfolioPage implements OnInit, OnDestroy {
  positions: Position[] = [];
  private positionSub?: Subscription;
  private priceTimer: any;

  constructor(
    private auth: Auth,
    private router: Router,
    private tradingService: TradingService,
    private marketService: MarketService
  ) {}

  ngOnInit(): void {
    const user = this.auth.currentUser;

    if (!user) {
      this.router.navigateByUrl('/login');
      return;
    }

    this.positionSub = this.tradingService
      .getOpenPositions(user.uid)
      .subscribe((positions) => {
        this.positions = positions;
        this.updateLivePnl();
      });

    this.priceTimer = setInterval(() => {
      this.updateLivePnl();
    }, 1000);
  }

  ngOnDestroy(): void {
    this.positionSub?.unsubscribe();

    if (this.priceTimer) {
      clearInterval(this.priceTimer);
    }
  }

  get totalPnl(): number {
    return this.positions.reduce((total, position) => total + position.pnl, 0);
  }

  async updateLivePnl(): Promise<void> {
    if (this.positions.length === 0) return;

    try {
      const livePrices = await this.marketService.getAllLivePrices();

      this.positions = this.positions.map((position) => {
        const liveAsset = livePrices.find(
          (item) => item.symbol === position.symbol
        );

        if (!liveAsset) return position;

        const direction = position.tradeType === 'BUY' ? 1 : -1;

        const pnl =
          (liveAsset.price - position.entryPrice) *
          position.quantity *
          direction;

        return {
          ...position,
          currentPrice: liveAsset.price,
          pnl,
        };
      });
    } catch (error) {
      console.error('Portfolio live P&L error:', error);
    }
  }

  async closeTrade(position: Position): Promise<void> {
    await this.tradingService.closePosition(
      position,
      position.currentPrice
    );
  }

  goDashboard(): void {
    this.router.navigateByUrl('/dashboard');
  }

  goMarket(): void {
    this.router.navigateByUrl('/market');
  }
}