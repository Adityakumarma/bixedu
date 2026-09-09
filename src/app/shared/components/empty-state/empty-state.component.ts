import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon, IonButton } from '@ionic/angular';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, IonIcon, IonButton],
  template: `
    <div class="empty-state-card">
      <div class="icon-circle">
        <ion-icon [name]="icon"></ion-icon>
      </div>
      <h3 class="empty-title">{{ title }}</h3>
      <p class="empty-description" *ngIf="description">{{ description }}</p>
      <div class="action-btn" *ngIf="actionLabel">
        <ion-button fill="solid" color="primary" (click)="onAction.emit()">
          <ion-icon slot="start" [name]="actionIcon" *ngIf="actionIcon"></ion-icon>
          {{ actionLabel }}
        </ion-button>
      </div>
    </div>
  `,
  styles: [`
    .empty-state-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 48px 24px;
      background: var(--bixedu-surface, #ffffff);
      border: 1px dashed var(--bixedu-border, #d1d5db);
      border-radius: 16px;
      margin: 16px 0;
    }

    .icon-circle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: var(--bixedu-bg-alt, #f3f4f6);
      color: var(--bixedu-text-muted, #9ca3af);
      font-size: 32px;
      margin-bottom: 16px;
    }

    .empty-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--bixedu-text-main, #1f2937);
      margin: 0 0 6px 0;
    }

    .empty-description {
      font-size: 14px;
      color: var(--bixedu-text-muted, #6b7280);
      max-width: 400px;
      margin: 0 0 20px 0;
      line-height: 1.5;
    }

    .action-btn {
      margin-top: 8px;
    }
  `]
})
export class EmptyStateComponent {
  @Input() title: string = 'No records found';
  @Input() description?: string = 'There are no items to display at this time.';
  @Input() icon: string = 'folder-open-outline';
  @Input() actionLabel?: string;
  @Input() actionIcon?: string = 'add-outline';
  @Output() onAction = new EventEmitter<void>();
}
