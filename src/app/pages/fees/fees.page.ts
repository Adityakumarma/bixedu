import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ResponsiveTableComponent } from '../../shared/components/responsive-table/responsive-table.component';
import { IonButton, IonIcon } from '@ionic/angular';

@Component({
  selector: 'app-fees',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    SearchBarComponent,
    EmptyStateComponent,
    ResponsiveTableComponent,
    IonButton,
    IonIcon
  ],
  template: `
    <div class="fees-page">
      <app-page-header
        title="Fee Management"
        subtitle="Manage student fee structures, record payments, and issue receipts"
        icon="wallet-outline">
        <div actions>
          <ion-button fill="solid" color="primary">
            <ion-icon slot="start" name="cash-outline"></ion-icon>
            Record Payment
          </ion-button>
        </div>
      </app-page-header>

      <app-search-bar placeholder="Search by student name, receipt no, or status..."></app-search-bar>

      <app-responsive-table>
        <app-empty-state
          title="No payments found"
          description="There are no fee collection entries recorded yet."
          icon="card-outline"
          actionLabel="Record Fee Payment">
        </app-empty-state>
      </app-responsive-table>
    </div>
  `
})
export class FeesPage {}
