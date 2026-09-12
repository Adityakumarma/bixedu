import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  IonButton,
  IonIcon,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonBadge,
  IonProgressBar,
  IonSpinner
} from '@ionic/angular';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SearchBarComponent, FilterOption } from '../../shared/components/search-bar/search-bar.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ResponsiveTableComponent } from '../../shared/components/responsive-table/responsive-table.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { BatchService } from '../../core/services/batch.service';
import { StudentService } from '../../core/services/student.service';
import { StaffService } from '../../core/services/staff.service';
import { ToastService } from '../../core/services/toast.service';
import { Batch } from '../../core/models/batch.model';
import { Student } from '../../core/models/student.model';
import { Staff } from '../../core/models/staff.model';

@Component({
  selector: 'app-batches',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PageHeaderComponent,
    SearchBarComponent,
    EmptyStateComponent,
    ResponsiveTableComponent,
    StatusBadgeComponent,
    LoadingSpinnerComponent,
    IonButton,
    IonIcon,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonBadge,
    IonProgressBar,
    IonSpinner
  ],
  template: `
    <div class="batches-page">
      <app-page-header
        title="Batch Management"
        subtitle="Manage academic courses, class timings, rooms, and student batch enrollments"
        icon="library-outline">
        <div actions>
          <ion-button fill="solid" color="primary" (click)="openFormModal()">
            <ion-icon slot="start" name="add-circle-outline"></ion-icon>
            Create Batch
          </ion-button>
        </div>
      </app-page-header>

      <!-- Search & Filter Controls -->
      <app-search-bar
        placeholder="Search batches by name, code, course, or room..."
        filterPlaceholder="Status"
        [filterOptions]="statusOptions"
        (search)="onSearch($event)"
        (filter)="onFilterStatus($event)">
      </app-search-bar>

      <!-- Loading State -->
      <app-loading-spinner *ngIf="loading" message="Loading coaching batches..."></app-loading-spinner>

      <!-- Data List / Table -->
      <div *ngIf="!loading">
        <div *ngIf="batches.length === 0">
          <app-empty-state
            title="No batches found"
            [description]="searchQuery || selectedStatus ? 'No batches match your filter criteria.' : 'Create your first batch to start organizing classes and enrolling students.'"
            icon="library-outline"
            actionLabel="Create First Batch"
            (onAction)="openFormModal()">
          </app-empty-state>
        </div>

        <div *ngIf="batches.length > 0">
          <!-- Desktop Table View -->
          <app-responsive-table class="desktop-only">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Batch Details</th>
                  <th>Course / Subject</th>
                  <th>Schedule & Timing</th>
                  <th>Room</th>
                  <th>Enrollment / Capacity</th>
                  <th>Status</th>
                  <th class="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let batch of batches">
                  <td class="font-semibold">
                    <div class="batch-cell">
                      <div class="batch-icon"><ion-icon name="easel-outline"></ion-icon></div>
                      <div>
                        <div class="batch-name">{{ batch.name }}</div>
                        <div class="batch-code" *ngIf="batch.code">{{ batch.code }}</div>
                      </div>
                    </div>
                  </td>
                  <td>{{ batch.course || 'General' }}</td>
                  <td>
                    <div class="schedule-info">
                      <div class="timing" *ngIf="batch.startTime || batch.endTime">
                        <ion-icon name="time-outline"></ion-icon> {{ batch.startTime }} - {{ batch.endTime }}
                      </div>
                      <div class="days-list" *ngIf="batch.days && batch.days.length > 0">
                        <span class="day-chip" *ngFor="let day of batch.days">{{ day }}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="room-pill">{{ batch.room || 'Unassigned' }}</span>
                  </td>
                  <td>
                    <div class="capacity-box">
                      <div class="capacity-labels">
                        <span class="count">{{ batch.studentCount || 0 }} enrolled</span>
                        <span class="cap-limit" *ngIf="batch.capacity > 0">Limit: {{ batch.capacity }}</span>
                        <span class="cap-limit" *ngIf="!batch.capacity || batch.capacity === 0">Unlimited</span>
                      </div>
                      <ion-progress-bar
                        *ngIf="batch.capacity > 0"
                        [value]="getCapacityRatio(batch)"
                        [color]="getCapacityRatio(batch) >= 1 ? 'danger' : 'success'">
                      </ion-progress-bar>
                    </div>
                  </td>
                  <td>
                    <app-status-badge [type]="getStatusType(batch.status)" [text]="batch.status"></app-status-badge>
                  </td>
                  <td class="text-right actions-cell">
                    <ion-button fill="clear" size="small" color="primary" (click)="viewDetail(batch)" title="Manage Students & Details">
                      <ion-icon name="people-outline" slot="icon-only"></ion-icon>
                    </ion-button>
                    <ion-button fill="clear" size="small" color="secondary" (click)="openFormModal(batch)" title="Edit">
                      <ion-icon name="create-outline" slot="icon-only"></ion-icon>
                    </ion-button>
                    <ion-button fill="clear" size="small" color="danger" (click)="confirmDelete(batch)" title="Delete">
                      <ion-icon name="trash-outline" slot="icon-only"></ion-icon>
                    </ion-button>
                  </td>
                </tr>
              </tbody>
            </table>
          </app-responsive-table>

          <!-- Mobile Card List View -->
          <div class="mobile-only cards-list">
            <div class="batch-card" *ngFor="let batch of batches">
              <div class="card-header">
                <div>
                  <h4 class="batch-name">{{ batch.name }}</h4>
                  <span class="batch-code" *ngIf="batch.code">{{ batch.code }}</span>
                </div>
                <app-status-badge [type]="getStatusType(batch.status)" [text]="batch.status"></app-status-badge>
              </div>

              <div class="card-body">
                <div class="info-row">
                  <ion-icon name="book-outline"></ion-icon>
                  <span>Course: <strong>{{ batch.course || 'General' }}</strong></span>
                </div>
                <div class="info-row" *ngIf="batch.startTime || batch.endTime">
                  <ion-icon name="time-outline"></ion-icon>
                  <span>{{ batch.startTime }} - {{ batch.endTime }}</span>
                </div>
                <div class="info-row">
                  <ion-icon name="business-outline"></ion-icon>
                  <span>Room: {{ batch.room || 'N/A' }}</span>
                </div>
                <div class="info-row">
                  <ion-icon name="people-outline"></ion-icon>
                  <span>Enrollment: <strong>{{ batch.studentCount || 0 }} / {{ batch.capacity > 0 ? batch.capacity : '∞' }}</strong></span>
                </div>
              </div>

              <div class="card-actions">
                <ion-button fill="outline" size="small" color="primary" (click)="viewDetail(batch)">
                  <ion-icon name="people-outline" slot="start"></ion-icon> Students
                </ion-button>
                <ion-button fill="outline" size="small" color="secondary" (click)="openFormModal(batch)">
                  <ion-icon name="create-outline" slot="start"></ion-icon> Edit
                </ion-button>
                <ion-button fill="outline" size="small" color="danger" (click)="confirmDelete(batch)">
                  <ion-icon name="trash-outline" slot="icon-only"></ion-icon>
                </ion-button>
              </div>
            </div>
          </div>

          <!-- Pagination Bar -->
          <div class="pagination-bar" *ngIf="pagination.totalPages > 1">
            <div class="pagination-info">
              Page {{ pagination.page }} of {{ pagination.totalPages }} (Total {{ pagination.total }} batches)
            </div>
            <div class="pagination-buttons">
              <ion-button size="small" fill="outline" [disabled]="pagination.page <= 1" (click)="changePage(pagination.page - 1)">
                <ion-icon name="chevron-back-outline" slot="icon-only"></ion-icon>
              </ion-button>
              <span class="page-num">{{ pagination.page }}</span>
              <ion-button size="small" fill="outline" [disabled]="pagination.page >= pagination.totalPages" (click)="changePage(pagination.page + 1)">
                <ion-icon name="chevron-forward-outline" slot="icon-only"></ion-icon>
              </ion-button>
            </div>
          </div>
        </div>
      </div>

      <!-- Add/Edit Batch Form Modal -->
      <ion-modal [isOpen]="isFormModalOpen" (didDismiss)="closeFormModal()">
        <ng-template>
          <ion-header>
            <ion-toolbar color="primary">
              <ion-title>{{ editingBatch ? 'Edit Batch Details' : 'Create New Batch' }}</ion-title>
              <ion-buttons slot="end">
                <ion-button (click)="closeFormModal()">
                  <ion-icon name="close-outline" slot="icon-only"></ion-icon>
                </ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>

          <ion-content class="ion-padding modal-content">
            <form [formGroup]="batchForm" (ngSubmit)="saveBatch()">
              <div class="form-section">
                <h4 class="form-section-title">General Information</h4>
                <div class="form-grid">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">Batch Name *</ion-label>
                    <ion-input formControlName="name" placeholder="e.g. Class 10 Physics Alpha"></ion-input>
                  </ion-item>

                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">Batch Code</ion-label>
                    <ion-input formControlName="code" placeholder="e.g. PHY10-A"></ion-input>
                  </ion-item>

                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">Course / Subject</ion-label>
                    <ion-input formControlName="course" placeholder="e.g. Physics / Mathematics"></ion-input>
                  </ion-item>

                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">Room / Classroom</ion-label>
                    <ion-input formControlName="room" placeholder="e.g. Room 204"></ion-input>
                  </ion-item>

                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">Maximum Capacity (0 for Unlimited)</ion-label>
                    <ion-input formControlName="capacity" type="number" placeholder="0"></ion-input>
                  </ion-item>

                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">Batch Status</ion-label>
                    <ion-select formControlName="status" interface="popover">
                      <ion-select-option value="ACTIVE">Active</ion-select-option>
                      <ion-select-option value="INACTIVE">Inactive</ion-select-option>
                      <ion-select-option value="COMPLETED">Completed</ion-select-option>
                    </ion-select>
                  </ion-item>
                </div>
              </div>

              <div class="form-section">
                <h4 class="form-section-title">Timing & Schedule</h4>
                <div class="form-grid">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">Start Time</ion-label>
                    <ion-input formControlName="startTime" type="time"></ion-input>
                  </ion-item>

                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">End Time</ion-label>
                    <ion-input formControlName="endTime" type="time"></ion-input>
                  </ion-item>

                  <ion-item fill="outline" class="form-item full-width">
                    <ion-label position="stacked">Weekly Class Days</ion-label>
                    <ion-select formControlName="days" [multiple]="true" interface="popover" placeholder="Select days">
                      <ion-select-option value="Mon">Monday</ion-select-option>
                      <ion-select-option value="Tue">Tuesday</ion-select-option>
                      <ion-select-option value="Wed">Wednesday</ion-select-option>
                      <ion-select-option value="Thu">Thursday</ion-select-option>
                      <ion-select-option value="Fri">Friday</ion-select-option>
                      <ion-select-option value="Sat">Saturday</ion-select-option>
                      <ion-select-option value="Sun">Sunday</ion-select-option>
                    </ion-select>
                  </ion-item>

                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">Start Date</ion-label>
                    <ion-input formControlName="startDate" type="date"></ion-input>
                  </ion-item>

                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">End Date</ion-label>
                    <ion-input formControlName="endDate" type="date"></ion-input>
                  </ion-item>

                  <ion-item fill="outline" class="form-item full-width">
                    <ion-label position="stacked">Description</ion-label>
                    <ion-textarea formControlName="description" rows="3" placeholder="Batch syllabus or target exams..."></ion-textarea>
                  </ion-item>
                </div>
              </div>

              <div class="form-actions">
                <ion-button fill="outline" color="medium" (click)="closeFormModal()">Cancel</ion-button>
                <ion-button type="submit" color="primary" [disabled]="batchForm.invalid || submitting">
                  <ion-spinner *ngIf="submitting" name="crescent" slot="start"></ion-spinner>
                  {{ editingBatch ? 'Update Batch' : 'Create Batch' }}
                </ion-button>
              </div>
            </form>
          </ion-content>
        </ng-template>
      </ion-modal>

      <!-- Batch Detail & Student Management Modal -->
      <ion-modal [isOpen]="isDetailModalOpen" (didDismiss)="closeDetailModal()">
        <ng-template>
          <ion-header>
            <ion-toolbar color="primary">
              <ion-title>Batch Management: {{ selectedBatch?.name }}</ion-title>
              <ion-buttons slot="end">
                <ion-button (click)="closeDetailModal()">
                  <ion-icon name="close-outline" slot="icon-only"></ion-icon>
                </ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>

          <ion-content class="ion-padding modal-content" *ngIf="selectedBatch">
            <div class="batch-detail-header">
              <div>
                <h2>{{ selectedBatch.name }}</h2>
                <div class="detail-tags">
                  <ion-badge color="primary">{{ selectedBatch.course || 'General Course' }}</ion-badge>
                  <ion-badge color="light">Room: {{ selectedBatch.room || 'N/A' }}</ion-badge>
                  <app-status-badge [type]="getStatusType(selectedBatch.status)" [text]="selectedBatch.status"></app-status-badge>
                </div>
              </div>
              <div class="capacity-card">
                <div class="cap-title">Enrollment</div>
                <div class="cap-number">{{ selectedBatch.studentCount || 0 }} / {{ selectedBatch.capacity > 0 ? selectedBatch.capacity : '∞' }}</div>
                <div class="cap-status" *ngIf="selectedBatch.capacity > 0 && (selectedBatch.studentCount || 0) >= selectedBatch.capacity">
                  <span class="full-alert"><ion-icon name="alert-circle-outline"></ion-icon> BATCH FULL</span>
                </div>
              </div>
            </div>

            <!-- Add Student to Batch Control -->
            <div class="add-student-box">
              <h4 class="box-title">Assign Student to Batch</h4>
              <div class="assign-form">
                <ion-item fill="outline" class="select-item">
                  <ion-label position="stacked">Select Student from Centre</ion-label>
                  <ion-select [(ngModel)]="studentToAssign" interface="popover" placeholder="Choose student to enroll">
                    <ion-select-option *ngFor="let s of unassignedStudents" [value]="s._id">
                      {{ s.firstName }} {{ s.lastName || '' }} ({{ s.admissionNumber }})
                    </ion-select-option>
                  </ion-select>
                </ion-item>
                <ion-button
                  color="success"
                  [disabled]="!studentToAssign || assigning"
                  (click)="assignStudent()">
                  <ion-spinner *ngIf="assigning" name="crescent" slot="start"></ion-spinner>
                  <ion-icon name="person-add-outline" slot="start" *ngIf="!assigning"></ion-icon>
                  Assign to Batch
                </ion-button>
              </div>
            </div>

            <!-- Assigned Teachers Section -->
            <div class="assign-student-box">
              <h4 class="section-title">Assigned Faculty / Teachers</h4>
              <div class="assign-form-row">
                <ion-item fill="outline" class="select-item" style="flex: 1;">
                  <ion-label position="stacked">Select Faculty Member</ion-label>
                  <ion-select [(ngModel)]="selectedTeacherId" interface="popover" placeholder="Choose teacher">
                    <ion-select-option *ngFor="let staff of availableStaff" [value]="getStaffUserId(staff)">
                      {{ staff.name }} ({{ staff.designation || 'Faculty' }})
                    </ion-select-option>
                  </ion-select>
                </ion-item>
                <ion-button
                  color="success"
                  [disabled]="!selectedTeacherId || assigningTeacher"
                  (click)="assignTeacher()">
                  <ion-spinner *ngIf="assigningTeacher" name="crescent" slot="start"></ion-spinner>
                  <ion-icon name="person-add-outline" slot="start" *ngIf="!assigningTeacher"></ion-icon>
                  Assign Teacher
                </ion-button>
              </div>

              <div class="teachers-list-sub" *ngIf="selectedBatch.teacherIds && selectedBatch.teacherIds.length > 0" style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px;">
                <div class="teacher-pill-item" *ngFor="let t of selectedBatch.teacherIds" style="display: flex; align-items: center; gap: 6px; background: #e0e7ff; color: #4338ca; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 700;">
                  <ion-icon name="person-outline"></ion-icon>
                  <span>{{ getTeacherName(t) }}</span>
                  <ion-icon name="close-circle" style="cursor: pointer; font-size: 16px; color: #ef4444;" (click)="removeTeacher(getTeacherId(t))"></ion-icon>
                </div>
              </div>
            </div>

            <!-- Assigned Students Table -->
            <div class="students-section">
              <h4 class="section-title">Enrolled Students ({{ selectedBatch.students?.length || 0 }})</h4>
              <div *ngIf="!selectedBatch.students || selectedBatch.students.length === 0" class="empty-enrolled">
                No students are currently enrolled in this batch.
              </div>

              <div *ngIf="selectedBatch.students && selectedBatch.students.length > 0">
                <table class="students-table">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Admission No</th>
                      <th>Contact</th>
                      <th>Status</th>
                      <th class="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let student of selectedBatch.students">
                      <td class="font-semibold">{{ student.firstName }} {{ student.lastName || '' }}</td>
                      <td><code>{{ student.admissionNumber }}</code></td>
                      <td>{{ student.phone || student.email || 'N/A' }}</td>
                      <td>
                        <app-status-badge [type]="student.status === 'ACTIVE' ? 'active' : 'inactive'"></app-status-badge>
                      </td>
                      <td class="text-right">
                        <ion-button fill="clear" color="danger" size="small" (click)="removeStudent(student)" title="Remove from batch">
                          <ion-icon name="remove-circle-outline" slot="icon-only"></ion-icon>
                        </ion-button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </ion-content>
        </ng-template>
      </ion-modal>

      <!-- Delete Confirmation Modal -->
      <ion-modal [isOpen]="isDeleteModalOpen" (didDismiss)="isDeleteModalOpen = false">
        <ng-template>
          <div class="delete-modal-box ion-padding">
            <ion-icon name="warning-outline" color="danger" class="warn-icon"></ion-icon>
            <h3>Delete Batch Record?</h3>
            <p>Are you sure you want to delete batch <strong>{{ batchToDelete?.name }}</strong>? Enrolled students will be unassigned.</p>
            <div class="delete-actions">
              <ion-button fill="outline" color="medium" (click)="isDeleteModalOpen = false">Cancel</ion-button>
              <ion-button color="danger" (click)="executeDelete()">Confirm Delete</ion-button>
            </div>
          </div>
        </ng-template>
      </ion-modal>
    </div>
  `,
  styles: [`
    .batches-page {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .desktop-only {
      display: block;
      @media (max-width: 768px) { display: none; }
    }

    .mobile-only {
      display: none;
      @media (max-width: 768px) { display: flex; flex-direction: column; gap: 12px; }
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;

      th {
        background: #f8fafc;
        padding: 12px 16px;
        text-align: left;
        font-weight: 600;
        color: #475569;
        border-bottom: 1px solid #e2e8f0;
      }

      td {
        padding: 14px 16px;
        border-bottom: 1px solid #f1f5f9;
        vertical-align: middle;
      }

      tr:hover td {
        background: #f8fafc;
      }
    }

    .batch-cell {
      display: flex;
      align-items: center;
      gap: 12px;

      .batch-icon {
        width: 36px;
        height: 36px;
        border-radius: 8px;
        background: rgba(16, 185, 129, 0.1);
        color: #10b981;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
      }

      .batch-name {
        font-weight: 700;
        color: #0f172a;
      }

      .batch-code {
        font-size: 11px;
        color: #64748b;
        font-family: monospace;
      }
    }

    .schedule-info {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .timing {
        font-size: 13px;
        font-weight: 600;
        color: #334155;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .days-list {
        display: flex;
        gap: 4px;

        .day-chip {
          font-size: 10px;
          background: #e2e8f0;
          color: #334155;
          padding: 1px 6px;
          border-radius: 4px;
          font-weight: 600;
        }
      }
    }

    .room-pill {
      font-size: 12px;
      background: #f1f5f9;
      padding: 4px 8px;
      border-radius: 6px;
      color: #475569;
      font-weight: 600;
    }

    .capacity-box {
      width: 140px;
      display: flex;
      flex-direction: column;
      gap: 4px;

      .capacity-labels {
        display: flex;
        justify-content: space-between;
        font-size: 12px;

        .count { font-weight: 700; color: #0f172a; }
        .cap-limit { color: #64748b; }
      }
    }

    .cards-list {
      .batch-card {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.04);
      }

      .card-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;

        .batch-name { margin: 0; font-size: 16px; font-weight: 700; color: #0f172a; }
        .batch-code { font-size: 12px; color: #64748b; font-family: monospace; }
      }

      .card-body {
        display: flex;
        flex-direction: column;
        gap: 6px;
        font-size: 13px;
        color: #334155;

        .info-row {
          display: flex;
          align-items: center;
          gap: 8px;

          ion-icon { color: #64748b; }
        }
      }

      .card-actions {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
        padding-top: 8px;
        border-top: 1px solid #f1f5f9;
      }
    }

    .pagination-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      background: white;
      border-radius: 10px;
      border: 1px solid #e2e8f0;
      font-size: 13px;
      color: #64748b;

      .pagination-buttons {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .page-num {
        font-weight: 700;
        color: #0f172a;
      }
    }

    .modal-content {
      --background: #f8fafc;

      .form-section {
        background: white;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 16px;
        border: 1px solid #e2e8f0;

        .form-section-title { margin: 0 0 12px 0; font-size: 14px; font-weight: 700; color: #1e293b; }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 12px;

          @media (min-width: 640px) {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .form-item {
          --background: white;
          --border-radius: 8px;
          width: 100%;

          &.full-width { grid-column: 1 / -1; }
        }
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 20px;
      }
    }

    .batch-detail-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background: white;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      margin-bottom: 16px;

      h2 { margin: 0 0 8px 0; font-size: 20px; font-weight: 700; }
      .detail-tags { display: flex; gap: 8px; align-items: center; }

      .capacity-card {
        text-align: right;
        background: #f8fafc;
        padding: 10px 16px;
        border-radius: 10px;
        border: 1px solid #e2e8f0;

        .cap-title { font-size: 11px; color: #64748b; text-transform: uppercase; }
        .cap-number { font-size: 18px; font-weight: 800; color: #0f172a; }
        .full-alert { color: #ef4444; font-size: 11px; font-weight: 700; }
      }
    }

    .add-student-box {
      background: white;
      border-radius: 12px;
      padding: 16px;
      border: 1px solid #e2e8f0;
      margin-bottom: 16px;

      .box-title { margin: 0 0 12px 0; font-size: 14px; font-weight: 700; }

      .assign-form {
        display: flex;
        gap: 12px;
        align-items: flex-end;

        .select-item { flex: 1; --background: #f8fafc; }
      }
    }

    .students-section {
      background: white;
      border-radius: 12px;
      padding: 16px;
      border: 1px solid #e2e8f0;

      .section-title { margin: 0 0 12px 0; font-size: 14px; font-weight: 700; }
      .empty-enrolled { font-size: 13px; color: #94a3b8; font-style: italic; }

      .students-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 13px;

        th { background: #f8fafc; padding: 10px; text-align: left; font-weight: 600; color: #475569; }
        td { padding: 10px; border-bottom: 1px solid #f1f5f9; }
      }
    }

    .delete-modal-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;

      .warn-icon { font-size: 48px; margin-bottom: 12px; }
      h3 { margin: 0 0 8px 0; font-size: 18px; font-weight: 700; color: #0f172a; }
      p { margin: 0 0 20px 0; font-size: 14px; color: #64748b; }
      .delete-actions { display: flex; gap: 12px; }
    }
  `]
})
export class BatchesPage implements OnInit {
  private batchService = inject(BatchService);
  private studentService = inject(StudentService);
  private staffService = inject(StaffService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  batches: Batch[] = [];
  unassignedStudents: Student[] = [];
  availableStaff: Staff[] = [];
  loading = true;
  submitting = false;
  assigning = false;
  assigningTeacher = false;

  searchQuery = '';
  selectedStatus = '';
  studentToAssign = '';
  selectedTeacherId = '';

  pagination = {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1
  };

  statusOptions: FilterOption[] = [
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Inactive', value: 'INACTIVE' },
    { label: 'Completed', value: 'COMPLETED' }
  ];

  isFormModalOpen = false;
  isDetailModalOpen = false;
  isDeleteModalOpen = false;

  editingBatch: Batch | null = null;
  selectedBatch: Batch | null = null;
  batchToDelete: Batch | null = null;

  batchForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
    this.loadBatches();
    this.loadStaffList();
  }

  initForm(): void {
    this.batchForm = this.fb.group({
      name: ['', [Validators.required]],
      code: [''],
      course: [''],
      room: [''],
      capacity: [0, [Validators.min(0)]],
      status: ['ACTIVE', [Validators.required]],
      startTime: [''],
      endTime: [''],
      days: [[]],
      startDate: [''],
      endDate: [''],
      description: ['']
    });
  }

  loadBatches(): void {
    this.loading = true;
    this.batchService.getBatches(
      this.pagination.page,
      this.pagination.limit,
      this.searchQuery,
      this.selectedStatus
    ).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.batches = res.data;
          if (res.pagination) {
            this.pagination = res.pagination;
          }
        }
      },
      error: (err) => {
        this.loading = false;
        this.toastService.error(err.error?.message || 'Failed to load batches');
      }
    });
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.pagination.page = 1;
    this.loadBatches();
  }

  onFilterStatus(status: string): void {
    this.selectedStatus = status;
    this.pagination.page = 1;
    this.loadBatches();
  }

  changePage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.pagination.totalPages) {
      this.pagination.page = newPage;
      this.loadBatches();
    }
  }

  openFormModal(batch?: Batch): void {
    if (batch) {
      this.editingBatch = batch;
      this.batchForm.patchValue({
        name: batch.name,
        code: batch.code || '',
        course: batch.course || '',
        room: batch.room || '',
        capacity: batch.capacity || 0,
        status: batch.status || 'ACTIVE',
        startTime: batch.startTime || '',
        endTime: batch.endTime || '',
        days: batch.days || [],
        startDate: batch.startDate ? batch.startDate.substring(0, 10) : '',
        endDate: batch.endDate ? batch.endDate.substring(0, 10) : '',
        description: batch.description || ''
      });
    } else {
      this.editingBatch = null;
      this.batchForm.reset({
        capacity: 0,
        status: 'ACTIVE',
        days: []
      });
    }
    this.isFormModalOpen = true;
  }

  closeFormModal(): void {
    this.isFormModalOpen = false;
    this.editingBatch = null;
  }

  saveBatch(): void {
    if (this.batchForm.invalid) return;

    this.submitting = true;
    const formVal = this.batchForm.value;

    if (this.editingBatch) {
      this.batchService.updateBatch(this.editingBatch._id, formVal).subscribe({
        next: (res) => {
          this.submitting = false;
          if (res.success) {
            this.toastService.success('Batch details updated successfully');
            this.closeFormModal();
            this.loadBatches();
          }
        },
        error: (err) => {
          this.submitting = false;
          this.toastService.error(err.error?.message || 'Failed to update batch');
        }
      });
    } else {
      this.batchService.createBatch(formVal).subscribe({
        next: (res) => {
          this.submitting = false;
          if (res.success) {
            this.toastService.success('New batch created successfully');
            this.closeFormModal();
            this.loadBatches();
          }
        },
        error: (err) => {
          this.submitting = false;
          this.toastService.error(err.error?.message || 'Failed to create batch');
        }
      });
    }
  }

  viewDetail(batch: Batch): void {
    this.selectedBatch = batch;
    this.isDetailModalOpen = true;
    this.studentToAssign = '';

    // Load full details for this batch
    this.batchService.getBatchById(batch._id).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.selectedBatch = res.data;
        }
      }
    });

    // Load all students to filter unassigned ones
    this.studentService.getStudents(1, 100).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const assignedIds = (this.selectedBatch?.students || []).map((s) => s._id);
          this.unassignedStudents = res.data.filter((s) => !assignedIds.includes(s._id));
        }
      }
    });
  }

  closeDetailModal(): void {
    this.isDetailModalOpen = false;
    this.selectedBatch = null;
    this.studentToAssign = '';
  }

  assignStudent(): void {
    if (!this.selectedBatch || !this.studentToAssign) return;

    this.assigning = true;
    this.batchService.assignStudentToBatch(this.selectedBatch._id, this.studentToAssign).subscribe({
      next: (res) => {
        this.assigning = false;
        if (res.success) {
          this.toastService.success('Student assigned to batch successfully');
          this.viewDetail(this.selectedBatch!);
          this.loadBatches();
        }
      },
      error: (err) => {
        this.assigning = false;
        this.toastService.error(err.error?.message || 'Failed to assign student');
      }
    });
  }

  loadStaffList(): void {
    this.staffService.getStaffList({ limit: 100, status: 'ACTIVE' }).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.availableStaff = res.data;
        }
      }
    });
  }

  assignTeacher(): void {
    if (!this.selectedBatch || !this.selectedTeacherId) return;

    this.assigningTeacher = true;
    this.batchService.assignTeacherToBatch(this.selectedBatch._id, this.selectedTeacherId).subscribe({
      next: (res) => {
        this.assigningTeacher = false;
        if (res.success) {
          this.toastService.success('Teacher assigned to batch successfully');
          this.selectedTeacherId = '';
          this.viewDetail(this.selectedBatch!);
          this.loadBatches();
        }
      },
      error: (err) => {
        this.assigningTeacher = false;
        this.toastService.error(err.error?.message || 'Failed to assign teacher');
      }
    });
  }

  removeTeacher(teacherId: string): void {
    if (!this.selectedBatch || !teacherId) return;

    this.batchService.removeTeacherFromBatch(this.selectedBatch._id, teacherId).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastService.success('Teacher removed from batch');
          this.viewDetail(this.selectedBatch!);
          this.loadBatches();
        }
      },
      error: (err) => {
        this.toastService.error(err.error?.message || 'Failed to remove teacher');
      }
    });
  }

  getTeacherName(teacherObj: any): string {
    if (!teacherObj) return 'Teacher';
    if (typeof teacherObj === 'string') {
      const match = this.availableStaff.find(s => (s.userId as any)?._id === teacherObj || s.userId === teacherObj);
      return match ? match.name : 'Teacher';
    }
    return teacherObj.name || 'Teacher';
  }

  getTeacherId(teacherObj: any): string {
    if (!teacherObj) return '';
    if (typeof teacherObj === 'string') return teacherObj;
    return teacherObj._id || teacherObj.id || '';
  }

  getStaffUserId(staff: Staff): string {
    if (!staff || !staff.userId) return '';
    if (typeof staff.userId === 'string') return staff.userId;
    return (staff.userId as any)._id || (staff.userId as any).id || '';
  }

  removeStudent(student: Student): void {
    if (!this.selectedBatch) return;

    this.batchService.removeStudentFromBatch(this.selectedBatch._id, student._id).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastService.success(`Removed ${student.firstName} from batch`);
          this.viewDetail(this.selectedBatch!);
          this.loadBatches();
        }
      },
      error: (err) => {
        this.toastService.error(err.error?.message || 'Failed to remove student');
      }
    });
  }

  confirmDelete(batch: Batch): void {
    this.batchToDelete = batch;
    this.isDeleteModalOpen = true;
  }

  executeDelete(): void {
    if (!this.batchToDelete) return;

    this.batchService.deleteBatch(this.batchToDelete._id).subscribe({
      next: (res) => {
        this.isDeleteModalOpen = false;
        if (res.success) {
          this.toastService.success('Batch deleted successfully');
          this.loadBatches();
        }
      },
      error: (err) => {
        this.isDeleteModalOpen = false;
        this.toastService.error(err.error?.message || 'Failed to delete batch');
      }
    });
  }

  getCapacityRatio(batch: Batch): number {
    if (!batch.capacity || batch.capacity <= 0) return 0;
    return (batch.studentCount || 0) / batch.capacity;
  }

  getStatusType(status: string): string {
    if (status === 'ACTIVE') return 'active';
    if (status === 'COMPLETED') return 'info';
    return 'inactive';
  }
}
