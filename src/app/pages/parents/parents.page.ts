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
  IonChip,
  IonSpinner
} from '@ionic/angular';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SearchBarComponent, FilterOption } from '../../shared/components/search-bar/search-bar.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ResponsiveTableComponent } from '../../shared/components/responsive-table/responsive-table.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ParentService } from '../../core/services/parent.service';
import { StudentService } from '../../core/services/student.service';
import { ToastService } from '../../core/services/toast.service';
import { Parent } from '../../core/models/parent.model';
import { Student } from '../../core/models/student.model';

@Component({
  selector: 'app-parents',
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
    IonChip,
    IonSpinner
  ],
  template: `
    <div class="parents-page">
      <app-page-header
        title="Parent Management"
        subtitle="Manage parent/guardian records, emergency contacts, and linked students"
        icon="heart-outline">
        <div actions>
          <ion-button fill="solid" color="primary" (click)="openFormModal()">
            <ion-icon slot="start" name="person-add-outline"></ion-icon>
            Add Parent
          </ion-button>
        </div>
      </app-page-header>

      <!-- Search & Filter Controls -->
      <app-search-bar
        placeholder="Search parents by name, phone, or email..."
        filterPlaceholder="Status"
        [filterOptions]="statusOptions"
        (search)="onSearch($event)"
        (filter)="onFilterStatus($event)">
      </app-search-bar>

      <!-- Loading State -->
      <app-loading-spinner *ngIf="loading" message="Loading parents database..."></app-loading-spinner>

      <!-- Data List / Table -->
      <div *ngIf="!loading">
        <div *ngIf="parents.length === 0">
          <app-empty-state
            title="No parents found"
            [description]="searchQuery || selectedStatus ? 'No parent records match your filters.' : 'There are currently no parents registered in this centre.'"
            icon="heart-dislike-outline"
            actionLabel="Add Parent"
            (onAction)="openFormModal()">
          </app-empty-state>
        </div>

        <div *ngIf="parents.length > 0">
          <!-- Desktop Table View -->
          <app-responsive-table class="desktop-only">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Parent Name</th>
                  <th>Contact Information</th>
                  <th>Relationship</th>
                  <th>Children Linked</th>
                  <th>Status</th>
                  <th class="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let parent of parents">
                  <td class="font-semibold">
                    <div class="user-cell">
                      <div class="avatar-circle">{{ parent.name.charAt(0).toUpperCase() }}</div>
                      <div>
                        <div class="name-text">{{ parent.name }}</div>
                        <div class="sub-text">{{ parent.city ? parent.city + ', ' + parent.state : 'No location' }}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="contact-info">
                      <div><ion-icon name="call-outline"></ion-icon> {{ parent.phone }}</div>
                      <div *ngIf="parent.email" class="sub-text"><ion-icon name="mail-outline"></ion-icon> {{ parent.email }}</div>
                    </div>
                  </td>
                  <td>
                    <ion-badge color="light" class="relationship-badge">{{ parent.relationship || 'FATHER' }}</ion-badge>
                  </td>
                  <td>
                    <span class="children-count" (click)="viewDetail(parent)">
                      <ion-icon name="people-outline"></ion-icon>
                      {{ parent.children?.length || 0 }} Child(ren)
                    </span>
                  </td>
                  <td>
                    <app-status-badge [type]="parent.status === 'ACTIVE' ? 'active' : 'inactive'"></app-status-badge>
                  </td>
                  <td class="text-right actions-cell">
                    <ion-button fill="clear" size="small" color="primary" (click)="viewDetail(parent)" title="View Details">
                      <ion-icon name="eye-outline" slot="icon-only"></ion-icon>
                    </ion-button>
                    <ion-button fill="clear" size="small" color="secondary" (click)="openFormModal(parent)" title="Edit">
                      <ion-icon name="create-outline" slot="icon-only"></ion-icon>
                    </ion-button>

                    <ion-button
                      fill="clear"
                      size="small"
                      [color]="parent.status === 'ACTIVE' ? 'warning' : 'success'"
                      (click)="toggleStatus(parent)"
                      [title]="parent.status === 'ACTIVE' ? 'Deactivate' : 'Activate'">
                      <ion-icon [name]="parent.status === 'ACTIVE' ? 'pause-circle-outline' : 'play-circle-outline'" slot="icon-only"></ion-icon>
                    </ion-button>

                    <ion-button fill="clear" size="small" color="danger" (click)="confirmDelete(parent)" title="Delete">
                      <ion-icon name="trash-outline" slot="icon-only"></ion-icon>
                    </ion-button>
                  </td>
                </tr>
              </tbody>
            </table>
          </app-responsive-table>

          <!-- Mobile Card List View -->
          <div class="mobile-only cards-list">
            <div class="parent-card" *ngFor="let parent of parents">
              <div class="card-header">
                <div class="user-info">
                  <div class="avatar-circle">{{ parent.name.charAt(0).toUpperCase() }}</div>
                  <div>
                    <h4 class="parent-name">{{ parent.name }}</h4>
                    <span class="relationship-tag">{{ parent.relationship }}</span>
                  </div>
                </div>
                <app-status-badge [type]="parent.status === 'ACTIVE' ? 'active' : 'inactive'"></app-status-badge>
              </div>

              <div class="card-body">
                <div class="info-row">
                  <ion-icon name="call-outline"></ion-icon>
                  <span>{{ parent.phone }}</span>
                </div>
                <div class="info-row" *ngIf="parent.email">
                  <ion-icon name="mail-outline"></ion-icon>
                  <span>{{ parent.email }}</span>
                </div>
                <div class="info-row" *ngIf="parent.children && parent.children.length > 0">
                  <ion-icon name="people-outline"></ion-icon>
                  <span>Children: <strong>{{ getChildrenNames(parent) }}</strong></span>
                </div>
              </div>

              <div class="card-actions">
                <ion-button fill="outline" size="small" color="primary" (click)="viewDetail(parent)">
                  <ion-icon name="eye-outline" slot="start"></ion-icon> View
                </ion-button>
                <ion-button fill="outline" size="small" color="secondary" (click)="openFormModal(parent)">
                  <ion-icon name="create-outline" slot="start"></ion-icon> Edit
                </ion-button>
                <ion-button fill="outline" size="small" color="danger" (click)="confirmDelete(parent)">
                  <ion-icon name="trash-outline" slot="icon-only"></ion-icon>
                </ion-button>
              </div>
            </div>
          </div>

          <!-- Pagination Bar -->
          <div class="pagination-bar" *ngIf="pagination.totalPages > 1">
            <div class="pagination-info">
              Showing page {{ pagination.page }} of {{ pagination.totalPages }} (Total {{ pagination.total }} records)
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

      <!-- Add/Edit Parent Form Modal -->
      <ion-modal [isOpen]="isFormModalOpen" (didDismiss)="closeFormModal()">
        <ng-template>
          <ion-header>
            <ion-toolbar color="primary">
              <ion-title>{{ editingParent ? 'Edit Parent Profile' : 'Add New Parent' }}</ion-title>
              <ion-buttons slot="end">
                <ion-button (click)="closeFormModal()">
                  <ion-icon name="close-outline" slot="icon-only"></ion-icon>
                </ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>

          <ion-content class="ion-padding modal-content">
            <form [formGroup]="parentForm" (ngSubmit)="saveParent()">
              <div class="form-section">
                <h4 class="form-section-title">Personal Details</h4>
                <div class="form-grid">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">Full Name *</ion-label>
                    <ion-input formControlName="name" placeholder="Enter parent's full name"></ion-input>
                  </ion-item>

                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">Relationship *</ion-label>
                    <ion-select formControlName="relationship" interface="popover">
                      <ion-select-option value="FATHER">Father</ion-select-option>
                      <ion-select-option value="MOTHER">Mother</ion-select-option>
                      <ion-select-option value="GUARDIAN">Guardian</ion-select-option>
                      <ion-select-option value="OTHER">Other</ion-select-option>
                    </ion-select>
                  </ion-item>
                </div>
              </div>

              <div class="form-section">
                <h4 class="form-section-title">Contact Details</h4>
                <div class="form-grid">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">Phone Number *</ion-label>
                    <ion-input formControlName="phone" type="tel" placeholder="Primary phone number"></ion-input>
                  </ion-item>

                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">Alternate Phone</ion-label>
                    <ion-input formControlName="alternatePhone" type="tel" placeholder="Secondary contact number"></ion-input>
                  </ion-item>

                  <ion-item fill="outline" class="form-item full-width">
                    <ion-label position="stacked">Email Address</ion-label>
                    <ion-input formControlName="email" type="email" placeholder="e.g. parent@example.com"></ion-input>
                  </ion-item>
                </div>
              </div>

              <div class="form-section">
                <h4 class="form-section-title">Address & Status</h4>
                <div class="form-grid">
                  <ion-item fill="outline" class="form-item full-width">
                    <ion-label position="stacked">Residential Address</ion-label>
                    <ion-input formControlName="address" placeholder="Street address"></ion-input>
                  </ion-item>

                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">City</ion-label>
                    <ion-input formControlName="city" placeholder="City"></ion-input>
                  </ion-item>

                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">State</ion-label>
                    <ion-input formControlName="state" placeholder="State"></ion-input>
                  </ion-item>

                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">Account Status</ion-label>
                    <ion-select formControlName="status" interface="popover">
                      <ion-select-option value="ACTIVE">Active</ion-select-option>
                      <ion-select-option value="INACTIVE">Inactive</ion-select-option>
                    </ion-select>
                  </ion-item>

                  <ion-item fill="outline" class="form-item full-width" *ngIf="availableStudents.length > 0">
                    <ion-label position="stacked">Assign Children (Students)</ion-label>
                    <ion-select formControlName="children" [multiple]="true" interface="popover" placeholder="Select linked students">
                      <ion-select-option *ngFor="let s of availableStudents" [value]="s._id">
                        {{ s.firstName }} {{ s.lastName || '' }} ({{ s.admissionNumber }})
                      </ion-select-option>
                    </ion-select>
                  </ion-item>

                  <ion-item fill="outline" class="form-item full-width">
                    <ion-label position="stacked">Notes / Medical Remarks</ion-label>
                    <ion-textarea formControlName="notes" rows="3" placeholder="Additional notes..."></ion-textarea>
                  </ion-item>
                </div>
              </div>

              <div class="form-actions">
                <ion-button fill="outline" color="medium" (click)="closeFormModal()">Cancel</ion-button>
                <ion-button type="submit" color="primary" [disabled]="parentForm.invalid || submitting">
                  <ion-spinner *ngIf="submitting" name="crescent" slot="start"></ion-spinner>
                  {{ editingParent ? 'Update Parent' : 'Save Parent' }}
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
              <ion-title>Parent Record Details</ion-title>
              <ion-buttons slot="end">
                <ion-button (click)="closeDetailModal()">
                  <ion-icon name="close-outline" slot="icon-only"></ion-icon>
                </ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>

          <ion-content class="ion-padding modal-content" *ngIf="selectedParent">
            <div class="profile-header">
              <div class="avatar-large">{{ selectedParent.name.charAt(0).toUpperCase() }}</div>
              <div class="profile-title">
                <h3>{{ selectedParent.name }}</h3>
                <span class="relationship-pill">{{ selectedParent.relationship }}</span>
                <app-status-badge [type]="selectedParent.status === 'ACTIVE' ? 'active' : 'inactive'"></app-status-badge>
              </div>
            </div>

            <div class="detail-card">
              <h4 class="detail-section-title">Contact Information</h4>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-label">Phone</span>
                  <span class="detail-value">{{ selectedParent.phone }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Alternate Phone</span>
                  <span class="detail-value">{{ selectedParent.alternatePhone || 'N/A' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Email</span>
                  <span class="detail-value">{{ selectedParent.email || 'N/A' }}</span>
                </div>
                <div class="detail-item full">
                  <span class="detail-label">Address</span>
                  <span class="detail-value">{{ selectedParent.address ? selectedParent.address + ', ' + (selectedParent.city || '') + ' ' + (selectedParent.state || '') : 'N/A' }}</span>
                </div>
              </div>
            </div>

            <!-- Children Section -->
            <div class="detail-card">
              <h4 class="detail-section-title">Associated Children ({{ selectedParent.children?.length || 0 }})</h4>
              <div *ngIf="!selectedParent.children || selectedParent.children.length === 0" class="empty-sub">
                No students currently linked to this parent.
              </div>

              <div class="children-list" *ngIf="selectedParent.children && selectedParent.children.length > 0">
                <div class="child-item" *ngFor="let child of selectedParent.children">
                  <div class="child-avatar">{{ child.firstName.charAt(0) }}</div>
                  <div class="child-info">
                    <div class="child-name">{{ child.firstName }} {{ child.lastName || '' }}</div>
                    <div class="child-sub">Adm No: {{ child.admissionNumber }}</div>
                  </div>
                  <app-status-badge [type]="child.status === 'ACTIVE' ? 'active' : 'inactive'"></app-status-badge>
                </div>
              </div>
            </div>

            <div class="detail-card" *ngIf="selectedParent.notes">
              <h4 class="detail-section-title">Notes</h4>
              <p class="notes-text">{{ selectedParent.notes }}</p>
            </div>
          </ion-content>
        </ng-template>
      </ion-modal>

      <!-- Delete Confirmation Modal -->
      <ion-modal [isOpen]="isDeleteModalOpen" (didDismiss)="isDeleteModalOpen = false">
        <ng-template>
          <div class="delete-modal-box ion-padding">
            <ion-icon name="warning-outline" color="danger" class="warn-icon"></ion-icon>
            <h3>Delete Parent Record?</h3>
            <p>Are you sure you want to delete <strong>{{ parentToDelete?.name }}</strong>? This action cannot be undone.</p>
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
    .parents-page {
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

    .user-cell {
      display: flex;
      align-items: center;
      gap: 12px;

      .avatar-circle {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: linear-gradient(135deg, #4f46e5, #818cf8);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 14px;
      }

      .name-text {
        font-weight: 600;
        color: #0f172a;
      }

      .sub-text {
        font-size: 12px;
        color: #64748b;
      }
    }

    .relationship-badge {
      font-size: 11px;
      padding: 4px 8px;
      border-radius: 6px;
    }

    .children-count {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      color: #4f46e5;
      font-weight: 600;

      &:hover { text-decoration: underline; }
    }

    .cards-list {
      .parent-card {
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
            background: linear-gradient(135deg, #4f46e5, #818cf8);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
          }

          .parent-name {
            margin: 0;
            font-size: 15px;
            font-weight: 700;
            color: #0f172a;
          }

          .relationship-tag {
            font-size: 11px;
            color: #64748b;
          }
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

        .form-section-title {
          margin: 0 0 12px 0;
          font-size: 14px;
          font-weight: 700;
          color: #1e293b;
        }

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

          &.full-width {
            grid-column: 1 / -1;
          }
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
        background: linear-gradient(135deg, #4f46e5, #818cf8);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        font-weight: 700;
      }

      .profile-title {
        h3 { margin: 0 0 4px 0; font-size: 18px; font-weight: 700; }
        .relationship-pill { font-size: 12px; background: #e0e7ff; color: #4338ca; padding: 2px 8px; border-radius: 4px; margin-right: 8px; }
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

      .children-list {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .child-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #f1f5f9;

          .child-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: #10b981;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            margin-right: 10px;
          }

          .child-info { flex: 1; }
          .child-name { font-size: 14px; font-weight: 600; color: #0f172a; }
          .child-sub { font-size: 12px; color: #64748b; }
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
export class ParentsPage implements OnInit {
  private parentService = inject(ParentService);
  private studentService = inject(StudentService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  parents: Parent[] = [];
  availableStudents: Student[] = [];
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

  statusOptions: FilterOption[] = [
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Inactive', value: 'INACTIVE' }
  ];

  isFormModalOpen = false;
  isDetailModalOpen = false;
  isDeleteModalOpen = false;

  editingParent: Parent | null = null;
  selectedParent: Parent | null = null;
  parentToDelete: Parent | null = null;

  parentForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
    this.loadParents();
    this.loadStudentsForPicker();
  }

  initForm(): void {
    this.parentForm = this.fb.group({
      name: ['', [Validators.required]],
      relationship: ['FATHER', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+ -]{7,15}$/)]],
      alternatePhone: [''],
      email: ['', [Validators.email]],
      address: [''],
      city: [''],
      state: [''],
      status: ['ACTIVE'],
      children: [[]],
      notes: ['']
    });
  }

  loadParents(): void {
    this.loading = true;
    this.parentService.getParents(
      this.pagination.page,
      this.pagination.limit,
      this.searchQuery,
      this.selectedStatus
    ).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.parents = res.data;
          if (res.pagination) {
            this.pagination = res.pagination;
          }
        }
      },
      error: (err) => {
        this.loading = false;
        this.toastService.error(err.error?.message || 'Failed to load parents records');
      }
    });
  }

  loadStudentsForPicker(): void {
    this.studentService.getStudents(1, 100).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.availableStudents = res.data;
        }
      }
    });
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.pagination.page = 1;
    this.loadParents();
  }

  onFilterStatus(status: string): void {
    this.selectedStatus = status;
    this.pagination.page = 1;
    this.loadParents();
  }

  changePage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.pagination.totalPages) {
      this.pagination.page = newPage;
      this.loadParents();
    }
  }

  openFormModal(parent?: Parent): void {
    if (parent) {
      this.editingParent = parent;
      const linkedChildrenIds = (parent.children || []).map((c) => c._id);
      this.parentForm.patchValue({
        name: parent.name,
        relationship: parent.relationship || 'FATHER',
        phone: parent.phone,
        alternatePhone: parent.alternatePhone || '',
        email: parent.email || '',
        address: parent.address || '',
        city: parent.city || '',
        state: parent.state || '',
        status: parent.status || 'ACTIVE',
        children: linkedChildrenIds,
        notes: parent.notes || ''
      });
    } else {
      this.editingParent = null;
      this.parentForm.reset({
        relationship: 'FATHER',
        status: 'ACTIVE',
        children: []
      });
    }
    this.isFormModalOpen = true;
  }

  closeFormModal(): void {
    this.isFormModalOpen = false;
    this.editingParent = null;
  }

  saveParent(): void {
    if (this.parentForm.invalid) return;

    this.submitting = true;
    const formVal = this.parentForm.value;

    if (this.editingParent) {
      this.parentService.updateParent(this.editingParent._id, formVal).subscribe({
        next: (res) => {
          this.submitting = false;
          if (res.success) {
            this.toastService.success('Parent profile updated successfully');
            this.closeFormModal();
            this.loadParents();
          }
        },
        error: (err) => {
          this.submitting = false;
          this.toastService.error(err.error?.message || 'Failed to update parent record');
        }
      });
    } else {
      this.parentService.createParent(formVal).subscribe({
        next: (res) => {
          this.submitting = false;
          if (res.success) {
            this.toastService.success('New parent record created successfully');
            this.closeFormModal();
            this.loadParents();
          }
        },
        error: (err) => {
          this.submitting = false;
          this.toastService.error(err.error?.message || 'Failed to create parent record');
        }
      });
    }
  }

  viewDetail(parent: Parent): void {
    this.selectedParent = parent;
    this.isDetailModalOpen = true;
  }

  closeDetailModal(): void {
    this.isDetailModalOpen = false;
    this.selectedParent = null;
  }

  toggleStatus(parent: Parent): void {
    const newStatus = parent.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    this.parentService.updateParentStatus(parent._id, newStatus).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastService.success(`Parent status updated to ${newStatus}`);
          this.loadParents();
        }
      },
      error: (err) => {
        this.toastService.error(err.error?.message || 'Failed to change parent status');
      }
    });
  }

  confirmDelete(parent: Parent): void {
    this.parentToDelete = parent;
    this.isDeleteModalOpen = true;
  }

  executeDelete(): void {
    if (!this.parentToDelete) return;

    this.parentService.deleteParent(this.parentToDelete._id).subscribe({
      next: (res) => {
        this.isDeleteModalOpen = false;
        if (res.success) {
          this.toastService.success('Parent record deleted successfully');
          this.loadParents();
        }
      },
      error: (err) => {
        this.isDeleteModalOpen = false;
        this.toastService.error(err.error?.message || 'Failed to delete parent record');
      }
    });
  }

  getChildrenNames(parent: Parent): string {
    if (!parent.children || parent.children.length === 0) return 'None';
    return parent.children.map((c) => `${c.firstName} ${c.lastName || ''}`).join(', ');
  }
}
