import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonSpinner } from '@ionic/angular';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule, IonSpinner],
  template: `
    <div class="spinner-overlay" [class.inline]="inline">
      <ion-spinner name="crescent" color="primary"></ion-spinner>
      <span class="spinner-message" *ngIf="message">{{ message }}</span>
    </div>
  `,
  styles: [`
    .spinner-overlay {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 32px;
      width: 100%;

      &.inline {
        padding: 16px;
      }
    }

    .spinner-message {
      font-size: 14px;
      color: var(--bixedu-text-muted, #6b7280);
      font-weight: 500;
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() message: string = 'Loading data...';
  @Input() inline: boolean = false;
}
