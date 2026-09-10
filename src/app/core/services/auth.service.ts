import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';
import { User, UserRole } from '../models/user.model';
import { Centre } from '../models/centre.model';
import { LoginCredentials, LoginResponse, RegisterPayload } from '../models/auth.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiService = inject(ApiService);
  private storageService = inject(StorageService);
  private router = inject(Router);

  private currentUserSubject = new BehaviorSubject<User | null>(this.storageService.getUser<User>());
  public currentUser$ = this.currentUserSubject.asObservable();

  private currentCentreSubject = new BehaviorSubject<Centre | null>(this.storageService.getCentre<Centre>());
  public currentCentre$ = this.currentCentreSubject.asObservable();

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get currentCentreValue(): Centre | null {
    return this.currentCentreSubject.value;
  }

  public get isAuthenticated(): boolean {
    return !!this.storageService.getToken() && !!this.currentUserValue;
  }

  register(payload: RegisterPayload): Observable<ApiResponse<LoginResponse>> {
    return this.apiService.post<LoginResponse>('/auth/register', payload).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.storageService.setToken(res.data.token);
          this.storageService.setUser(res.data.user);
          this.currentUserSubject.next(res.data.user);
          if (res.data.centre) {
            this.storageService.setCentre(res.data.centre);
            this.currentCentreSubject.next(res.data.centre);
          }
        }
      })
    );
  }

  login(credentials: LoginCredentials): Observable<ApiResponse<LoginResponse>> {
    return this.apiService.post<LoginResponse>('/auth/login', credentials).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.storageService.setToken(res.data.token);
          this.storageService.setUser(res.data.user);
          this.currentUserSubject.next(res.data.user);
          if (res.data.centre) {
            this.storageService.setCentre(res.data.centre);
            this.currentCentreSubject.next(res.data.centre);
          }
        }
      })
    );
  }

  getProfile(): Observable<ApiResponse<{ user: User; centre?: Centre }>> {
    return this.apiService.get<{ user: User; centre?: Centre }>('/auth/me').pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.storageService.setUser(res.data.user);
          this.currentUserSubject.next(res.data.user);
          if (res.data.centre) {
            this.storageService.setCentre(res.data.centre);
            this.currentCentreSubject.next(res.data.centre);
          }
        }
      })
    );
  }

  getCentre(): Observable<ApiResponse<{ centre: Centre }>> {
    return this.apiService.get<{ centre: Centre }>('/centres/me').pipe(
      tap((res) => {
        if (res.success && res.data?.centre) {
          this.storageService.setCentre(res.data.centre);
          this.currentCentreSubject.next(res.data.centre);
        }
      })
    );
  }

  updateCentre(data: Partial<Centre>): Observable<ApiResponse<{ centre: Centre }>> {
    return this.apiService.put<{ centre: Centre }>('/centres/me', data).pipe(
      tap((res) => {
        if (res.success && res.data?.centre) {
          this.storageService.setCentre(res.data.centre);
          this.currentCentreSubject.next(res.data.centre);
        }
      })
    );
  }

  logout(): void {
    this.storageService.clear();
    this.currentUserSubject.next(null);
    this.currentCentreSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  hasRole(...roles: UserRole[]): boolean {
    const user = this.currentUserValue;
    if (!user) return false;
    return roles.includes(user.role);
  }
}

