import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="status-badge" [ngClass]="badgeType">
      <span class="badge-dot" *ngIf="showDot"></span>
      {{ text || badgeText }}
    </span>
  `,
  styles: [`
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      text-transform: capitalize;

      &.success, &.active, &.paid, &.present {
        background: rgba(16, 185, 129, 0.12);
        color: #059669;
      }

      &.danger, &.inactive, &.unpaid, &.absent {
        background: rgba(239, 68, 68, 0.12);
        color: #dc2626;
      }

      &.warning, &.pending, &.partial, &.late {
        background: rgba(245, 158, 11, 0.12);
        color: #d97706;
      }

      &.info, &.primary {
        background: rgba(79, 70, 229, 0.12);
        color: #4f46e5;
      }
    }

    .badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
    }
  `]
})
export class StatusBadgeComponent {
  @Input() type: string = 'info';
  @Input() status?: string;
  @Input() text?: string;
  @Input() showDot: boolean = true;

  get badgeType(): string {
    const val = (this.status || this.type || 'info').toLowerCase();
    return val;
  }

  get badgeText(): string {
    return this.status || this.type;
  }
}
