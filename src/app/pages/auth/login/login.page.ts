import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  IonContent,
  IonInput,
  IonButton,
  IonIcon,
  IonSpinner
} from '@ionic/angular';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonContent,
    IonInput,
    IonButton,
    IonIcon,
    IonSpinner
  ],
  template: `
    <ion-content class="login-content">
      <div class="login-container">
        <div class="login-card">
          <div class="brand-header">
            <div class="brand-logo">B</div>
            <h2>Welcome to BixEdu</h2>
            <p>SaaS Coaching Centre Management Platform</p>
          </div>

          <form (ngSubmit)="onLogin()" class="login-form">
            <div class="form-group">
              <label>Email Address</label>
              <ion-input
                type="email"
                [(ngModel)]="email"
                name="email"
                placeholder="name@coaching.com"
                fill="outline"
                required>
              </ion-input>
            </div>

            <div class="form-group">
              <label>Password</label>
              <ion-input
                type="password"
                [(ngModel)]="password"
                name="password"
                placeholder="••••••••"
                fill="outline"
                required>
              </ion-input>
            </div>

            <ion-button
              type="submit"
              expand="block"
              color="primary"
              class="submit-btn"
              [disabled]="loading">
              <ion-spinner name="crescent" *ngIf="loading"></ion-spinner>
              <span *ngIf="!loading">Sign In</span>
            </ion-button>
          </form>

          <div class="login-footer">
            <p>Don't have an account? <a routerLink="/auth/register" class="register-link">Register Coaching Centre</a></p>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .login-content {
      --background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
    }

    .login-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 20px;
    }

    .login-card {
      background: #ffffff;
      border-radius: 20px;
      padding: 36px 28px;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    }

    .brand-header {
      text-align: center;
      margin-bottom: 28px;

      .brand-logo {
        width: 54px;
        height: 54px;
        border-radius: 14px;
        background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        font-weight: 800;
        margin: 0 auto 16px auto;
        box-shadow: 0 6px 16px rgba(79, 70, 229, 0.4);
      }

      h2 {
        margin: 0 0 4px 0;
        font-size: 24px;
        font-weight: 800;
        color: #0f172a;
      }

      p {
        margin: 0;
        font-size: 13px;
        color: #64748b;
      }
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;

      label {
        font-size: 13px;
        font-weight: 600;
        color: #334155;
      }

      ion-input {
        --border-radius: 10px;
        --border-color: #cbd5e1;
        --padding-start: 14px;
      }
    }

    .submit-btn {
      --border-radius: 10px;
      --padding-top: 14px;
      --padding-bottom: 14px;
      font-weight: 700;
      font-size: 15px;
      margin-top: 8px;
    }

    .login-footer {
      text-align: center;
      margin-top: 24px;
      font-size: 13px;
      color: #64748b;

      .register-link {
        color: #4f46e5;
        font-weight: 700;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  `]
})
export class LoginPage {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  email: string = '';
  password: string = '';
  loading: boolean = false;

  onLogin(): void {
    if (!this.email || !this.password) {
      this.toastService.warning('Please enter email and password');
      return;
    }

    this.loading = true;
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.toastService.success('Logged in successfully');
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.toastService.error(err.error?.message || 'Login failed');
      }
    });
  }
}

