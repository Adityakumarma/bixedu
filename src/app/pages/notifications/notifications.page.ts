import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, EmptyStateComponent],
  template: `
    <div class="notifications-page">
      <app-page-header
        title="Notifications & Smart Alerts"
        subtitle="Manage automated parent notifications and announcements"
        icon="notifications-outline">
      </app-page-header>

      <app-empty-state
        title="No notification alerts"
        description="System broadcast logs and parent alerts will appear here."
        icon="notifications-off-outline">
      </app-empty-state>
    </div>
  `
})
export class NotificationsPage {}
