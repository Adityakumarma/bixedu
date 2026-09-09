import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ResponsiveTableComponent } from '../../shared/components/responsive-table/responsive-table.component';
import { IonButton, IonIcon } from '@ionic/angular';

@Component({
  selector: 'app-attendance',
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
    <div class="attendance-page">
      <app-page-header
        title="Attendance Management"
        subtitle="Track daily student presence, absentees, and send alerts"
        icon="calendar-outline">
        <div actions>
          <ion-button fill="solid" color="primary">
            <ion-icon slot="start" name="checkmark-done-outline"></ion-icon>
            Mark Attendance
          </ion-button>
        </div>
      </app-page-header>

      <app-responsive-table>
        <app-empty-state
          title="No attendance records found"
          description="Select a batch and date to view or record attendance."
          icon="calendar-clear-outline"
          actionLabel="Mark Today's Attendance">
        </app-empty-state>
      </app-responsive-table>
    </div>
  `
})
export class AttendancePage {}
