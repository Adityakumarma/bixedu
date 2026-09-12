import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ComingSoonComponent, ModuleFeature } from '../../shared/components/coming-soon/coming-soon.component';

@Component({
  selector: 'app-fees',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    ComingSoonComponent
  ],
  template: `
    <div class="fees-page">
      <app-page-header
        title="Fee Management"
        subtitle="Manage course fee structures, record installment payments, and print digital receipts"
        icon="wallet-outline">
      </app-page-header>

      <app-coming-soon
        title="Fee Collection & Digital Receipts"
        description="Streamline fee collection with custom installment plans, automatic due date reminders, and downloadable PDF payment receipts."
        icon="card-outline"
        [features]="features">
      </app-coming-soon>
    </div>
  `
})
export class FeesPage {
  features: ModuleFeature[] = [
    {
      title: 'Custom Fee Structures',
      description: 'Define course-wise fees, discounts, and installment schedules.',
      icon: 'cash-outline'
    },
    {
      title: 'Digital PDF Receipts',
      description: 'Generate branded fee receipts ready for print or instant sharing.',
      icon: 'receipt-outline'
    },
    {
      title: 'Automated Payment Reminders',
      description: 'Send due alerts to parents via SMS and email before due dates.',
      icon: 'alarm-outline'
    },
    {
      title: 'Revenue & Pending Analytics',
      description: 'Track collected fees, pending balances, and monthly revenue.',
      icon: 'trending-up-outline'
    }
  ];
}
