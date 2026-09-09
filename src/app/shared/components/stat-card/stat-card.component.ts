import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, IonIcon],
  template: `
    <div class="stat-card">
      <div class="stat-header">
        <span class="stat-title">{{ title }}</span>
        <div class="stat-icon" [style.background]="iconBg" [style.color]="iconColor" *ngIf="icon">
          <ion-icon [name]="icon"></ion-icon>
        </div>
      </div>
      <div class="stat-value">{{ value }}</div>
      <div class="stat-footer" *ngIf="trendText">
        <span class="trend-badge" [class.up]="trend === 'up'" [class.down]="trend === 'down'">
          <ion-icon [name]="trend === 'up' ? 'trending-up-outline' : 'trending-down-outline'"></ion-icon>
          {{ trendText }}
        </span>
        <span class="trend-subtitle" *ngIf="subtitle">{{ subtitle }}</span>
      </div>
    </div>
  `,
  styles: [`
    .stat-card {
      background: var(--bixedu-surface, #ffffff);
      border: 1px solid var(--bixedu-border, #e5e7eb);
      border-radius: 14px;
      padding: 20px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: transform 0.2s ease, box-shadow 0.2s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }
    }

    .stat-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .stat-title {
      font-size: 13px;
      font-weight: 600;
      color: var(--bixedu-text-muted, #6b7280);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .stat-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }

    .stat-value {
      font-size: 28px;
      font-weight: 800;
      color: var(--bixedu-text-main, #111827);
      letter-spacing: -0.03em;
      margin-bottom: 8px;
    }

    .stat-footer {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
    }

    .trend-badge {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 4px;

      &.up {
        color: #059669;
        background: rgba(16, 185, 129, 0.1);
      }

      &.down {
        color: #dc2626;
        background: rgba(239, 68, 68, 0.1);
      }
    }

    .trend-subtitle {
      color: var(--bixedu-text-muted, #9ca3af);
    }
  `]
})
export class StatCardComponent {
  @Input() title: string = '';
  @Input() value: string | number = '0';
  @Input() icon?: string = 'analytics-outline';
  @Input() iconBg: string = 'rgba(79, 70, 229, 0.1)';
  @Input() iconColor: string = '#4f46e5';
  @Input() trend?: 'up' | 'down';
  @Input() trendText?: string;
  @Input() subtitle?: string;
}
