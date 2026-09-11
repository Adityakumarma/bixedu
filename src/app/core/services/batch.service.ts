import { Injectable, inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Batch, BatchPayload } from '../models/batch.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class BatchService {
  private apiService = inject(ApiService);

  getBatches(
    page: number = 1,
    limit: number = 20,
    search?: string,
    status?: string
  ): Observable<ApiResponse<Batch[]> & { pagination?: any }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (search) params = params.set('search', search);
    if (status) params = params.set('status', status);

    return this.apiService.get<Batch[]>('/batches', params);
  }

  getBatchById(id: string): Observable<ApiResponse<Batch>> {
    return this.apiService.get<Batch>(`/batches/${id}`);
  }

  createBatch(payload: BatchPayload): Observable<ApiResponse<Batch>> {
    return this.apiService.post<Batch>('/batches', payload);
  }

  updateBatch(id: string, payload: Partial<BatchPayload>): Observable<ApiResponse<Batch>> {
    return this.apiService.put<Batch>(`/batches/${id}`, payload);
  }

  updateBatchStatus(id: string, status: 'ACTIVE' | 'INACTIVE' | 'COMPLETED'): Observable<ApiResponse<Batch>> {
    return this.apiService.put<Batch>(`/batches/${id}/status`, { status });
  }

  deleteBatch(id: string): Observable<ApiResponse<{ id: string }>> {
    return this.apiService.delete<{ id: string }>(`/batches/${id}`);
  }

  assignStudentToBatch(batchId: string, studentId: string): Observable<ApiResponse<{ studentId: string; batchId: string }>> {
    return this.apiService.post<{ studentId: string; batchId: string }>(`/batches/${batchId}/students`, { studentId });
  }

  removeStudentFromBatch(batchId: string, studentId: string): Observable<ApiResponse<{ studentId: string; batchId: string }>> {
    return this.apiService.delete<{ studentId: string; batchId: string }>(`/batches/${batchId}/students/${studentId}`);
  }
}
