import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    IonContent,
    IonInput,
    IonButton,
    IonIcon,
    IonSpinner
  ],
  template: `
    <ion-content class="register-content">
      <div class="register-container">
        <div class="register-card">
          <div class="brand-header">
            <div class="brand-logo">B</div>
            <h2>Create Coaching Centre</h2>
            <p>Register your coaching institute and set up your Centre Admin account</p>
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
            <div class="form-grid">
              <!-- Section 1: Centre Information -->
              <div class="form-section">
                <h3 class="section-title">
                  <ion-icon name="business-outline"></ion-icon>
                  Centre Details
                </h3>

                <div class="form-group">
                  <label>Centre Name *</label>
                  <ion-input
                    type="text"
                    formControlName="centreName"
                    placeholder="e.g. Apex Academy"
                    fill="outline">
                  </ion-input>
                  <span class="error-msg" *ngIf="isInvalid('centreName')">
                    Centre name is required (min 3 chars)
                  </span>
                </div>

                <div class="form-group">
                  <label>Centre Email</label>
                  <ion-input
                    type="email"
                    formControlName="centreEmail"
                    placeholder="contact@apexacademy.com"
                    fill="outline">
                  </ion-input>
                </div>

                <div class="form-group">
                  <label>Centre Phone</label>
                  <ion-input
                    type="tel"
                    formControlName="centrePhone"
                    placeholder="+91 98765 43210"
                    fill="outline">
                  </ion-input>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label>City</label>
                    <ion-input
                      type="text"
                      formControlName="city"
                      placeholder="e.g. Bengaluru"
                      fill="outline">
                    </ion-input>
                  </div>
                  <div class="form-group">
                    <label>State</label>
                    <ion-input
                      type="text"
                      formControlName="state"
                      placeholder="e.g. Karnataka"
                      fill="outline">
                    </ion-input>
                  </div>
                </div>

                <div class="form-group">
                  <label>Address</label>
                  <ion-input
                    type="text"
                    formControlName="address"
                    placeholder="Street, Landmark"
                    fill="outline">
                  </ion-input>
                </div>
              </div>

              <!-- Section 2: Admin Account Details -->
              <div class="form-section">
                <h3 class="section-title">
                  <ion-icon name="person-outline"></ion-icon>
                  Centre Admin Account
                </h3>

                <div class="form-group">
                  <label>Admin Full Name *</label>
                  <ion-input
                    type="text"
                    formControlName="adminName"
                    placeholder="e.g. Rahul Sharma"
                    fill="outline">
                  </ion-input>
                  <span class="error-msg" *ngIf="isInvalid('adminName')">
                    Admin name is required
                  </span>
                </div>

                <div class="form-group">
                  <label>Email Address *</label>
                  <ion-input
                    type="email"
                    formControlName="adminEmail"
                    placeholder="rahul@apexacademy.com"
                    fill="outline">
                  </ion-input>
                  <span class="error-msg" *ngIf="isInvalid('adminEmail')">
                    Valid email address is required
                  </span>
                </div>

                <div class="form-group">
                  <label>Phone Number</label>
                  <ion-input
                    type="tel"
                    formControlName="adminPhone"
                    placeholder="+91 98765 43210"
                    fill="outline">
                  </ion-input>
                </div>

                <div class="form-group">
                  <label>Password *</label>
                  <ion-input
                    type="password"
                    formControlName="password"
                    placeholder="Minimum 6 characters"
                    fill="outline">
                  </ion-input>
                  <span class="error-msg" *ngIf="isInvalid('password')">
                    Password must be at least 6 characters
                  </span>
                </div>

                <div class="form-group">
                  <label>Confirm Password *</label>
                  <ion-input
                    type="password"
                    formControlName="confirmPassword"
                    placeholder="Re-enter password"
                    fill="outline">
                  </ion-input>
                  <span class="error-msg" *ngIf="hasPasswordMismatch()">
                    Passwords do not match
                  </span>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <ion-button
                type="submit"
                expand="block"
                color="primary"
                class="submit-btn"
                [disabled]="loading || registerForm.invalid || hasPasswordMismatch()">
                <ion-spinner name="crescent" *ngIf="loading"></ion-spinner>
                <span *ngIf="!loading">Create Centre & Admin Account</span>
              </ion-button>
            </div>
          </form>

          <div class="register-footer">
            <p>Already have an account? <a routerLink="/auth/login" class="login-link">Sign In</a></p>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .register-content {
      --background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
    }

    .register-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 32px 16px;
    }

    .register-card {
      background: #ffffff;
      border-radius: 20px;
      padding: 36px 32px;
      width: 100%;
      max-width: 900px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
    }

    .brand-header {
      text-align: center;
      margin-bottom: 32px;

      .brand-logo {
        width: 56px;
        height: 56px;
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
        margin: 0 0 6px 0;
        font-size: 26px;
        font-weight: 800;
        color: #0f172a;
      }

      p {
        margin: 0;
        font-size: 14px;
        color: #64748b;
      }
    }

    .register-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 28px;

      @media (min-width: 768px) {
        grid-template-columns: 1fr 1fr;
      }
    }

    .form-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: #f8fafc;
      padding: 20px;
      border-radius: 14px;
      border: 1px solid #e2e8f0;

      .section-title {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0 0 4px 0;
        font-size: 16px;
        font-weight: 700;
        color: #1e293b;

        ion-icon {
          color: #4f46e5;
          font-size: 20px;
        }
      }
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
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
        --padding-start: 12px;
        font-size: 14px;
      }
    }

    .error-msg {
      font-size: 12px;
      color: #ef4444;
      font-weight: 500;
    }

    .form-actions {
      margin-top: 8px;
    }

    .submit-btn {
      --border-radius: 12px;
      --padding-top: 14px;
      --padding-bottom: 14px;
      font-weight: 700;
      font-size: 16px;
    }

    .register-footer {
      text-align: center;
      margin-top: 24px;
      font-size: 14px;
      color: #64748b;

      .login-link {
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
export class RegisterPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  loading = false;

  registerForm: FormGroup = this.fb.group({
    centreName: ['', [Validators.required, Validators.minLength(3)]],
    centreEmail: ['', [Validators.email]],
    centrePhone: [''],
    address: [''],
    city: [''],
    state: [''],
    country: ['India'],
    adminName: ['', [Validators.required]],
    adminEmail: ['', [Validators.required, Validators.email]],
    adminPhone: [''],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  });

  isInvalid(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  hasPasswordMismatch(): boolean {
    const password = this.registerForm.get('password')?.value;
    const confirm = this.registerForm.get('confirmPassword')?.value;
    return !!(confirm && password !== confirm);
  }

  onSubmit(): void {
    if (this.registerForm.invalid || this.hasPasswordMismatch()) {
      this.registerForm.markAllAsTouched();
      this.toastService.warning('Please complete all required fields correctly');
      return;
    }

    this.loading = true;
    const val = this.registerForm.value;

    this.authService
      .register({
        centreName: val.centreName,
        centreEmail: val.centreEmail,
        centrePhone: val.centrePhone,
        address: val.address,
        city: val.city,
        state: val.state,
        country: val.country,
        adminName: val.adminName,
        adminEmail: val.adminEmail,
        adminPhone: val.adminPhone,
        password: val.password
      })
      .subscribe({
        next: (res) => {
          this.loading = false;
          if (res.success) {
            this.toastService.success('Centre & Admin account created successfully!');
            this.router.navigate(['/dashboard']);
          }
        },
        error: (err) => {
          this.loading = false;
          this.toastService.error(err.error?.message || 'Registration failed');
        }
      });
  }
}
