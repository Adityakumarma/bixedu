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
  IonSpinner
} from '@ionic/angular';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SearchBarComponent, FilterOption } from '../../shared/components/search-bar/search-bar.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ResponsiveTableComponent } from '../../shared/components/responsive-table/responsive-table.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { StudentService } from '../../core/services/student.service';
import { ParentService } from '../../core/services/parent.service';
import { BatchService } from '../../core/services/batch.service';
import { ToastService } from '../../core/services/toast.service';
import { Student } from '../../core/models/student.model';
import { Parent } from '../../core/models/parent.model';
import { Batch } from '../../core/models/batch.model';

@Component({
  selector: 'app-students',
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
    IonSpinner
  ],
  template: `
    <div class="students-page">
      <app-page-header
        title="Student Management"
        subtitle="Manage student profiles, enrollments, parents, and batch assignments"
        icon="people-outline">
        <div actions>
          <ion-button fill="solid" color="primary" (click)="openFormModal()">
            <ion-icon slot="start" name="person-add-outline"></ion-icon>
            Add Student
          </ion-button>
        </div>
      </app-page-header>

      <!-- Search & Batch Filter Bar -->
      <app-search-bar
        placeholder="Search students by name, admission no, phone, or email..."
        filterPlaceholder="Filter by Batch"
        [filterOptions]="batchFilterOptions"
        (search)="onSearch($event)"
        (filter)="onFilterBatch($event)">
      </app-search-bar>

      <!-- Status Filter Chips -->
      <div class="status-chips-bar">
        <button
          class="status-chip"
          [class.active]="selectedStatus === ''"
          (click)="onFilterStatus('')">
          All Statuses
        </button>
        <button
          class="status-chip"
          [class.active]="selectedStatus === 'ACTIVE'"
          (click)="onFilterStatus('ACTIVE')">
          Active Students
        </button>
        <button
          class="status-chip"
          [class.active]="selectedStatus === 'INACTIVE'"
          (click)="onFilterStatus('INACTIVE')">
          Inactive Students
        </button>
      </div>

      <!-- Loading State -->
      <app-loading-spinner *ngIf="loading" message="Loading student directory..."></app-loading-spinner>

      <!-- Content Area -->
      <div *ngIf="!loading">
        <div *ngIf="students.length === 0">
          <app-empty-state
            title="No students found"
            [description]="searchQuery || selectedStatus || selectedBatchId ? 'No student records match your active filters.' : 'There are currently no students enrolled in this centre.'"
            icon="people-circle-outline"
            actionLabel="Add First Student"
            (onAction)="openFormModal()">
          </app-empty-state>
        </div>

        <div *ngIf="students.length > 0">
          <!-- Desktop Data Table View -->
          <app-responsive-table class="desktop-only">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Admission No</th>
                  <th>Contact Info</th>
                  <th>Parents / Guardians</th>
                  <th>Assigned Batch</th>
                  <th>Status</th>
                  <th class="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let student of students">
                  <td class="font-semibold">
                    <div class="student-cell">
                      <div class="avatar-circle">{{ student.firstName.charAt(0).toUpperCase() }}</div>
                      <div>
                        <div class="student-name">{{ student.firstName }} {{ student.lastName || '' }}</div>
                        <div class="sub-text" *ngIf="student.gender">{{ student.gender }}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <code class="adm-badge">{{ student.admissionNumber }}</code>
                  </td>
                  <td>
                    <div class="contact-info">
                      <div *ngIf="student.phone"><ion-icon name="call-outline"></ion-icon> {{ student.phone }}</div>
                      <div *ngIf="student.email" class="sub-text"><ion-icon name="mail-outline"></ion-icon> {{ student.email }}</div>
                      <div *ngIf="!student.phone && !student.email" class="sub-text">No direct contact</div>
                    </div>
                  </td>
                  <td>
                    <div *ngIf="getParentsInfo(student) as parentsText">
                      <ion-icon name="heart-outline" style="color: #ef4444; margin-right: 4px;"></ion-icon>
                      {{ parentsText }}
                    </div>
                    <span *ngIf="!student.parents || student.parents.length === 0" class="sub-text">Unassigned</span>
                  </td>
                  <td>
                    <div *ngIf="getBatchInfo(student) as batchObj">
                      <ion-badge color="success" class="batch-badge">
                        <ion-icon name="library-outline"></ion-icon> {{ batchObj.name }}
                      </ion-badge>
                    </div>
                    <span *ngIf="!student.batchId" class="sub-text">No Batch</span>
                  </td>
                  <td>
                    <app-status-badge [type]="student.status === 'ACTIVE' ? 'active' : 'inactive'"></app-status-badge>
                  </td>
                  <td class="text-right actions-cell">
                    <ion-button fill="clear" size="small" color="primary" (click)="viewDetail(student)" title="View Details">
                      <ion-icon name="eye-outline" slot="icon-only"></ion-icon>
                    </ion-button>
                    <ion-button fill="clear" size="small" color="secondary" (click)="openFormModal(student)" title="Edit">
                      <ion-icon name="create-outline" slot="icon-only"></ion-icon>
                    </ion-button>
                    <ion-button
                      fill="clear"
                      size="small"
                      [color]="student.status === 'ACTIVE' ? 'warning' : 'success'"
                      (click)="toggleStatus(student)"
                      [title]="student.status === 'ACTIVE' ? 'Deactivate' : 'Activate'">
                      <ion-icon [name]="student.status === 'ACTIVE' ? 'pause-circle-outline' : 'play-circle-outline'" slot="icon-only"></ion-icon>
                    </ion-button>
                    <ion-button fill="clear" size="small" color="danger" (click)="confirmDelete(student)" title="Delete">
                      <ion-icon name="trash-outline" slot="icon-only"></ion-icon>
                    </ion-button>
                  </td>
                </tr>
              </tbody>
            </table>
          </app-responsive-table>

          <!-- Mobile Card View -->
          <div class="mobile-only cards-list">
            <div class="student-card" *ngFor="let student of students">
              <div class="card-header">
                <div class="user-info">
                  <div class="avatar-circle">{{ student.firstName.charAt(0).toUpperCase() }}</div>
                  <div>
                    <h4 class="student-name">{{ student.firstName }} {{ student.lastName || '' }}</h4>
                    <span class="adm-text">Adm No: {{ student.admissionNumber }}</span>
                  </div>
                </div>
                <app-status-badge [type]="student.status === 'ACTIVE' ? 'active' : 'inactive'"></app-status-badge>
              </div>

              <div class="card-body">
                <div class="info-row" *ngIf="getBatchInfo(student) as batchObj">
                  <ion-icon name="library-outline"></ion-icon>
                  <span>Batch: <strong>{{ batchObj.name }}</strong></span>
                </div>
                <div class="info-row" *ngIf="student.phone">
                  <ion-icon name="call-outline"></ion-icon>
                  <span>{{ student.phone }}</span>
                </div>
                <div class="info-row" *ngIf="getParentsInfo(student) as pInfo">
                  <ion-icon name="heart-outline"></ion-icon>
                  <span>Parent: {{ pInfo }}</span>
                </div>
              </div>

              <div class="card-actions">
                <ion-button fill="outline" size="small" color="primary" (click)="viewDetail(student)">
                  <ion-icon name="eye-outline" slot="start"></ion-icon> View
                </ion-button>
                <ion-button fill="outline" size="small" color="secondary" (click)="openFormModal(student)">
                  <ion-icon name="create-outline" slot="start"></ion-icon> Edit
                </ion-button>
                <ion-button fill="outline" size="small" color="danger" (click)="confirmDelete(student)">
                  <ion-icon name="trash-outline" slot="icon-only"></ion-icon>
                </ion-button>
              </div>
            </div>
          </div>

          <!-- Pagination Bar -->
          <div class="pagination-bar" *ngIf="pagination.totalPages > 1">
            <div class="pagination-info">
              Showing page {{ pagination.page }} of {{ pagination.totalPages }} (Total {{ pagination.total }} students)
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

      <!-- Add/Edit Student Form Modal -->
      <ion-modal [isOpen]="isFormModalOpen" (didDismiss)="closeFormModal()">
        <ng-template>
          <ion-header>
            <ion-toolbar color="primary">
              <ion-title>{{ editingStudent ? 'Edit Student Record' : 'Enroll New Student' }}</ion-title>
              <ion-buttons slot="end">
                <ion-button (click)="closeFormModal()">
                  <ion-icon name="close-outline" slot="icon-only"></ion-icon>
                </ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>

          <ion-content class="ion-padding modal-content">
            <form [formGroup]="studentForm" (ngSubmit)="saveStudent()">
              <div class="form-section">
                <h4 class="form-section-title">Personal Information</h4>
                <div class="form-grid">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">First Name *</ion-label>
                    <ion-input formControlName="firstName" placeholder="Student's first name"></ion-input>
                  </ion-item>

                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">Last Name</ion-label>
                    <ion-input formControlName="lastName" placeholder="Student's last name"></ion-input>
                  </ion-item>

                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">Admission Number (Auto if blank)</ion-label>
                    <ion-input formControlName="admissionNumber" placeholder="e.g. ADM001"></ion-input>
                  </ion-item>

                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">Gender</ion-label>
                    <ion-select formControlName="gender" interface="popover">
                      <ion-select-option value="MALE">Male</ion-select-option>
                      <ion-select-option value="FEMALE">Female</ion-select-option>
                      <ion-select-option value="OTHER">Other</ion-select-option>
                    </ion-select>
                  </ion-item>

                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">Date of Birth</ion-label>
                    <ion-input formControlName="dateOfBirth" type="date"></ion-input>
                  </ion-item>

                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">Admission Date</ion-label>
                    <ion-input formControlName="admissionDate" type="date"></ion-input>
                  </ion-item>
                </div>
              </div>

              <div class="form-section">
                <h4 class="form-section-title">Contact & Location</h4>
                <div class="form-grid">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">Student Phone</ion-label>
                    <ion-input formControlName="phone" type="tel" placeholder="Mobile number"></ion-input>
                  </ion-item>

                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">Student Email</ion-label>
                    <ion-input formControlName="email" type="email" placeholder="Email address"></ion-input>
                  </ion-item>

                  <ion-item fill="outline" class="form-item full-width">
                    <ion-label position="stacked">Address</ion-label>
                    <ion-input formControlName="address" placeholder="Residential address"></ion-input>
                  </ion-item>

                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">City</ion-label>
                    <ion-input formControlName="city" placeholder="City"></ion-input>
                  </ion-item>

                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">State</ion-label>
                    <ion-input formControlName="state" placeholder="State"></ion-input>
                  </ion-item>
                </div>
              </div>

              <div class="form-section">
                <h4 class="form-section-title">Relationships & Status</h4>
                <div class="form-grid">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">Assign Parent / Guardian</ion-label>
                    <ion-select formControlName="parents" [multiple]="true" interface="popover" placeholder="Select parent(s)">
                      <ion-select-option *ngFor="let p of availableParents" [value]="p._id">
                        {{ p.name }} ({{ p.relationship }} - {{ p.phone }})
                      </ion-select-option>
                    </ion-select>
                  </ion-item>

                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">Assign Batch</ion-label>
                    <ion-select formControlName="batchId" interface="popover" placeholder="Select batch">
                      <ion-select-option value="">-- No Batch --</ion-select-option>
                      <ion-select-option *ngFor="let b of availableBatches" [value]="b._id">
                        {{ b.name }} ({{ b.course || 'General' }})
                      </ion-select-option>
                    </ion-select>
                  </ion-item>

                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">Enrollment Status</ion-label>
                    <ion-select formControlName="status" interface="popover">
                      <ion-select-option value="ACTIVE">Active</ion-select-option>
                      <ion-select-option value="INACTIVE">Inactive</ion-select-option>
                    </ion-select>
                  </ion-item>

                  <ion-item fill="outline" class="form-item full-width">
                    <ion-label position="stacked">Internal Notes / Remarks</ion-label>
                    <ion-textarea formControlName="notes" rows="3" placeholder="Remarks..."></ion-textarea>
                  </ion-item>
                </div>
              </div>

              <div class="form-actions">
                <ion-button fill="outline" color="medium" (click)="closeFormModal()">Cancel</ion-button>
                <ion-button type="submit" color="primary" [disabled]="studentForm.invalid || submitting">
                  <ion-spinner *ngIf="submitting" name="crescent" slot="start"></ion-spinner>
                  {{ editingStudent ? 'Update Student' : 'Save Student' }}
                </ion-button>
              </div>
            </form>
          </ion-content>
        </ng-template>
      </ion-modal>

      <!-- View Detail Modal -->
      <ion-modal [isOpen]="isDetailModalOpen" (didDismiss)="closeDetailModal()">
        <ng-template>
          <ion-header>
            <ion-toolbar color="primary">
              <ion-title>Student Record Details</ion-title>
              <ion-buttons slot="end">
                <ion-button (click)="closeDetailModal()">
                  <ion-icon name="close-outline" slot="icon-only"></ion-icon>
                </ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>

          <ion-content class="ion-padding modal-content" *ngIf="selectedStudent">
            <div class="profile-header">
              <div class="avatar-large">{{ selectedStudent.firstName.charAt(0).toUpperCase() }}</div>
              <div class="profile-title">
                <h3>{{ selectedStudent.firstName }} {{ selectedStudent.lastName || '' }}</h3>
                <div class="sub-badges">
                  <code>ADM: {{ selectedStudent.admissionNumber }}</code>
                  <app-status-badge [type]="selectedStudent.status === 'ACTIVE' ? 'active' : 'inactive'"></app-status-badge>
                </div>
              </div>
            </div>

            <div class="detail-card">
              <h4 class="detail-section-title">Academic & Batch Information</h4>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-label">Assigned Batch</span>
                  <span class="detail-value">{{ getBatchInfo(selectedStudent)?.name || 'Unassigned' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Admission Date</span>
                  <span class="detail-value">{{ selectedStudent.admissionDate ? (selectedStudent.admissionDate | date:'mediumDate') : 'N/A' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Gender</span>
                  <span class="detail-value">{{ selectedStudent.gender || 'N/A' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Date of Birth</span>
                  <span class="detail-value">{{ selectedStudent.dateOfBirth ? (selectedStudent.dateOfBirth | date:'mediumDate') : 'N/A' }}</span>
                </div>
              </div>
            </div>

            <div class="detail-card">
              <h4 class="detail-section-title">Contact & Location</h4>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-label">Phone</span>
                  <span class="detail-value">{{ selectedStudent.phone || 'N/A' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Email</span>
                  <span class="detail-value">{{ selectedStudent.email || 'N/A' }}</span>
                </div>
                <div class="detail-item full">
                  <span class="detail-label">Address</span>
                  <span class="detail-value">{{ selectedStudent.address ? selectedStudent.address + ', ' + (selectedStudent.city || '') + ' ' + (selectedStudent.state || '') : 'N/A' }}</span>
                </div>
              </div>
            </div>

            <!-- Parents Card -->
            <div class="detail-card">
              <h4 class="detail-section-title">Linked Parents / Guardians</h4>
              <div *ngIf="!selectedStudent.parents || selectedStudent.parents.length === 0" class="empty-sub">
                No parents linked to this student profile.
              </div>

              <div class="parents-list" *ngIf="selectedStudent.parents && selectedStudent.parents.length > 0">
                <div class="parent-item" *ngFor="let p of selectedStudent.parents">
                  <div class="p-avatar"><ion-icon name="heart-outline"></ion-icon></div>
                  <div class="p-info">
                    <div class="p-name">{{ getParentName(p) }} ({{ getParentRelationship(p) }})</div>
                    <div class="p-phone"><ion-icon name="call-outline"></ion-icon> {{ getParentPhone(p) }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="detail-card" *ngIf="selectedStudent.notes">
              <h4 class="detail-section-title">Remarks / Notes</h4>
              <p class="notes-text">{{ selectedStudent.notes }}</p>
            </div>
          </ion-content>
        </ng-template>
      </ion-modal>

      <!-- Delete Confirmation Modal -->
      <ion-modal [isOpen]="isDeleteModalOpen" (didDismiss)="isDeleteModalOpen = false">
        <ng-template>
          <div class="delete-modal-box ion-padding">
            <ion-icon name="warning-outline" color="danger" class="warn-icon"></ion-icon>
            <h3>Delete Student Record?</h3>
            <p>Are you sure you want to delete student <strong>{{ studentToDelete?.firstName }} {{ studentToDelete?.lastName }}</strong> ({{ studentToDelete?.admissionNumber }})?</p>
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
    .students-page {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .status-chips-bar {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;

      .status-chip {
        border: 1px solid #cbd5e1;
        background: white;
        color: #475569;
        padding: 6px 14px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;

        &.active, &:hover {
          background: #4f46e5;
          color: white;
          border-color: #4f46e5;
        }
      }
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

    .student-cell {
      display: flex;
      align-items: center;
      gap: 12px;

      .avatar-circle {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: linear-gradient(135deg, #10b981, #34d399);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 14px;
      }

      .student-name {
        font-weight: 700;
        color: #0f172a;
      }

      .sub-text {
        font-size: 12px;
        color: #64748b;
      }
    }

    .adm-badge {
      background: #f1f5f9;
      padding: 4px 8px;
      border-radius: 6px;
      font-family: monospace;
      font-weight: 700;
      color: #334155;
    }

    .batch-badge {
      font-size: 12px;
      padding: 4px 8px;
    }

    .cards-list {
      .student-card {
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
        align-items: center;
        justify-content: space-between;

        .user-info {
          display: flex;
          align-items: center;
          gap: 10px;

          .avatar-circle {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, #10b981, #34d399);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
          }

          .student-name { margin: 0; font-size: 15px; font-weight: 700; color: #0f172a; }
          .adm-text { font-size: 11px; color: #64748b; font-family: monospace; }
        }
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

      .page-num { font-weight: 700; color: #0f172a; }
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

    .profile-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: white;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      margin-bottom: 16px;

      .avatar-large {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: linear-gradient(135deg, #10b981, #34d399);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        font-weight: 700;
      }

      .profile-title {
        h3 { margin: 0 0 4px 0; font-size: 18px; font-weight: 700; }
        .sub-badges { display: flex; align-items: center; gap: 8px; }
      }
    }

    .detail-card {
      background: white;
      border-radius: 12px;
      padding: 16px;
      border: 1px solid #e2e8f0;
      margin-bottom: 16px;

      .detail-section-title { margin: 0 0 12px 0; font-size: 14px; font-weight: 700; color: #1e293b; }

      .detail-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
          &.full { grid-column: 1 / -1; }

          .detail-label { font-size: 12px; color: #64748b; }
          .detail-value { font-size: 14px; font-weight: 600; color: #0f172a; }
        }
      }

      .parents-list {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .parent-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #f1f5f9;

          .p-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: #ef4444;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .p-info {
            .p-name { font-size: 13px; font-weight: 600; color: #0f172a; }
            .p-phone { font-size: 12px; color: #64748b; }
          }
        }
      }

      .empty-sub { font-size: 13px; color: #94a3b8; font-style: italic; }
      .notes-text { margin: 0; font-size: 13px; color: #475569; line-height: 1.5; }
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
export class StudentsPage implements OnInit {
  private studentService = inject(StudentService);
  private parentService = inject(ParentService);
  private batchService = inject(BatchService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  students: Student[] = [];
  availableParents: Parent[] = [];
  availableBatches: Batch[] = [];

  loading = true;
  submitting = false;

  searchQuery = '';
  selectedStatus = '';
  selectedBatchId = '';

  pagination = {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1
  };

  batchFilterOptions: FilterOption[] = [];

  isFormModalOpen = false;
  isDetailModalOpen = false;
  isDeleteModalOpen = false;

  editingStudent: Student | null = null;
  selectedStudent: Student | null = null;
  studentToDelete: Student | null = null;

  studentForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
    this.loadStudents();
    this.loadParentsAndBatchesForPickers();
  }

  initForm(): void {
    this.studentForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: [''],
      admissionNumber: [''],
      gender: ['MALE'],
      dateOfBirth: [''],
      admissionDate: [new Date().toISOString().substring(0, 10)],
      phone: [''],
      email: ['', [Validators.email]],
      address: [''],
      city: [''],
      state: [''],
      parents: [[]],
      batchId: [''],
      status: ['ACTIVE', [Validators.required]],
      notes: ['']
    });
  }

  loadStudents(): void {
    this.loading = true;
    this.studentService.getStudents(
      this.pagination.page,
      this.pagination.limit,
      this.searchQuery,
      this.selectedStatus,
      this.selectedBatchId
    ).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.students = res.data;
          if (res.pagination) {
            this.pagination = res.pagination;
          }
        }
      },
      error: (err) => {
        this.loading = false;
        this.toastService.error(err.error?.message || 'Failed to load students');
      }
    });
  }

  loadParentsAndBatchesForPickers(): void {
    this.parentService.getParents(1, 100).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.availableParents = res.data;
        }
      }
    });

    this.batchService.getBatches(1, 100).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.availableBatches = res.data;
          this.batchFilterOptions = res.data.map((b) => ({
            label: `${b.name} (${b.course || 'General'})`,
            value: b._id
          }));
        }
      }
    });
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.pagination.page = 1;
    this.loadStudents();
  }

  onFilterBatch(batchId: string): void {
    this.selectedBatchId = batchId;
    this.pagination.page = 1;
    this.loadStudents();
  }

  onFilterStatus(status: string): void {
    this.selectedStatus = status;
    this.pagination.page = 1;
    this.loadStudents();
  }

  changePage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.pagination.totalPages) {
      this.pagination.page = newPage;
      this.loadStudents();
    }
  }

  openFormModal(student?: Student): void {
    if (student) {
      this.editingStudent = student;
      const parentIds = (student.parents || []).map((p: any) => typeof p === 'string' ? p : p._id);
      const batchId = typeof student.batchId === 'string' ? student.batchId : (student.batchId as any)?._id || '';

      this.studentForm.patchValue({
        firstName: student.firstName,
        lastName: student.lastName || '',
        admissionNumber: student.admissionNumber || '',
        gender: student.gender || 'MALE',
        dateOfBirth: student.dateOfBirth ? student.dateOfBirth.substring(0, 10) : '',
        admissionDate: student.admissionDate ? student.admissionDate.substring(0, 10) : '',
        phone: student.phone || '',
        email: student.email || '',
        address: student.address || '',
        city: student.city || '',
        state: student.state || '',
        parents: parentIds,
        batchId: batchId,
        status: student.status || 'ACTIVE',
        notes: student.notes || ''
      });
    } else {
      this.editingStudent = null;
      this.studentForm.reset({
        gender: 'MALE',
        status: 'ACTIVE',
        admissionDate: new Date().toISOString().substring(0, 10),
        parents: [],
        batchId: ''
      });
    }
    this.isFormModalOpen = true;
  }

  closeFormModal(): void {
    this.isFormModalOpen = false;
    this.editingStudent = null;
  }

  saveStudent(): void {
    if (this.studentForm.invalid) return;

    this.submitting = true;
    const formVal = this.studentForm.value;

    if (this.editingStudent) {
      this.studentService.updateStudent(this.editingStudent._id, formVal).subscribe({
        next: (res) => {
          this.submitting = false;
          if (res.success) {
            this.toastService.success('Student record updated successfully');
            this.closeFormModal();
            this.loadStudents();
          }
        },
        error: (err) => {
          this.submitting = false;
          this.toastService.error(err.error?.message || 'Failed to update student');
        }
      });
    } else {
      this.studentService.createStudent(formVal).subscribe({
        next: (res) => {
          this.submitting = false;
          if (res.success) {
            this.toastService.success('Student enrolled successfully');
            this.closeFormModal();
            this.loadStudents();
          }
        },
        error: (err) => {
          this.submitting = false;
          this.toastService.error(err.error?.message || 'Failed to create student');
        }
      });
    }
  }

  viewDetail(student: Student): void {
    this.selectedStudent = student;
    this.isDetailModalOpen = true;

    this.studentService.getStudentById(student._id).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.selectedStudent = res.data;
        }
      }
    });
  }

  closeDetailModal(): void {
    this.isDetailModalOpen = false;
    this.selectedStudent = null;
  }

  toggleStatus(student: Student): void {
    const newStatus = student.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    this.studentService.updateStudentStatus(student._id, newStatus).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastService.success(`Student status updated to ${newStatus}`);
          this.loadStudents();
        }
      },
      error: (err) => {
        this.toastService.error(err.error?.message || 'Failed to update student status');
      }
    });
  }

  confirmDelete(student: Student): void {
    this.studentToDelete = student;
    this.isDeleteModalOpen = true;
  }

  executeDelete(): void {
    if (!this.studentToDelete) return;

    this.studentService.deleteStudent(this.studentToDelete._id).subscribe({
      next: (res) => {
        this.isDeleteModalOpen = false;
        if (res.success) {
          this.toastService.success('Student record deleted successfully');
          this.loadStudents();
        }
      },
      error: (err) => {
        this.isDeleteModalOpen = false;
        this.toastService.error(err.error?.message || 'Failed to delete student');
      }
    });
  }

  getParentsInfo(student: Student): string | null {
    if (!student.parents || student.parents.length === 0) return null;
    return student.parents.map((p: any) => typeof p === 'string' ? 'Parent' : p.name).join(', ');
  }

  getBatchInfo(student: Student): any | null {
    if (!student.batchId) return null;
    if (typeof student.batchId === 'string') return { name: 'Assigned Batch' };
    return student.batchId;
  }

  getParentName(parentObj: any): string {
    return typeof parentObj === 'string' ? 'Parent' : parentObj.name;
  }

  getParentRelationship(parentObj: any): string {
    return typeof parentObj === 'string' ? '' : parentObj.relationship || 'Guardian';
  }

  getParentPhone(parentObj: any): string {
    return typeof parentObj === 'string' ? '' : parentObj.phone || 'N/A';
  }
}
