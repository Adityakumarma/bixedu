import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonIcon } from '@ionic/angular';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonIcon,
    PageHeaderComponent,
    StatCardComponent
  ],
  template: `
    <div class="dashboard-page">
      <app-page-header
        [title]="'Welcome, ' + ((currentUser$ | async)?.name || 'Centre Admin')"
        [subtitle]="((currentCentre$ | async)?.name || 'Coaching Centre') + ' — Operational metrics & management shortcuts'"
        icon="grid-outline">
      </app-page-header>

      <!-- Stat Cards Grid -->
      <div class="stats-grid">
        <app-stat-card
          title="Total Students"
          value="0"
          icon="people-outline"
          iconBg="rgba(79, 70, 229, 0.1)"
          iconColor="#4f46e5"
          subtitle="Enrolled active students">
        </app-stat-card>

        <app-stat-card
          title="Active Batches"
          value="0"
          icon="library-outline"
          iconBg="rgba(16, 185, 129, 0.1)"
          iconColor="#10b981"
          subtitle="Ongoing coaching batches">
        </app-stat-card>

        <app-stat-card
          title="Pending Fees"
          value="₹0"
          icon="wallet-outline"
          iconBg="rgba(245, 158, 11, 0.1)"
          iconColor="#f59e0b"
          subtitle="Outstanding student payments">
        </app-stat-card>

        <app-stat-card
          title="Teachers / Staff"
          value="0"
          icon="person-add-outline"
          iconBg="rgba(239, 68, 68, 0.1)"
          iconColor="#ef4444"
          subtitle="Faculty members">
        </app-stat-card>
      </div>

      <!-- Quick Action Cards Section -->
      <div class="quick-actions-section">
        <h3 class="section-title">Quick Actions</h3>
        <div class="quick-actions-grid">
          <a routerLink="/students" class="action-card">
            <div class="card-icon students">
              <ion-icon name="people-outline"></ion-icon>
            </div>
            <div class="card-text">
              <h4>Manage Students</h4>
              <p>Enroll, view profiles, assign batches</p>
            </div>
          </a>

          <a routerLink="/batches" class="action-card">
            <div class="card-icon batches">
              <ion-icon name="library-outline"></ion-icon>
            </div>
            <div class="card-text">
              <h4>Manage Batches</h4>
              <p>Create courses, schedules, sub-batches</p>
            </div>
          </a>

          <a routerLink="/attendance" class="action-card">
            <div class="card-icon attendance">
              <ion-icon name="calendar-outline"></ion-icon>
            </div>
            <div class="card-text">
              <h4>Attendance</h4>
              <p>Mark daily presence & view logs</p>
            </div>
          </a>

          <a routerLink="/fees" class="action-card">
            <div class="card-icon fees">
              <ion-icon name="wallet-outline"></ion-icon>
            </div>
            <div class="card-text">
              <h4>Fee Receipts</h4>
              <p>Record payments & send reminders</p>
            </div>
          </a>

          <a routerLink="/settings" class="action-card">
            <div class="card-icon settings">
              <ion-icon name="settings-outline"></ion-icon>
            </div>
            <div class="card-text">
              <h4>Centre Settings</h4>
              <p>Update institute info & contact details</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 16px;

      @media (min-width: 640px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (min-width: 1024px) {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    .quick-actions-section {
      background: var(--bixedu-surface, #ffffff);
      border-radius: 16px;
      padding: 24px;
      border: 1px solid var(--bixedu-border, #e5e7eb);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

      .section-title {
        margin: 0 0 16px 0;
        font-size: 18px;
        font-weight: 700;
        color: var(--bixedu-text-main, #111827);
      }
    }

    .quick-actions-grid {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 16px;

      @media (min-width: 640px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (min-width: 1024px) {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .action-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      border-radius: 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      text-decoration: none;
      transition: all 0.2s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        border-color: #cbd5e1;
      }

      .card-icon {
        width: 44px;
        height: 44px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        flex-shrink: 0;

        &.students { background: rgba(79, 70, 229, 0.1); color: #4f46e5; }
        &.batches { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        &.attendance { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        &.fees { background: rgba(168, 85, 247, 0.1); color: #a855f7; }
        &.settings { background: rgba(100, 116, 139, 0.1); color: #64748b; }
      }

      .card-text {
        h4 {
          margin: 0 0 4px 0;
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
        }

        p {
          margin: 0;
          font-size: 12px;
          color: #64748b;
        }
      }
    }
  `]
})
export class DashboardPage {
  private authService = inject(AuthService);

  public currentUser$ = this.authService.currentUser$;
  public currentCentre$ = this.authService.currentCentre$;
}

