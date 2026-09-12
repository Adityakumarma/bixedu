import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonBadge,
  IonSpinner
} from '@ionic/angular';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ResponsiveTableComponent } from '../../shared/components/responsive-table/responsive-table.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { AttendanceService } from '../../core/services/attendance.service';
import { BatchService } from '../../core/services/batch.service';
import { ToastService } from '../../core/services/toast.service';
import { Batch } from '../../core/models/batch.model';
import {
  StudentAttendanceItem,
  AttendanceRecord,
  AttendanceStatus
} from '../../core/models/attendance.model';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageHeaderComponent,
    EmptyStateComponent,
    ResponsiveTableComponent,
    LoadingSpinnerComponent,
    IonButton,
    IonIcon,
    IonSelect,
    IonSelectOption,
    IonSpinner
  ],
  template: `
    <div class="attendance-page">
      <app-page-header
        title="Attendance Management"
        subtitle="Record daily student attendance by batch, track absentees, and inspect historical registers"
        icon="calendar-outline">
        <div actions class="view-tabs">
          <button
            class="tab-btn"
            [class.active]="activeTab === 'MARK'"
            (click)="switchTab('MARK')">
            <ion-icon name="checkmark-done-outline"></ion-icon>
            Mark Attendance
          </button>
          <button
            class="tab-btn"
            [class.active]="activeTab === 'HISTORY'"
            (click)="switchTab('HISTORY')">
            <ion-icon name="time-outline"></ion-icon>
            Attendance History
          </button>
        </div>
      </app-page-header>

      <!-- TAB 1: MARK ATTENDANCE VIEW -->
      <div *ngIf="activeTab === 'MARK'" class="mark-attendance-container">
        <!-- Control Bar: Batch Selector & Date Picker -->
        <div class="control-card">
          <div class="selector-group">
            <label>Select Batch *</label>
            <ion-select
              [(ngModel)]="selectedBatchId"
              (ionChange)="onBatchOrDateChange()"
              interface="popover"
              placeholder="Choose active batch">
              <ion-select-option *ngFor="let b of batches" [value]="b._id">
                {{ b.name }} ({{ b.code || 'BATCH' }})
              </ion-select-option>
            </ion-select>
          </div>

          <div class="selector-group">
            <label>Attendance Date *</label>
            <input
              type="date"
              class="native-date-input"
              [(ngModel)]="selectedDate"
              (change)="onBatchOrDateChange()" />
          </div>

          <div class="quick-actions-bar" *ngIf="attendanceRecords.length > 0">
            <ion-button fill="outline" color="success" size="small" (click)="markAll('PRESENT')">
              <ion-icon slot="start" name="checkmark-circle-outline"></ion-icon>
              All Present
            </ion-button>
            <ion-button fill="outline" color="danger" size="small" (click)="markAll('ABSENT')">
              <ion-icon slot="start" name="close-circle-outline"></ion-icon>
              All Absent
            </ion-button>
            <ion-button fill="outline" color="medium" size="small" (click)="resetMarkings()">
              <ion-icon slot="start" name="refresh-outline"></ion-icon>
              Reset
            </ion-button>
          </div>
        </div>

        <!-- Real-time Stats Breakdown Bar -->
        <div class="stats-summary-bar" *ngIf="selectedBatchId && attendanceRecords.length > 0">
          <div class="stat-pill total">
            <span class="num">{{ attendanceRecords.length }}</span>
            <span class="lbl">Total Enrolled</span>
          </div>
          <div class="stat-pill present">
            <span class="num">{{ presentCount }} ({{ attendanceRate }}%)</span>
            <span class="lbl">Present</span>
          </div>
          <div class="stat-pill absent">
            <span class="num">{{ absentCount }}</span>
            <span class="lbl">Absent</span>
          </div>
          <div class="stat-pill late">
            <span class="num">{{ lateCount }}</span>
            <span class="lbl">Late</span>
          </div>
        </div>

        <!-- Loading State -->
        <app-loading-spinner *ngIf="loading" message="Loading batch student register..."></app-loading-spinner>

        <!-- Empty Batch / Selection State -->
        <div *ngIf="!loading && !selectedBatchId">
          <app-empty-state
            title="Select a batch to mark attendance"
            description="Choose a coaching batch and calendar date from the controls above to load the student list."
            icon="calendar-clear-outline">
          </app-empty-state>
        </div>

        <div *ngIf="!loading && selectedBatchId && attendanceRecords.length === 0">
          <app-empty-state
            title="No students enrolled in this batch"
            description="Go to Student Management to assign students to this batch before marking attendance."
            icon="people-outline">
          </app-empty-state>
        </div>

        <!-- Student Attendance List (Desktop Table & Mobile Touch Cards) -->
        <div *ngIf="!loading && attendanceRecords.length > 0">
          <!-- Desktop Table View -->
          <app-responsive-table class="desktop-only">
            <table class="bixedu-table data-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Admission No</th>
                  <th>Contact Phone</th>
                  <th style="text-align: center;">Mark Attendance Status</th>
                  <th>Remarks (Optional)</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of attendanceRecords" [class.row-absent]="item.status === 'ABSENT'" [class.row-late]="item.status === 'LATE'">
                  <td>
                    <div class="student-cell">
                      <div class="avatar-circle">
                        {{ item.student.firstName.charAt(0).toUpperCase() }}
                      </div>
                      <div class="student-name">
                        {{ item.student.firstName }} {{ item.student.lastName || '' }}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="adm-badge">{{ item.student.admissionNumber || 'N/A' }}</span>
                  </td>
                  <td>{{ item.student.phone || 'N/A' }}</td>
                  <td style="text-align: center;">
                    <div class="status-toggle-group">
                      <button
                        type="button"
                        class="toggle-btn btn-present"
                        [class.active]="item.status === 'PRESENT'"
                        (click)="setStatus(item, 'PRESENT')">
                        ✓ Present
                      </button>
                      <button
                        type="button"
                        class="toggle-btn btn-absent"
                        [class.active]="item.status === 'ABSENT'"
                        (click)="setStatus(item, 'ABSENT')">
                        ✕ Absent
                      </button>
                      <button
                        type="button"
                        class="toggle-btn btn-late"
                        [class.active]="item.status === 'LATE'"
                        (click)="setStatus(item, 'LATE')">
                        ⏱ Late
                      </button>
                    </div>
                  </td>
                  <td>
                    <input
                      type="text"
                      class="remarks-input"
                      [(ngModel)]="item.remarks"
                      placeholder="Add note..." (change)="hasUnsavedChanges = true" />
                  </td>
                </tr>
              </tbody>
            </table>
          </app-responsive-table>

          <!-- Mobile Cards View -->
          <div class="mobile-only cards-list">
            <div
              class="attendance-card"
              *ngFor="let item of attendanceRecords"
              [class.card-absent]="item.status === 'ABSENT'"
              [class.card-late]="item.status === 'LATE'">
              <div class="card-header">
                <div class="student-cell">
                  <div class="avatar-circle">
                    {{ item.student.firstName.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <h4 class="student-name">{{ item.student.firstName }} {{ item.student.lastName || '' }}</h4>
                    <span class="adm-text">{{ item.student.admissionNumber || 'N/A' }}</span>
                  </div>
                </div>
              </div>

              <div class="status-toggle-group full-width">
                <button
                  type="button"
                  class="toggle-btn btn-present"
                  [class.active]="item.status === 'PRESENT'"
                  (click)="setStatus(item, 'PRESENT')">
                  ✓ Present
                </button>
                <button
                  type="button"
                  class="toggle-btn btn-absent"
                  [class.active]="item.status === 'ABSENT'"
                  (click)="setStatus(item, 'ABSENT')">
                  ✕ Absent
                </button>
                <button
                  type="button"
                  class="toggle-btn btn-late"
                  [class.active]="item.status === 'LATE'"
                  (click)="setStatus(item, 'LATE')">
                  ⏱ Late
                </button>
              </div>

              <input
                type="text"
                class="remarks-input"
                [(ngModel)]="item.remarks"
                placeholder="Optional remarks..." (change)="hasUnsavedChanges = true" />
            </div>
          </div>

          <!-- Sticky Save Bar -->
          <div class="sticky-save-bar">
            <div class="save-info">
              <span *ngIf="hasUnsavedChanges" class="unsaved-warning">● Unsaved attendance changes</span>
              <span *ngIf="!hasUnsavedChanges" class="saved-info">Saved for {{ selectedDate }}</span>
            </div>
            <ion-button color="primary" class="save-btn" [disabled]="saving" (click)="saveAttendance()">
              <ion-spinner name="crescent" *ngIf="saving"></ion-spinner>
              <span *ngIf="!saving">Save Attendance Register</span>
            </ion-button>
          </div>
        </div>
      </div>

      <!-- TAB 2: ATTENDANCE HISTORY VIEW -->
      <div *ngIf="activeTab === 'HISTORY'" class="history-container">
        <!-- History Filter Bar -->
        <div class="control-card history-filters">
          <div class="filter-item">
            <label>Filter by Batch</label>
            <ion-select
              [(ngModel)]="historyFilterBatchId"
              (ionChange)="loadHistory()"
              interface="popover"
              placeholder="All Batches">
              <ion-select-option value="">All Batches</ion-select-option>
              <ion-select-option *ngFor="let b of batches" [value]="b._id">
                {{ b.name }}
              </ion-select-option>
            </ion-select>
          </div>

          <div class="filter-item">
            <label>Filter by Status</label>
            <ion-select
              [(ngModel)]="historyFilterStatus"
              (ionChange)="loadHistory()"
              interface="popover"
              placeholder="All Statuses">
              <ion-select-option value="">All Statuses</ion-select-option>
              <ion-select-option value="PRESENT">PRESENT</ion-select-option>
              <ion-select-option value="ABSENT">ABSENT</ion-select-option>
              <ion-select-option value="LATE">LATE</ion-select-option>
            </ion-select>
          </div>

          <div class="filter-item">
            <label>Date Range</label>
            <input
              type="date"
              class="native-date-input"
              [(ngModel)]="historyFilterDate"
              (change)="loadHistory()" />
          </div>
        </div>

        <app-loading-spinner *ngIf="loadingHistory" message="Fetching attendance history..."></app-loading-spinner>

        <div *ngIf="!loadingHistory">
          <app-empty-state
            *ngIf="historyList.length === 0"
            title="No history records found"
            description="No student attendance entries match the selected filters."
            icon="calendar-outline">
          </app-empty-state>

          <app-responsive-table *ngIf="historyList.length > 0">
            <table class="bixedu-table data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Student Name</th>
                  <th>Batch Name</th>
                  <th>Status</th>
                  <th>Marked By</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let rec of historyList">
                  <td>
                    <span class="date-text">{{ rec.date | date:'mediumDate' }}</span>
                  </td>
                  <td>
                    <div class="student-name">
                      {{ getStudentName(rec.studentId) }}
                    </div>
                  </td>
                  <td>
                    <span class="batch-name-tag">{{ getBatchName(rec.batchId) }}</span>
                  </td>
                  <td>
                    <span
                      class="status-pill-badge"
                      [class.p-present]="rec.status === 'PRESENT'"
                      [class.p-absent]="rec.status === 'ABSENT'"
                      [class.p-late]="rec.status === 'LATE'">
                      {{ rec.status }}
                    </span>
                  </td>
                  <td>
                    <span class="marked-by-text">{{ getMarkedByName(rec.markedBy) }}</span>
                  </td>
                  <td>{{ rec.remarks || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </app-responsive-table>

          <div class="pagination-bar" *ngIf="historyPagination.totalPages > 1">
            <span>Showing page {{ historyPagination.page }} of {{ historyPagination.totalPages }} ({{ historyPagination.total }} records)</span>
            <div class="pagination-buttons">
              <ion-button fill="outline" size="small" [disabled]="historyPagination.page === 1" (click)="changeHistoryPage(historyPagination.page - 1)">
                Previous
              </ion-button>
              <span class="page-num">{{ historyPagination.page }}</span>
              <ion-button fill="outline" size="small" [disabled]="historyPagination.page === historyPagination.totalPages" (click)="changeHistoryPage(historyPagination.page + 1)">
                Next
              </ion-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .attendance-page {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .view-tabs {
      display: flex;
      gap: 8px;

      .tab-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        background: var(--bixedu-bg-alt, #f1f5f9);
        color: #475569;
        border: 1px solid #cbd5e1;
        padding: 8px 16px;
        border-radius: 10px;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s ease;

        &.active, &:hover {
          background: #4f46e5;
          color: white;
          border-color: #4f46e5;
        }
      }
    }

    .control-card {
      background: white;
      border-radius: 14px;
      padding: 16px 20px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      gap: 16px;
      margin-bottom: 16px;

      .selector-group, .filter-item {
        display: flex;
        flex-direction: column;
        gap: 6px;
        flex: 1;
        min-width: 200px;

        label {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          color: #64748b;
          letter-spacing: 0.04em;
        }

        ion-select {
          --background: #ffffff;
          --border-radius: 10px;
          --padding-start: 12px;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          min-height: 42px;
        }

        .native-date-input {
          height: 42px;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          padding: 0 12px;
          font-size: 14px;
          font-family: inherit;
          color: #0f172a;
          background: white;
          outline: none;
        }
      }

      .quick-actions-bar {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
    }

    .stats-summary-bar {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-bottom: 16px;

      @media (min-width: 640px) {
        grid-template-columns: repeat(4, 1fr);
      }

      .stat-pill {
        background: white;
        border-radius: 12px;
        padding: 12px 16px;
        border: 1px solid #e2e8f0;
        display: flex;
        flex-direction: column;
        gap: 2px;
        box-shadow: 0 1px 2px rgba(0,0,0,0.04);

        .num { font-size: 18px; font-weight: 800; }
        .lbl { font-size: 12px; color: #64748b; font-weight: 600; }

        &.total .num { color: #3b82f6; }
        &.present .num { color: #10b981; }
        &.absent .num { color: #ef4444; }
        &.late .num { color: #f59e0b; }
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
        padding: 12px 16px;
        border-bottom: 1px solid #f1f5f9;
        vertical-align: middle;
      }

      tr.row-absent td { background: #fef2f2; }
      tr.row-late td { background: #fffbeb; }
    }

    .student-cell {
      display: flex;
      align-items: center;
      gap: 10px;

      .avatar-circle {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: #4f46e5;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 14px;
      }

      .student-name { font-weight: 700; color: #0f172a; }
      .adm-text { font-size: 11px; color: #64748b; font-family: monospace; }
    }

    .adm-badge {
      background: #f1f5f9;
      padding: 4px 8px;
      border-radius: 6px;
      font-family: monospace;
      font-weight: 700;
      color: #334155;
    }

    .status-toggle-group {
      display: inline-flex;
      background: #f1f5f9;
      padding: 4px;
      border-radius: 10px;
      gap: 4px;

      &.full-width {
        display: flex;
        width: 100%;

        .toggle-btn { flex: 1; text-align: center; justify-content: center; }
      }

      .toggle-btn {
        border: none;
        background: transparent;
        color: #64748b;
        padding: 6px 14px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;

        &.btn-present.active { background: #10b981; color: white; }
        &.btn-absent.active { background: #ef4444; color: white; }
        &.btn-late.active { background: #f59e0b; color: white; }
      }
    }

    .remarks-input {
      width: 100%;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 6px 10px;
      font-size: 13px;
      outline: none;
      background: white;

      &:focus { border-color: #4f46e5; }
    }

    .cards-list {
      .attendance-card {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 14px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.04);

        &.card-absent { border-color: #fca5a5; background: #fef2f2; }
        &.card-late { border-color: #fde68a; background: #fffbeb; }
      }
    }

    .sticky-save-bar {
      position: sticky;
      bottom: 16px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 12px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      margin-top: 20px;
      z-index: 100;

      .unsaved-warning { font-size: 13px; font-weight: 700; color: #ef4444; }
      .saved-info { font-size: 13px; color: #10b981; font-weight: 600; }
      .save-btn { --border-radius: 10px; font-weight: 700; }
    }

    .status-pill-badge {
      display: inline-block;
      font-size: 12px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 12px;

      &.p-present { background: rgba(16, 185, 129, 0.1); color: #10b981; }
      &.p-absent { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
      &.p-late { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
    }

    .date-text { font-weight: 700; color: #0f172a; }
    .batch-name-tag { font-weight: 600; color: #4f46e5; }
    .marked-by-text { font-size: 13px; color: #64748b; }

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
      margin-top: 16px;

      .pagination-buttons { display: flex; align-items: center; gap: 8px; }
      .page-num { font-weight: 700; color: #0f172a; }
    }
  `]
})
export class AttendancePage implements OnInit {
  private attendanceService = inject(AttendanceService);
  private batchService = inject(BatchService);
  private toastService = inject(ToastService);

  activeTab: 'MARK' | 'HISTORY' = 'MARK';

  batches: Batch[] = [];
  selectedBatchId = '';
  selectedDate = new Date().toISOString().substring(0, 10);

  attendanceRecords: StudentAttendanceItem[] = [];
  loading = false;
  saving = false;
  hasUnsavedChanges = false;

  // History tab properties
  historyList: AttendanceRecord[] = [];
  loadingHistory = false;
  historyFilterBatchId = '';
  historyFilterStatus = '';
  historyFilterDate = '';
  historyPagination = { page: 1, limit: 20, total: 0, totalPages: 1 };

  ngOnInit(): void {
    this.loadBatches();
  }

  loadBatches(): void {
    this.batchService.getBatches(1, 100, '', 'ACTIVE').subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.batches = res.data;
          if (this.batches.length > 0) {
            this.selectedBatchId = this.batches[0]._id;
            this.loadBatchStudentsAttendance();
          }
        }
      }
    });
  }

  switchTab(tab: 'MARK' | 'HISTORY'): void {
    this.activeTab = tab;
    if (tab === 'HISTORY' && this.historyList.length === 0) {
      this.loadHistory();
    }
  }

  onBatchOrDateChange(): void {
    if (!this.selectedBatchId) return;
    this.loadBatchStudentsAttendance();
  }

  loadBatchStudentsAttendance(): void {
    if (!this.selectedBatchId) return;
    this.loading = true;
    this.hasUnsavedChanges = false;

    this.attendanceService.getBatchAttendance(this.selectedBatchId, this.selectedDate).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.attendanceRecords = res.data.records.map(r => ({
            ...r,
            status: r.status || 'PRESENT',
            remarks: r.remarks || ''
          }));
        }
      },
      error: (err) => {
        this.loading = false;
        this.toastService.error(err.error?.message || 'Failed to load batch register');
      }
    });
  }

  setStatus(item: StudentAttendanceItem, status: AttendanceStatus): void {
    item.status = status;
    this.hasUnsavedChanges = true;
  }

  markAll(status: AttendanceStatus): void {
    for (const item of this.attendanceRecords) {
      item.status = status;
    }
    this.hasUnsavedChanges = true;
  }

  resetMarkings(): void {
    this.loadBatchStudentsAttendance();
  }

  get presentCount(): number {
    return this.attendanceRecords.filter(r => r.status === 'PRESENT').length;
  }

  get absentCount(): number {
    return this.attendanceRecords.filter(r => r.status === 'ABSENT').length;
  }

  get lateCount(): number {
    return this.attendanceRecords.filter(r => r.status === 'LATE').length;
  }

  get attendanceRate(): number {
    if (this.attendanceRecords.length === 0) return 0;
    return Math.round(((this.presentCount + this.lateCount) / this.attendanceRecords.length) * 100);
  }

  saveAttendance(): void {
    if (!this.selectedBatchId) {
      this.toastService.warning('Please select a batch first');
      return;
    }

    this.saving = true;
    const payload = {
      batchId: this.selectedBatchId,
      date: this.selectedDate,
      records: this.attendanceRecords.map(r => ({
        studentId: r.student._id,
        status: r.status,
        remarks: r.remarks || ''
      }))
    };

    this.attendanceService.saveBatchAttendance(payload).subscribe({
      next: (res) => {
        this.saving = false;
        if (res.success) {
          this.hasUnsavedChanges = false;
          this.toastService.success(`Attendance register saved successfully (${res.data?.count || 0} students)`);
        }
      },
      error: (err) => {
        this.saving = false;
        this.toastService.error(err.error?.message || 'Failed to save attendance register');
      }
    });
  }

  // History Tab Methods
  loadHistory(): void {
    this.loadingHistory = true;
    this.attendanceService
      .getAttendanceHistory({
        batchId: this.historyFilterBatchId,
        status: this.historyFilterStatus,
        date: this.historyFilterDate,
        page: this.historyPagination.page,
        limit: this.historyPagination.limit
      })
      .subscribe({
        next: (res) => {
          this.loadingHistory = false;
          if (res.success && res.data) {
            this.historyList = res.data;
            if (res.pagination) {
              this.historyPagination = res.pagination;
            }
          }
        },
        error: (err) => {
          this.loadingHistory = false;
          this.toastService.error(err.error?.message || 'Failed to load attendance history');
        }
      });
  }

  changeHistoryPage(page: number): void {
    this.historyPagination.page = page;
    this.loadHistory();
  }

  getStudentName(studentObj: any): string {
    if (!studentObj) return 'N/A';
    if (typeof studentObj === 'string') return studentObj;
    return `${studentObj.firstName || ''} ${studentObj.lastName || ''}`.trim() || 'Student';
  }

  getBatchName(batchObj: any): string {
    if (!batchObj) return 'Batch';
    if (typeof batchObj === 'string') return batchObj;
    return batchObj.name || 'Batch';
  }

  getMarkedByName(userObj: any): string {
    if (!userObj) return 'System';
    if (typeof userObj === 'string') return userObj;
    return userObj.name || 'Admin/Teacher';
  }
}
