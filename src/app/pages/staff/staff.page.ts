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
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ResponsiveTableComponent } from '../../shared/components/responsive-table/responsive-table.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { StaffService } from '../../core/services/staff.service';
import { ToastService } from '../../core/services/toast.service';
import { Staff } from '../../core/models/staff.model';

@Component({
  selector: 'app-staff',
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
    <div class="staff-page">
      <app-page-header
        title="Staff & Faculty Management"
        subtitle="Manage institute teachers, faculty members, employee IDs, and batch teaching assignments"
        icon="person-add-outline">
        <div actions>
          <ion-button fill="solid" color="primary" (click)="openFormModal()">
            <ion-icon slot="start" name="person-add-outline"></ion-icon>
            Add Staff / Teacher
          </ion-button>
        </div>
      </app-page-header>

      <!-- Search & Status Filter -->
      <app-search-bar
        placeholder="Search staff by name, employee ID, email, or designation..."
        (search)="onSearch($event)">
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
          Active Only
        </button>
        <button
          class="status-chip"
          [class.active]="selectedStatus === 'INACTIVE'"
          (click)="onFilterStatus('INACTIVE')">
          Inactive Only
        </button>
      </div>

      <!-- Loading State -->
      <app-loading-spinner *ngIf="loading" message="Loading staff directory..."></app-loading-spinner>

      <!-- Content Area -->
      <div *ngIf="!loading">
        <!-- Empty State -->
        <app-empty-state
          *ngIf="staffList.length === 0"
          title="No staff members found"
          description="Click 'Add Staff / Teacher' to register your coaching faculty."
          icon="people-circle-outline"
          actionLabel="Add Staff Member"
          (onAction)="openFormModal()">
        </app-empty-state>

        <!-- Desktop Table View -->
        <app-responsive-table *ngIf="staffList.length > 0" class="desktop-only">
          <table class="bixedu-table data-table">
            <thead>
              <tr>
                <th>Staff Member</th>
                <th>Employee ID</th>
                <th>Designation</th>
                <th>Phone</th>
                <th>Assigned Batches</th>
                <th>Status</th>
                <th style="text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let member of staffList">
                <td>
                  <div class="staff-cell">
                    <div class="avatar-circle">
                      {{ member.name ? member.name.charAt(0).toUpperCase() : 'T' }}
                    </div>
                    <div>
                      <div class="staff-name">{{ member.name }}</div>
                      <div class="sub-text">{{ member.email }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="emp-badge">{{ member.employeeId || 'N/A' }}</span>
                </td>
                <td>
                  <span class="desig-text">{{ member.designation || 'Faculty' }}</span>
                </td>
                <td>{{ member.phone || 'N/A' }}</td>
                <td>
                  <div class="batches-badges">
                    <ion-badge color="primary" *ngFor="let b of member.assignedBatches" class="batch-pill">
                      {{ b.name }}
                    </ion-badge>
                    <span *ngIf="!member.assignedBatches || member.assignedBatches.length === 0" class="no-batches">
                      No batches assigned
                    </span>
                  </div>
                </td>
                <td>
                  <app-status-badge [status]="member.status"></app-status-badge>
                </td>
                <td style="text-align: right;">
                  <div class="action-buttons">
                    <ion-button fill="clear" color="medium" size="small" (click)="openDetailModal(member)" title="View Details">
                      <ion-icon slot="icon-only" name="eye-outline"></ion-icon>
                    </ion-button>
                    <ion-button fill="clear" color="primary" size="small" (click)="openFormModal(member)" title="Edit Staff">
                      <ion-icon slot="icon-only" name="create-outline"></ion-icon>
                    </ion-button>
                    <ion-button fill="clear" color="danger" size="small" (click)="openDeleteModal(member)" title="Delete Staff">
                      <ion-icon slot="icon-only" name="trash-outline"></ion-icon>
                    </ion-button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </app-responsive-table>

        <!-- Mobile Card List View -->
        <div class="mobile-only cards-list" *ngIf="staffList.length > 0">
          <div class="staff-card" *ngFor="let member of staffList">
            <div class="card-header">
              <div class="user-info">
                <div class="avatar-circle">
                  {{ member.name ? member.name.charAt(0).toUpperCase() : 'T' }}
                </div>
                <div>
                  <h4 class="staff-name">{{ member.name }}</h4>
                  <span class="emp-text">{{ member.employeeId || 'N/A' }} • {{ member.designation }}</span>
                </div>
              </div>
              <app-status-badge [status]="member.status"></app-status-badge>
            </div>

            <div class="card-body">
              <div class="info-row" *ngIf="member.phone">
                <ion-icon name="call-outline"></ion-icon>
                <span>{{ member.phone }}</span>
              </div>
              <div class="info-row" *ngIf="member.email">
                <ion-icon name="mail-outline"></ion-icon>
                <span>{{ member.email }}</span>
              </div>
              <div class="info-row">
                <ion-icon name="library-outline"></ion-icon>
                <span>{{ (member.assignedBatches?.length || 0) }} Batches Assigned</span>
              </div>
            </div>

            <div class="card-actions">
              <ion-button fill="outline" color="medium" size="small" (click)="openDetailModal(member)">
                <ion-icon slot="start" name="eye-outline"></ion-icon>
                View
              </ion-button>
              <ion-button fill="outline" color="primary" size="small" (click)="openFormModal(member)">
                <ion-icon slot="start" name="create-outline"></ion-icon>
                Edit
              </ion-button>
              <ion-button fill="outline" color="danger" size="small" (click)="openDeleteModal(member)">
                <ion-icon slot="start" name="trash-outline"></ion-icon>
                Delete
              </ion-button>
            </div>
          </div>
        </div>

        <!-- Pagination Bar -->
        <div class="pagination-bar" *ngIf="pagination.totalPages > 1">
          <span>Showing page {{ pagination.page }} of {{ pagination.totalPages }} ({{ pagination.total }} staff)</span>
          <div class="pagination-buttons">
            <ion-button fill="outline" size="small" [disabled]="pagination.page === 1" (click)="changePage(pagination.page - 1)">
              Previous
            </ion-button>
            <span class="page-num">{{ pagination.page }}</span>
            <ion-button fill="outline" size="small" [disabled]="pagination.page === pagination.totalPages" (click)="changePage(pagination.page + 1)">
              Next
            </ion-button>
          </div>
        </div>
      </div>

      <!-- Add / Edit Staff Form Modal -->
      <ion-modal [isOpen]="isFormModalOpen" (didDismiss)="isFormModalOpen = false">
        <ng-template>
          <ion-header>
            <ion-toolbar color="primary">
              <ion-title>{{ editingStaff ? 'Edit Staff Profile' : 'Add New Staff / Teacher' }}</ion-title>
              <ion-buttons slot="end">
                <ion-button (click)="isFormModalOpen = false">Close</ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>

          <ion-content class="ion-padding modal-content">
            <form [formGroup]="staffForm" (ngSubmit)="saveStaff()">
              <div class="form-section">
                <h4 class="form-section-title">Personal & Contact Details</h4>
                <div class="form-grid">
                  <div class="form-item">
                    <ion-item fill="outline">
                      <ion-label position="stacked">Full Name *</ion-label>
                      <ion-input formControlName="name" placeholder="Teacher full name"></ion-input>
                    </ion-item>
                  </div>

                  <div class="form-item">
                    <ion-item fill="outline">
                      <ion-label position="stacked">Email Address *</ion-label>
                      <ion-input type="email" formControlName="email" placeholder="teacher@coaching.com"></ion-input>
                    </ion-item>
                  </div>

                  <div class="form-item">
                    <ion-item fill="outline">
                      <ion-label position="stacked">Phone Number</ion-label>
                      <ion-input type="tel" formControlName="phone" placeholder="+91 98765 43210"></ion-input>
                    </ion-item>
                  </div>

                  <div class="form-item" *ngIf="!editingStaff">
                    <ion-item fill="outline">
                      <ion-label position="stacked">Account Password (Min 6 chars)</ion-label>
                      <ion-input type="password" formControlName="password" placeholder="Password123!"></ion-input>
                    </ion-item>
                  </div>
                </div>
              </div>

              <div class="form-section">
                <h4 class="form-section-title">Employment & Designation</h4>
                <div class="form-grid">
                  <div class="form-item">
                    <ion-item fill="outline">
                      <ion-label position="stacked">Employee ID (Optional)</ion-label>
                      <ion-input formControlName="employeeId" placeholder="Auto-generated if empty"></ion-input>
                    </ion-item>
                  </div>

                  <div class="form-item">
                    <ion-item fill="outline">
                      <ion-label position="stacked">Designation / Role Title</ion-label>
                      <ion-input formControlName="designation" placeholder="e.g. Senior Physics Faculty"></ion-input>
                    </ion-item>
                  </div>

                  <div class="form-item">
                    <ion-item fill="outline">
                      <ion-label position="stacked">Joining Date</ion-label>
                      <ion-input type="date" formControlName="joiningDate"></ion-input>
                    </ion-item>
                  </div>

                  <div class="form-item">
                    <ion-item fill="outline">
                      <ion-label position="stacked">Account Status *</ion-label>
                      <ion-select formControlName="status">
                        <ion-select-option value="ACTIVE">ACTIVE</ion-select-option>
                        <ion-select-option value="INACTIVE">INACTIVE</ion-select-option>
                      </ion-select>
                    </ion-item>
                  </div>

                  <div class="form-item full-width">
                    <ion-item fill="outline">
                      <ion-label position="stacked">Qualification / Academic Background</ion-label>
                      <ion-input formControlName="qualification" placeholder="e.g. M.Sc Physics, B.Ed"></ion-input>
                    </ion-item>
                  </div>

                  <div class="form-item full-width">
                    <ion-item fill="outline">
                      <ion-label position="stacked">Address</ion-label>
                      <ion-input formControlName="address" placeholder="Residential street address"></ion-input>
                    </ion-item>
                  </div>

                  <div class="form-item full-width">
                    <ion-item fill="outline">
                      <ion-label position="stacked">Notes / Remarks</ion-label>
                      <ion-textarea formControlName="notes" rows="2" placeholder="Internal staff notes..."></ion-textarea>
                    </ion-item>
                  </div>
                </div>
              </div>

              <div class="form-actions">
                <ion-button fill="outline" color="medium" (click)="isFormModalOpen = false">Cancel</ion-button>
                <ion-button type="submit" color="primary" [disabled]="submitting || staffForm.invalid">
                  <ion-spinner name="crescent" *ngIf="submitting"></ion-spinner>
                  <span *ngIf="!submitting">{{ editingStaff ? 'Update Staff Member' : 'Create Staff & Account' }}</span>
                </ion-button>
              </div>
            </form>
          </ion-content>
        </ng-template>
      </ion-modal>

      <!-- Staff Detail Modal -->
      <ion-modal [isOpen]="isDetailModalOpen" (didDismiss)="isDetailModalOpen = false">
        <ng-template>
          <ion-header>
            <ion-toolbar color="primary">
              <ion-title>Staff Profile Details</ion-title>
              <ion-buttons slot="end">
                <ion-button (click)="isDetailModalOpen = false">Close</ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>

          <ion-content class="ion-padding modal-content" *ngIf="selectedStaff">
            <div class="profile-header">
              <div class="avatar-large">
                {{ selectedStaff.name ? selectedStaff.name.charAt(0).toUpperCase() : 'T' }}
              </div>
              <div class="profile-title">
                <h3>{{ selectedStaff.name }}</h3>
                <div class="sub-badges">
                  <span class="emp-badge">{{ selectedStaff.employeeId || 'N/A' }}</span>
                  <app-status-badge [status]="selectedStaff.status"></app-status-badge>
                </div>
              </div>
            </div>

            <div class="detail-card">
              <h4 class="detail-section-title">Employment & Contact Information</h4>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-label">Designation</span>
                  <span class="detail-value">{{ selectedStaff.designation || 'Faculty' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Joining Date</span>
                  <span class="detail-value">{{ selectedStaff.joiningDate ? (selectedStaff.joiningDate | date:'mediumDate') : 'N/A' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Email</span>
                  <span class="detail-value">{{ selectedStaff.email }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Phone</span>
                  <span class="detail-value">{{ selectedStaff.phone || 'N/A' }}</span>
                </div>
                <div class="detail-item full">
                  <span class="detail-label">Qualification</span>
                  <span class="detail-value">{{ selectedStaff.qualification || 'N/A' }}</span>
                </div>
                <div class="detail-item full">
                  <span class="detail-label">Address</span>
                  <span class="detail-value">{{ selectedStaff.address || 'N/A' }}</span>
                </div>
              </div>
            </div>

            <div class="detail-card">
              <h4 class="detail-section-title">Assigned Teaching Batches</h4>
              <div *ngIf="!selectedStaff.assignedBatches || selectedStaff.assignedBatches.length === 0" class="empty-sub">
                No teaching batches assigned yet.
              </div>
              <div class="batches-list" *ngIf="selectedStaff.assignedBatches && selectedStaff.assignedBatches.length > 0">
                <div class="batch-item" *ngFor="let b of selectedStaff.assignedBatches">
                  <ion-icon name="library-outline"></ion-icon>
                  <span>{{ b.name }} ({{ b.code || 'BATCH' }})</span>
                </div>
              </div>
            </div>

            <div class="detail-card" *ngIf="selectedStaff.notes">
              <h4 class="detail-section-title">Internal Notes</h4>
              <p class="notes-text">{{ selectedStaff.notes }}</p>
            </div>
          </ion-content>
        </ng-template>
      </ion-modal>

      <!-- Delete Confirmation Modal -->
      <ion-modal [isOpen]="isDeleteModalOpen" (didDismiss)="isDeleteModalOpen = false">
        <ng-template>
          <div class="delete-modal-box ion-padding">
            <ion-icon name="warning-outline" color="danger" class="warn-icon"></ion-icon>
            <h3>Delete Staff Profile?</h3>
            <p>Are you sure you want to delete staff member <strong>{{ staffToDelete?.name }}</strong> ({{ staffToDelete?.employeeId }})?</p>
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
    .staff-page {
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

    .staff-cell {
      display: flex;
      align-items: center;
      gap: 12px;

      .avatar-circle {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: linear-gradient(135deg, #4f46e5, #7c3aed);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 14px;
      }

      .staff-name { font-weight: 700; color: #0f172a; }
      .sub-text { font-size: 12px; color: #64748b; }
    }

    .emp-badge {
      background: #f1f5f9;
      padding: 4px 8px;
      border-radius: 6px;
      font-family: monospace;
      font-weight: 700;
      color: #334155;
    }

    .desig-text {
      font-weight: 600;
      color: #334155;
    }

    .batches-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      .batch-pill { font-size: 11px; }
      .no-batches { font-size: 12px; color: #94a3b8; font-style: italic; }
    }

    .action-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 4px;
    }

    .cards-list {
      .staff-card {
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
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
          }

          .staff-name { margin: 0; font-size: 15px; font-weight: 700; color: #0f172a; }
          .emp-text { font-size: 11px; color: #64748b; font-family: monospace; }
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
        background: linear-gradient(135deg, #4f46e5, #7c3aed);
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

      .batches-list {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .batch-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: #f8fafc;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          color: #334155;
          ion-icon { color: #4f46e5; }
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
export class StaffPage implements OnInit {
  private staffService = inject(StaffService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  staffList: Staff[] = [];
  loading = true;
  submitting = false;

  searchQuery = '';
  selectedStatus = '';

  pagination = {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1
  };

  isFormModalOpen = false;
  isDetailModalOpen = false;
  isDeleteModalOpen = false;

  editingStaff: Staff | null = null;
  selectedStaff: Staff | null = null;
  staffToDelete: Staff | null = null;

  staffForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
    this.loadStaffList();
  }

  initForm(): void {
    this.staffForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      password: [''],
      employeeId: [''],
      designation: ['Senior Faculty'],
      joiningDate: [new Date().toISOString().substring(0, 10)],
      status: ['ACTIVE', [Validators.required]],
      qualification: [''],
      address: [''],
      notes: ['']
    });
  }

  loadStaffList(): void {
    this.loading = true;
    this.staffService
      .getStaffList({
        page: this.pagination.page,
        limit: this.pagination.limit,
        search: this.searchQuery,
        status: this.selectedStatus
      })
      .subscribe({
        next: (res) => {
          this.loading = false;
          if (res.success && res.data) {
            this.staffList = res.data;
            if (res.pagination) {
              this.pagination = res.pagination;
            }
          }
        },
        error: (err) => {
          this.loading = false;
          this.toastService.error(err.error?.message || 'Failed to load staff list');
        }
      });
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.pagination.page = 1;
    this.loadStaffList();
  }

  onFilterStatus(status: string): void {
    this.selectedStatus = status;
    this.pagination.page = 1;
    this.loadStaffList();
  }

  changePage(newPage: number): void {
    this.pagination.page = newPage;
    this.loadStaffList();
  }

  openFormModal(staff?: Staff): void {
    this.editingStaff = staff || null;
    this.initForm();

    if (staff) {
      this.staffForm.patchValue({
        name: staff.name,
        email: staff.email,
        phone: staff.phone || '',
        employeeId: staff.employeeId || '',
        designation: staff.designation || 'Faculty',
        joiningDate: staff.joiningDate ? new Date(staff.joiningDate).toISOString().substring(0, 10) : '',
        status: staff.status || 'ACTIVE',
        qualification: staff.qualification || '',
        address: staff.address || '',
        notes: staff.notes || ''
      });
    }

    this.isFormModalOpen = true;
  }

  saveStaff(): void {
    if (this.staffForm.invalid) {
      this.toastService.warning('Please enter required name and valid email');
      return;
    }

    this.submitting = true;
    const formData = this.staffForm.value;

    if (this.editingStaff) {
      this.staffService.updateStaff(this.editingStaff._id, formData).subscribe({
        next: (res) => {
          this.submitting = false;
          if (res.success) {
            this.toastService.success('Staff profile updated successfully!');
            this.isFormModalOpen = false;
            this.loadStaffList();
          }
        },
        error: (err) => {
          this.submitting = false;
          this.toastService.error(err.error?.message || 'Failed to update staff');
        }
      });
    } else {
      this.staffService.createStaff(formData).subscribe({
        next: (res) => {
          this.submitting = false;
          if (res.success) {
            this.toastService.success('Staff member & teacher account created successfully!');
            this.isFormModalOpen = false;
            this.loadStaffList();
          }
        },
        error: (err) => {
          this.submitting = false;
          this.toastService.error(err.error?.message || 'Failed to create staff');
        }
      });
    }
  }

  openDetailModal(staff: Staff): void {
    this.selectedStaff = staff;
    this.isDetailModalOpen = true;
  }

  openDeleteModal(staff: Staff): void {
    this.staffToDelete = staff;
    this.isDeleteModalOpen = true;
  }

  executeDelete(): void {
    if (!this.staffToDelete) return;

    this.staffService.deleteStaff(this.staffToDelete._id).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastService.success('Staff profile deleted');
          this.isDeleteModalOpen = false;
          this.staffToDelete = null;
          this.loadStaffList();
        }
      },
      error: (err) => {
        this.toastService.error(err.error?.message || 'Failed to delete staff member');
      }
    });
  }
}
