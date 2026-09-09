import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SearchBarComponent, FilterOption } from '../../shared/components/search-bar/search-bar.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ResponsiveTableComponent } from '../../shared/components/responsive-table/responsive-table.component';
import { IonButton, IonIcon } from '@ionic/angular';

@Component({
  selector: 'app-students',
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
    <div class="students-page">
      <app-page-header
        title="Student Management"
        subtitle="Manage student profiles, enrollments, and academic records"
        icon="people-outline">
        <div actions>
          <ion-button fill="solid" color="primary">
            <ion-icon slot="start" name="add-outline"></ion-icon>
            Add Student
          </ion-button>
        </div>
      </app-page-header>

      <app-search-bar
        placeholder="Search students by name, roll no, or phone..."
        filterPlaceholder="Batch"
        [filterOptions]="batchOptions">
      </app-search-bar>

      <app-responsive-table>
        <app-empty-state
          title="No students found"
          description="There are currently no students registered in this coaching centre."
          icon="people-circle-outline"
          actionLabel="Add First Student">
        </app-empty-state>
      </app-responsive-table>
    </div>
  `
})
export class StudentsPage {
  batchOptions: FilterOption[] = [
    { label: 'Class 10 Physics', value: 'c10_phy' },
    { label: 'Class 12 Maths', value: 'c12_mat' }
  ];
}
