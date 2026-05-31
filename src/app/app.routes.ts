import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/auth/signup/signup.page').then( m => m.SignupPage)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.page').then( m => m.DashboardPage)
  },
  {
    path: 'market',
    loadComponent: () => import('./pages/market/market.page').then( m => m.MarketPage)
  },
  {
    path: 'trade',
    loadComponent: () => import('./pages/trade/trade.page').then( m => m.TradePage)
  },
  {
    path: 'portfolio',
    loadComponent: () => import('./pages/portfolio/portfolio.page').then( m => m.PortfolioPage)
  },
];
