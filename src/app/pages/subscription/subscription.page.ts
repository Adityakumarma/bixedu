import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, EmptyStateComponent],
  template: `
    <div class="subscription-page">
      <app-page-header
        title="Subscription Management"
        subtitle="Manage your SaaS subscription plan, limits, and billing details"
        icon="card-outline">
      </app-page-header>

      <app-empty-state
        title="Active Subscription: Standard Plan"
        description="Your coaching centre subscription plan is active and up to date."
        icon="shield-checkmark-outline">
      </app-empty-state>
    </div>
  `
})
export class SubscriptionPage {}
