import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ResponsiveTableComponent } from '../../shared/components/responsive-table/responsive-table.component';
import { IonButton, IonIcon } from '@ionic/angular';

@Component({
  selector: 'app-staff',
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
    <div class="staff-page">
      <app-page-header
        title="Staff & Teacher Management"
        subtitle="Manage teachers, subject faculties, and admin staff"
        icon="person-add-outline">
        <div actions>
          <ion-button fill="solid" color="primary">
            <ion-icon slot="start" name="person-add-outline"></ion-icon>
            Add Staff Member
          </ion-button>
        </div>
      </app-page-header>

      <app-search-bar placeholder="Search staff by name, role, or phone..."></app-search-bar>

      <app-responsive-table>
        <app-empty-state
          title="No staff members found"
          description="Add teachers and administrators to assign roles and batches."
          icon="people-circle-outline"
          actionLabel="Add Staff Member">
        </app-empty-state>
      </app-responsive-table>
    </div>
  `
})
export class StaffPage {}
