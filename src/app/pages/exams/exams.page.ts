import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ComingSoonComponent, ModuleFeature } from '../../shared/components/coming-soon/coming-soon.component';

@Component({
  selector: 'app-exams',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    ComingSoonComponent
  ],
  template: `
    <div class="exams-page">
      <app-page-header
        title="Exams & Performance"
        subtitle="Schedule tests, enter subject marks, rank students, and share report cards"
        icon="school-outline">
      </app-page-header>

      <app-coming-soon
        title="Exams, Marksheets & Ranking System"
        description="Complete evaluation suite for mock tests, unit exams, subject marks entry, batch ranking, and student report card generation."
        icon="school-outline"
        [features]="features">
      </app-coming-soon>
    </div>
  `
})
export class ExamsPage {
  features: ModuleFeature[] = [
    {
      title: 'Exam Scheduling & Syllabus',
      description: 'Create test schedules, assign max marks, and outline topics covered.',
      icon: 'calendar-number-outline'
    },
    {
      title: 'Bulk Marks Entry',
      description: 'Fast grid interface for teachers to input scores per batch.',
      icon: 'create-outline'
    },
    {
      title: 'Batch Ranks & Top Performers',
      description: 'Automatic percentile, batch rank, and subject score calculations.',
      icon: 'trophy-outline'
    },
    {
      title: 'Downloadable Report Cards',
      description: 'Generate clean PDF student progress reports with parent sign-off.',
      icon: 'document-text-outline'
    }
  ];
}
