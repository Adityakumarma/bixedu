import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ResponsiveTableComponent } from '../../shared/components/responsive-table/responsive-table.component';
import { IonButton, IonIcon } from '@ionic/angular';

@Component({
  selector: 'app-exams',
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
    <div class="exams-page">
      <app-page-header
        title="Exams & Results"
        subtitle="Schedule tests, enter marks, and publish report cards"
        icon="school-outline">
        <div actions>
          <ion-button fill="solid" color="primary">
            <ion-icon slot="start" name="document-text-outline"></ion-icon>
            Schedule Test
          </ion-button>
        </div>
      </app-page-header>

      <app-search-bar placeholder="Search tests by title or batch..."></app-search-bar>

      <app-responsive-table>
        <app-empty-state
          title="No exam records found"
          description="Schedule a test or upload marks to view performance reports."
          icon="ribbon-outline"
          actionLabel="Schedule First Test">
        </app-empty-state>
      </app-responsive-table>
    </div>
  `
})
export class ExamsPage {}
