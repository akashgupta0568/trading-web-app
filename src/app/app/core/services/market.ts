import { Injectable } from '@angular/core';

export interface LiveAssetPrice {
  symbol: string;
  price: number;
  change: number;
  high: number;
  low: number;
  volume: string;
}

@Injectable({
  providedIn: 'root',
})
export class MarketService {
  private cryptoSymbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'];
  private metalSymbols = ['XAUUSDT', 'XAGUSDT'];

  async getAllLivePrices(): Promise<LiveAssetPrice[]> {
    const cryptoPrices = await this.getCryptoPrices();
    const metalPrices = await this.getMetalPrices();

    return [...cryptoPrices, ...metalPrices];
  }

  private async getCryptoPrices(): Promise<LiveAssetPrice[]> {
    const requests = this.cryptoSymbols.map(async (symbol) => {
      const url = `https://data-api.binance.vision/api/v3/ticker/24hr?symbol=${symbol}`;

      const response = await fetch(url);
      const data = await response.json();

      return {
        symbol: data.symbol,
        price: Number(data.lastPrice),
        change: Number(data.priceChangePercent),
        high: Number(data.highPrice),
        low: Number(data.lowPrice),
        volume: this.formatVolume(Number(data.volume)),
      };
    });

    return Promise.all(requests);
  }

  private async getMetalPrices(): Promise<LiveAssetPrice[]> {
    const requests = this.metalSymbols.map(async (symbol) => {
      const url = `https://fapi.binance.com/fapi/v1/ticker/24hr?symbol=${symbol}`;

      const response = await fetch(url);
      const data = await response.json();

      return {
        symbol: data.symbol,
        price: Number(data.lastPrice),
        change: Number(data.priceChangePercent),
        high: Number(data.highPrice),
        low: Number(data.lowPrice),
        volume: this.formatVolume(Number(data.volume)),
      };
    });

    return Promise.all(requests);
  }

  private formatVolume(volume: number): string {
    if (volume >= 1000000000) {
      return (volume / 1000000000).toFixed(2) + 'B';
    }

    if (volume >= 1000000) {
      return (volume / 1000000).toFixed(2) + 'M';
    }

    if (volume >= 1000) {
      return (volume / 1000).toFixed(2) + 'K';
    }

    return volume.toFixed(2);
  }
}