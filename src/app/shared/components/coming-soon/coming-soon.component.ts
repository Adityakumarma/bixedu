import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonIcon, IonButton } from '@ionic/angular';

export interface ModuleFeature {
  title: string;
  description: string;
  icon?: string;
}

@Component({
  selector: 'app-coming-soon',
  standalone: true,
  imports: [CommonModule, RouterModule, IonIcon, IonButton],
  template: `
    <div class="coming-soon-card">
      <div class="header-badge">
        <div class="icon-circle">
          <ion-icon [name]="icon"></ion-icon>
        </div>
        <span class="status-pill">
          <span class="dot"></span> Coming Soon in Next Release
        </span>
      </div>

      <h2 class="module-title">{{ title }}</h2>
      <p class="module-description">{{ description }}</p>

      <div class="features-section" *ngIf="features && features.length > 0">
        <h4 class="features-heading">Planned Capabilities & Roadmap</h4>
        <div class="features-grid">
          <div class="feature-item" *ngFor="let feat of features">
            <div class="feat-icon">
              <ion-icon [name]="feat.icon || 'checkmark-circle-outline'"></ion-icon>
            </div>
            <div class="feat-text">
              <span class="feat-title">{{ feat.title }}</span>
              <span class="feat-desc">{{ feat.description }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="actions-wrapper">
        <ion-button fill="solid" color="primary" routerLink="/dashboard" class="action-btn">
          <ion-icon slot="start" name="grid-outline"></ion-icon>
          Return to Dashboard
        </ion-button>
      </div>
    </div>
  `,
  styles: [`
    .coming-soon-card {
      background: var(--bixedu-surface, #ffffff);
      border: 1px solid var(--bixedu-border, #e2e8f0);
      border-radius: 16px;
      padding: 40px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      margin: 16px 0;
    }

    .header-badge {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .icon-circle {
      width: 72px;
      height: 72px;
      border-radius: 20px;
      background: linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(124, 58, 237, 0.15) 100%);
      color: #4f46e5;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
    }

    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #f1f5f9;
      color: #475569;
      font-size: 12px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 20px;
      border: 1px solid #e2e8f0;

      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #f59e0b;
        box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
      }
    }

    .module-title {
      font-size: 24px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 8px 0;
      letter-spacing: -0.02em;
    }

    .module-description {
      font-size: 14px;
      color: #64748b;
      max-width: 520px;
      margin: 0 0 28px 0;
      line-height: 1.6;
    }

    .features-section {
      width: 100%;
      max-width: 640px;
      background: #f8fafc;
      border: 1px solid #f1f5f9;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 28px;
      text-align: left;

      .features-heading {
        margin: 0 0 16px 0;
        font-size: 13px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #475569;
      }

      .features-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 14px;

        @media (min-width: 640px) {
          grid-template-columns: 1fr 1fr;
        }
      }

      .feature-item {
        display: flex;
        align-items: flex-start;
        gap: 10px;

        .feat-icon {
          font-size: 18px;
          color: #4f46e5;
          margin-top: 1px;
        }

        .feat-text {
          display: flex;
          flex-direction: column;
          gap: 2px;

          .feat-title {
            font-size: 13px;
            font-weight: 700;
            color: #1e293b;
          }

          .feat-desc {
            font-size: 12px;
            color: #64748b;
            line-height: 1.4;
          }
        }
      }
    }

    .action-btn {
      --border-radius: 10px;
      font-weight: 700;
    }
  `]
})
export class ComingSoonComponent {
  @Input() title: string = 'Module Under Development';
  @Input() description: string = 'This module is currently being finalized and will be enabled for your coaching centre in an upcoming update.';
  @Input() icon: string = 'construct-outline';
  @Input() features: ModuleFeature[] = [];
}
