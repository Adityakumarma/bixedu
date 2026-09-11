import { Injectable, inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Student, StudentPayload } from '../models/student.model';
import { ApiResponse } from '../models/api-response.model';

export interface StudentListResponse {
  data: Student[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiService = inject(ApiService);

  getStudents(
    page: number = 1,
    limit: number = 20,
    search?: string,
    status?: string,
    batchId?: string
  ): Observable<ApiResponse<Student[]> & { pagination?: any }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (search) params = params.set('search', search);
    if (status) params = params.set('status', status);
    if (batchId) params = params.set('batchId', batchId);

    return this.apiService.get<Student[]>('/students', params);
  }

  getStudentById(id: string): Observable<ApiResponse<Student>> {
    return this.apiService.get<Student>(`/students/${id}`);
  }

  createStudent(payload: StudentPayload): Observable<ApiResponse<Student>> {
    return this.apiService.post<Student>('/students', payload);
  }

  updateStudent(id: string, payload: Partial<StudentPayload>): Observable<ApiResponse<Student>> {
    return this.apiService.put<Student>(`/students/${id}`, payload);
  }

  updateStudentStatus(id: string, status: 'ACTIVE' | 'INACTIVE'): Observable<ApiResponse<Student>> {
    return this.apiService.put<Student>(`/students/${id}/status`, { status });
  }

  deleteStudent(id: string): Observable<ApiResponse<{ id: string }>> {
    return this.apiService.delete<{ id: string }>(`/students/${id}`);
  }
}
