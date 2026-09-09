import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of, tap, catchError } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';
import { User, UserRole } from '../models/user.model';
import { LoginCredentials, LoginResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiService = inject(ApiService);
  private storageService = inject(StorageService);
  private router = inject(Router);

  private currentUserSubject = new BehaviorSubject<User | null>(this.storageService.getUser<User>());
  public currentUser$ = this.currentUserSubject.asObservable();

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get isAuthenticated(): boolean {
    return !!this.storageService.getToken() && !!this.currentUserValue;
  }

  login(credentials: LoginCredentials): Observable<any> {
    return this.apiService.post<LoginResponse>('/auth/login', credentials).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.storageService.setToken(res.data.token);
          this.storageService.setUser(res.data.user);
          this.currentUserSubject.next(res.data.user);
        }
      })
    );
  }

  logout(): void {
    this.storageService.clear();
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  hasRole(...roles: UserRole[]): boolean {
    const user = this.currentUserValue;
    if (!user) return false;
    return roles.includes(user.role);
  }
}
