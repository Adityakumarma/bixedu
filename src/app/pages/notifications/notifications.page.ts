import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ComingSoonComponent, ModuleFeature } from '../../shared/components/coming-soon/coming-soon.component';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    ComingSoonComponent
  ],
  template: `
    <div class="notifications-page">
      <app-page-header
        title="Broadcast & Notifications"
        subtitle="Send announcements, exam updates, and fee reminders to parents and students"
        icon="notifications-outline">
      </app-page-header>

      <app-coming-soon
        title="Broadcast & Communication Hub"
        description="Unified messaging platform for broadcast announcements, WhatsApp alerts, SMS reminders, and system notifications for your coaching centre."
        icon="megaphone-outline"
        [features]="features">
      </app-coming-soon>
    </div>
  `
})
export class NotificationsPage {
  features: ModuleFeature[] = [
    {
      title: 'Batch Broadcast Announcements',
      description: 'Send circulars or holiday notices to all students in a batch.',
      icon: 'send-outline'
    },
    {
      title: 'WhatsApp Business Integration',
      description: 'Instant notification delivery via official WhatsApp templates.',
      icon: 'logo-whatsapp'
    },
    {
      title: 'Delivery Status Tracking',
      description: 'Monitor real-time delivery and read receipts for sent alerts.',
      icon: 'checkmark-done-outline'
    },
    {
      title: 'Scheduled Reminders',
      description: 'Queue automated alerts for upcoming exams and fee deadlines.',
      icon: 'time-outline'
    }
  ];
}
