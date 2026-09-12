import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ComingSoonComponent, ModuleFeature } from '../../shared/components/coming-soon/coming-soon.component';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    ComingSoonComponent
  ],
  template: `
    <div class="subscription-page">
      <app-page-header
        title="Subscription & Billing"
        subtitle="Manage your BixEdu SaaS plan, student capacity limits, and billing invoices"
        icon="card-outline">
      </app-page-header>

      <app-coming-soon
        title="BixEdu SaaS Plan & Billing Hub"
        description="View your active institute subscription plan, upgrade student quotas, manage auto-renewal, and download monthly software invoices."
        icon="diamond-outline"
        [features]="features">
      </app-coming-soon>
    </div>
  `
})
export class SubscriptionPage {
  features: ModuleFeature[] = [
    {
      title: 'Current Tier & Student Capacity',
      description: 'Monitor your active subscription plan and student limits.',
      icon: 'cube-outline'
    },
    {
      title: 'Plan Upgrades & Add-ons',
      description: 'Easily scale student capacity or add SMS broadcast packs.',
      icon: 'arrow-up-circle-outline'
    },
    {
      title: 'Billing History & Tax Invoices',
      description: 'Download GST tax invoices for monthly or annual SaaS plans.',
      icon: 'document-text-outline'
    },
    {
      title: 'Payment Method Management',
      description: 'Update credit card, UPI, or netbanking payment methods securely.',
      icon: 'card-outline'
    }
  ];
}
