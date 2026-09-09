import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ResponsiveTableComponent } from '../../shared/components/responsive-table/responsive-table.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    StatCardComponent,
    EmptyStateComponent,
    ResponsiveTableComponent
  ],
  template: `
    <div class="dashboard-page">
      <app-page-header
        title="Dashboard Overview"
        subtitle="Coaching centre analytics and operational metrics"
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
          title="Fees Collected"
          value="₹0"
          icon="wallet-outline"
          iconBg="rgba(245, 158, 11, 0.1)"
          iconColor="#f59e0b"
          subtitle="Total fees recorded">
        </app-stat-card>

        <app-stat-card
          title="Today's Attendance"
          value="0%"
          icon="calendar-outline"
          iconBg="rgba(239, 68, 68, 0.1)"
          iconColor="#ef4444"
          subtitle="Student presence rate">
        </app-stat-card>
      </div>

      <!-- Quick Actions / Empty Dashboard State -->
      <div class="dashboard-content">
        <app-empty-state
          title="Dashboard Live Overview Ready"
          description="Your coaching centre modules are initialized. Select a module from the menu to manage students, batches, fees, and attendance."
          icon="stats-chart-outline">
        </app-empty-state>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page {
      display: flex;
      flex-direction: column;
      gap: 20px;
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
  `]
})
export class DashboardPage {}
