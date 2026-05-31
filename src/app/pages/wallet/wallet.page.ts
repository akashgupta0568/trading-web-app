import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonInput,
  IonButton,
  IonText,
} from '@ionic/angular/standalone';
import { Auth } from '@angular/fire/auth';
import { WalletService } from 'src/app/app/core/services/wallet';


@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonInput,
    IonButton,
    IonText,
  ],
})
export class WalletPage implements OnInit {
  demoBalance = 0;
  depositAmount = 5000;
  errorMessage = '';
  successMessage = '';

  constructor(
    private auth: Auth,
    private router: Router,
    private walletService: WalletService
  ) {}

  ngOnInit(): void {
    this.loadBalance();
  }

  async loadBalance(): Promise<void> {
    const user = this.auth.currentUser;

    if (!user) {
      this.router.navigateByUrl('/login');
      return;
    }

    this.demoBalance = await this.walletService.getDemoBalance(user.uid);
  }

  async addBalance(): Promise<void> {
    try {
      this.errorMessage = '';
      this.successMessage = '';

      const user = this.auth.currentUser;

      if (!user) {
        this.router.navigateByUrl('/login');
        return;
      }

      if (this.depositAmount <= 0) {
        this.errorMessage = 'Amount must be greater than 0.';
        return;
      }

      await this.walletService.addDemoBalance(user.uid, this.depositAmount);

      this.successMessage = 'Demo balance added successfully.';
      await this.loadBalance();
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }

  goDashboard(): void {
    this.router.navigateByUrl('/dashboard');
  }
}