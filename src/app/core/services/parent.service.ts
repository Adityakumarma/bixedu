import { Injectable, inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Parent, ParentPayload } from '../models/parent.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ParentService {
  private apiService = inject(ApiService);

  getParents(
    page: number = 1,
    limit: number = 20,
    search?: string,
    status?: string
  ): Observable<ApiResponse<Parent[]> & { pagination?: any }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (search) params = params.set('search', search);
    if (status) params = params.set('status', status);

    return this.apiService.get<Parent[]>('/parents', params);
  }

  getParentById(id: string): Observable<ApiResponse<Parent>> {
    return this.apiService.get<Parent>(`/parents/${id}`);
  }

  createParent(payload: ParentPayload): Observable<ApiResponse<Parent>> {
    return this.apiService.post<Parent>('/parents', payload);
  }

  updateParent(id: string, payload: Partial<ParentPayload>): Observable<ApiResponse<Parent>> {
    return this.apiService.put<Parent>(`/parents/${id}`, payload);
  }

  updateParentStatus(id: string, status: 'ACTIVE' | 'INACTIVE'): Observable<ApiResponse<Parent>> {
    return this.apiService.put<Parent>(`/parents/${id}/status`, { status });
  }

  deleteParent(id: string): Observable<ApiResponse<{ id: string }>> {
    return this.apiService.delete<{ id: string }>(`/parents/${id}`);
  }
}
