import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ComingSoonComponent, ModuleFeature } from '../../shared/components/coming-soon/coming-soon.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    ComingSoonComponent
  ],
  template: `
    <div class="reports-page">
      <app-page-header
        title="Reports & Analytics"
        subtitle="Insights on student enrollment, attendance metrics, and financial collection"
        icon="bar-chart-outline">
      </app-page-header>

      <app-coming-soon
        title="Centre Insights & Operational Analytics"
        description="Comprehensive visual reporting dashboard covering enrollment trends, batch occupancy rates, fee collection metrics, and academic progress."
        icon="analytics-outline"
        [features]="features">
      </app-coming-soon>
    </div>
  `
})
export class ReportsPage {
  features: ModuleFeature[] = [
    {
      title: 'Enrollment & Retention Growth',
      description: 'Track monthly student admissions, dropouts, and batch counts.',
      icon: 'trending-up-outline'
    },
    {
      title: 'Fee Collection Reports',
      description: 'Export detailed financial spreadsheets with date range filters.',
      icon: 'pie-chart-outline'
    },
    {
      title: 'Attendance Comparison Charts',
      description: 'Analyze batch-wise attendance percentages over time.',
      icon: 'bar-chart-outline'
    },
    {
      title: 'Export Data (CSV / Excel / PDF)',
      description: 'One-click data exports formatted for accounting and compliance.',
      icon: 'download-outline'
    }
  ];
}
