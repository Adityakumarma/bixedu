import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, EmptyStateComponent],
  template: `
    <div class="reports-page">
      <app-page-header
        title="Reports & Analytics"
        subtitle="Comprehensive financial, attendance, and student analytics"
        icon="bar-chart-outline">
      </app-page-header>

      <app-empty-state
        title="No reports generated"
        description="Select a reporting module to generate PDF statements and insights."
        icon="pie-chart-outline">
      </app-empty-state>
    </div>
  `
})
export class ReportsPage {}
