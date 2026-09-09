import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, IonIcon],
  template: `
    <div class="page-header-container">
      <div class="title-section">
        <div class="icon-badge" *ngIf="icon">
          <ion-icon [name]="icon"></ion-icon>
        </div>
        <div>
          <h1 class="page-title">{{ title }}</h1>
          <p class="page-subtitle" *ngIf="subtitle">{{ subtitle }}</p>
        </div>
      </div>
      <div class="actions-section">
        <ng-content select="[actions]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .page-header-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px 20px;
      background: var(--bixedu-surface, #ffffff);
      border-bottom: 1px solid var(--bixedu-border, #e5e7eb);
      margin-bottom: 20px;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

      @media (min-width: 640px) {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
    }

    .title-section {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .icon-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background: rgba(79, 70, 229, 0.1);
      color: var(--bixedu-primary, #4f46e5);
      font-size: 24px;
    }

    .page-title {
      margin: 0;
      font-size: 22px;
      font-weight: 700;
      color: var(--bixedu-text-main, #111827);
      letter-spacing: -0.02em;
    }

    .page-subtitle {
      margin: 2px 0 0 0;
      font-size: 13px;
      color: var(--bixedu-text-muted, #6b7280);
    }

    .actions-section {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }
  `]
})
export class PageHeaderComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() icon?: string;
}
