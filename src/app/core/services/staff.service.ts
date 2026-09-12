import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse, PaginatedApiResponse } from '../models/api-response.model';
import { Staff, CreateStaffPayload, UpdateStaffPayload } from '../models/staff.model';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  private apiService = inject(ApiService);

  getStaffList(params?: { search?: string; status?: string; page?: number; limit?: number }): Observable<PaginatedApiResponse<Staff>> {
    return this.apiService.get<Staff[]>('/staff', params) as Observable<PaginatedApiResponse<Staff>>;
  }

  getStaffById(id: string): Observable<ApiResponse<Staff>> {
    return this.apiService.get<Staff>(`/staff/${id}`);
  }

  createStaff(payload: CreateStaffPayload): Observable<ApiResponse<Staff>> {
    return this.apiService.post<Staff>('/staff', payload);
  }

  updateStaff(id: string, payload: UpdateStaffPayload): Observable<ApiResponse<Staff>> {
    return this.apiService.put<Staff>(`/staff/${id}`, payload);
  }

  updateStaffStatus(id: string, status: 'ACTIVE' | 'INACTIVE'): Observable<ApiResponse<Staff>> {
    return this.apiService.patch<Staff>(`/staff/${id}/status`, { status });
  }

  deleteStaff(id: string): Observable<ApiResponse<{ id: string }>> {
    return this.apiService.delete<{ id: string }>(`/staff/${id}`);
  }
}
