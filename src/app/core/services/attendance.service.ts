import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse, PaginatedApiResponse } from '../models/api-response.model';
import {
  AttendanceRecord,
  BatchAttendanceData,
  BatchAttendanceSavePayload,
  AttendanceHistoryFilter,
  AttendanceStats
} from '../models/attendance.model';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private apiService = inject(ApiService);

  saveBatchAttendance(payload: BatchAttendanceSavePayload): Observable<ApiResponse<{ batchId: string; date: string; count: number }>> {
    return this.apiService.post<{ batchId: string; date: string; count: number }>('/attendance/batch', payload);
  }

  getBatchAttendance(batchId: string, date?: string): Observable<ApiResponse<BatchAttendanceData>> {
    return this.apiService.get<BatchAttendanceData>(`/attendance/batch/${batchId}`, { date });
  }

  getAttendanceHistory(params?: AttendanceHistoryFilter): Observable<PaginatedApiResponse<AttendanceRecord>> {
    return this.apiService.get<AttendanceRecord[]>('/attendance/history', params) as Observable<PaginatedApiResponse<AttendanceRecord>>;
  }

  getAttendanceStats(params?: { batchId?: string; studentId?: string }): Observable<ApiResponse<AttendanceStats>> {
    return this.apiService.get<AttendanceStats>('/attendance/stats', params);
  }
}
