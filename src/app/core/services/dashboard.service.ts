import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.model';

export interface DashboardStats {
  totalStudents: number;
  activeBatches: number;
  totalParents: number;
  totalTeachers: number;
  pendingFeesAmount: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiService = inject(ApiService);

  getDashboardStats(): Observable<ApiResponse<DashboardStats>> {
    return this.apiService.get<DashboardStats>('/dashboard/stats');
  }
}
