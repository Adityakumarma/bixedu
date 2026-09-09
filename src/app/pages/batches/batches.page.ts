import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ResponsiveTableComponent } from '../../shared/components/responsive-table/responsive-table.component';
import { IonButton, IonIcon } from '@ionic/angular';

@Component({
  selector: 'app-batches',
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
    <div class="batches-page">
      <app-page-header
        title="Batch Management"
        subtitle="Manage academic courses, class schedules, and subjects"
        icon="library-outline">
        <div actions>
          <ion-button fill="solid" color="primary">
            <ion-icon slot="start" name="add-circle-outline"></ion-icon>
            Create Batch
          </ion-button>
        </div>
      </app-page-header>

      <app-search-bar placeholder="Search batches by name or subject..."></app-search-bar>

      <app-responsive-table>
        <app-empty-state
          title="No batches found"
          description="Create your first batch to assign students and teachers."
          icon="library-outline"
          actionLabel="Create First Batch">
        </app-empty-state>
      </app-responsive-table>
    </div>
  `
})
export class BatchesPage {}
