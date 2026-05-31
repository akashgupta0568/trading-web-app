import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent,
  IonInput,
  IonButton,
  IonText,
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/app/core/services/auth';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
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
export class LoginPage {
  email = '';
  password = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async login(): Promise<void> {
    try {
      this.errorMessage = '';
      await this.authService.login(this.email, this.password);
      this.router.navigateByUrl('/dashboard');
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }

  goToSignup(): void {
    this.router.navigateByUrl('/signup');
  }
}