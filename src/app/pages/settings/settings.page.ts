import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, EmptyStateComponent],
  template: `
    <div class="settings-page">
      <app-page-header
        title="Settings"
        subtitle="Coaching centre profile, preferences, and system configuration"
        icon="settings-outline">
      </app-page-header>

      <app-empty-state
        title="System Settings Ready"
        description="Configure centre profile, notification preferences, and branding."
        icon="options-outline">
      </app-empty-state>
    </div>
  `
})
export class SettingsPage {}
