import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-responsive-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="responsive-table-card">
      <div class="table-scroll-container">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .responsive-table-card {
      background: var(--bixedu-surface, #ffffff);
      border: 1px solid var(--bixedu-border, #e5e7eb);
      border-radius: 14px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      overflow: hidden;
      margin-bottom: 20px;
    }

    .table-scroll-container {
      width: 100%;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }
  `]
})
export class ResponsiveTableComponent {}
