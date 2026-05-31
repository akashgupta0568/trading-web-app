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
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonContent, IonInput, IonButton, IonText, FormsModule],
})
export class SignupPage {
  name = '';
  email = '';
  password = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async signup(): Promise<void> {
    try {
      this.errorMessage = '';
      await this.authService.signup(this.name, this.email, this.password);
      this.router.navigateByUrl('/dashboard');
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }

  goToLogin(): void {
    this.router.navigateByUrl('/login');
  }
}