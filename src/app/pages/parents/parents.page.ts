import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ResponsiveTableComponent } from '../../shared/components/responsive-table/responsive-table.component';
import { IonButton, IonIcon } from '@ionic/angular';

@Component({
  selector: 'app-parents',
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
    <div class="parents-page">
      <app-page-header
        title="Parent Management"
        subtitle="Manage parent contacts and communication links"
        icon="heart-outline">
        <div actions>
          <ion-button fill="solid" color="primary">
            <ion-icon slot="start" name="person-add-outline"></ion-icon>
            Add Parent
          </ion-button>
        </div>
      </app-page-header>

      <app-search-bar placeholder="Search parents by name or phone..."></app-search-bar>

      <app-responsive-table>
        <app-empty-state
          title="No parents found"
          description="No parent records have been created yet."
          icon="heart-dislike-outline"
          actionLabel="Add Parent">
        </app-empty-state>
      </app-responsive-table>
    </div>
  `
})
export class ParentsPage {}
