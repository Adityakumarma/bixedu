import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  IonInput,
  IonButton,
  IonSpinner,
  IonIcon
} from '@ionic/angular';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { Centre } from '../../core/models/centre.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonInput,
    IonButton,
    IonSpinner,
    IonIcon,
    PageHeaderComponent
  ],
  template: `
    <div class="settings-page">
      <app-page-header
        title="Centre Settings"
        subtitle="View and update coaching institute profile, contact details, and admin profile"
        icon="settings-outline">
      </app-page-header>

      <div class="settings-container">
        <!-- User Profile Card -->
        <div class="settings-card profile-card" *ngIf="currentUser$ | async as user">
          <div class="card-header">
            <ion-icon name="person-circle-outline" class="card-icon"></ion-icon>
            <div>
              <h3>Admin User Profile</h3>
              <p>Authenticated Centre Administrator details</p>
            </div>
          </div>
          <div class="profile-details-grid">
            <div class="detail-item">
              <span class="label">Full Name</span>
              <span class="value">{{ user.name }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Email Address</span>
              <span class="value">{{ user.email }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Phone</span>
              <span class="value">{{ user.phone || 'N/A' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">User Role</span>
              <span class="role-badge">{{ user.role }}</span>
            </div>
          </div>
        </div>

        <!-- Centre Information Form Card -->
        <div class="settings-card">
          <div class="card-header">
            <ion-icon name="business-outline" class="card-icon"></ion-icon>
            <div>
              <h3>Coaching Centre Profile</h3>
              <p>Update institute information displayed on receipts and reports</p>
            </div>
          </div>

          <form [formGroup]="centreForm" (ngSubmit)="onSaveCentre()" class="centre-form">
            <div class="form-row">
              <div class="form-group">
                <label>Centre Name *</label>
                <ion-input
                  type="text"
                  formControlName="name"
                  placeholder="Institute Name"
                  fill="outline">
                </ion-input>
              </div>

              <div class="form-group">
                <label>Centre Code (System ID)</label>
                <ion-input
                  type="text"
                  formControlName="code"
                  [readonly]="true"
                  fill="outline"
                  class="readonly-input">
                </ion-input>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Contact Email</label>
                <ion-input
                  type="email"
                  formControlName="email"
                  placeholder="centre@coaching.com"
                  fill="outline">
                </ion-input>
              </div>

              <div class="form-group">
                <label>Contact Phone</label>
                <ion-input
                  type="tel"
                  formControlName="phone"
                  placeholder="+91 98765 43210"
                  fill="outline">
                </ion-input>
              </div>
            </div>

            <div class="form-group">
              <label>Address</label>
              <ion-input
                type="text"
                formControlName="address"
                placeholder="Street address, premises"
                fill="outline">
              </ion-input>
            </div>

            <div class="form-row-3">
              <div class="form-group">
                <label>City</label>
                <ion-input
                  type="text"
                  formControlName="city"
                  placeholder="City"
                  fill="outline">
                </ion-input>
              </div>

              <div class="form-group">
                <label>State</label>
                <ion-input
                  type="text"
                  formControlName="state"
                  placeholder="State"
                  fill="outline">
                </ion-input>
              </div>

              <div class="form-group">
                <label>Country</label>
                <ion-input
                  type="text"
                  formControlName="country"
                  placeholder="Country"
                  fill="outline">
                </ion-input>
              </div>
            </div>

            <div class="form-actions">
              <ion-button
                type="submit"
                color="primary"
                class="save-btn"
                [disabled]="saving || centreForm.invalid">
                <ion-spinner name="crescent" *ngIf="saving"></ion-spinner>
                <span *ngIf="!saving">Save Centre Changes</span>
              </ion-button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-page {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .settings-container {
      display: flex;
      flex-direction: column;
      gap: 24px;
      max-width: 1000px;
    }

    .settings-card {
      background: var(--bixedu-surface, #ffffff);
      border-radius: 16px;
      padding: 28px;
      border: 1px solid var(--bixedu-border, #e5e7eb);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

      .card-header {
        display: flex;
        align-items: center;
        gap: 14px;
        margin-bottom: 24px;

        .card-icon {
          font-size: 28px;
          color: #4f46e5;
          background: rgba(79, 70, 229, 0.1);
          padding: 10px;
          border-radius: 12px;
        }

        h3 {
          margin: 0 0 2px 0;
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
        }

        p {
          margin: 0;
          font-size: 13px;
          color: #64748b;
        }
      }
    }

    .profile-details-grid {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 16px;

      @media (min-width: 640px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (min-width: 1024px) {
        grid-template-columns: repeat(4, 1fr);
      }

      .detail-item {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .label {
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .value {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
        }

        .role-badge {
          display: inline-block;
          font-size: 12px;
          font-weight: 700;
          background: rgba(79, 70, 229, 0.1);
          color: #4f46e5;
          padding: 4px 10px;
          border-radius: 6px;
          width: fit-content;
        }
      }
    }

    .centre-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;

      @media (min-width: 640px) {
        grid-template-columns: 1fr 1fr;
      }
    }

    .form-row-3 {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;

      @media (min-width: 640px) {
        grid-template-columns: 1fr 1fr 1fr;
      }
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
      }

      .readonly-input {
        opacity: 0.7;
        --background: #f1f5f9;
      }
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 12px;
    }

    .save-btn {
      --border-radius: 10px;
      --padding-top: 12px;
      --padding-bottom: 12px;
      font-weight: 700;
    }
  `]
})
export class SettingsPage implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  public currentUser$ = this.authService.currentUser$;
  public currentCentre$ = this.authService.currentCentre$;
  saving = false;

  centreForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    code: [{ value: '', disabled: true }],
    email: [''],
    phone: [''],
    address: [''],
    city: [''],
    state: [''],
    country: ['India']
  });

  ngOnInit(): void {
    this.authService.getCentre().subscribe({
      next: (res) => {
        if (res.success && res.data?.centre) {
          this.patchCentreForm(res.data.centre);
        }
      },
      error: () => {
        const cached = this.authService.currentCentreValue;
        if (cached) {
          this.patchCentreForm(cached);
        }
      }
    });
  }

  patchCentreForm(centre: Centre): void {
    this.centreForm.patchValue({
      name: centre.name || '',
      code: centre.code || '',
      email: centre.email || '',
      phone: centre.phone || '',
      address: centre.address || '',
      city: centre.city || '',
      state: centre.state || '',
      country: centre.country || 'India'
    });
  }

  onSaveCentre(): void {
    if (this.centreForm.invalid) {
      this.toastService.warning('Please enter a valid centre name');
      return;
    }

    this.saving = true;
    const formData = this.centreForm.getRawValue();

    this.authService.updateCentre(formData).subscribe({
      next: (res) => {
        this.saving = false;
        if (res.success) {
          this.toastService.success('Centre information updated successfully!');
        }
      },
      error: (err) => {
        this.saving = false;
        this.toastService.error(err.error?.message || 'Failed to update centre info');
      }
    });
  }
}
