import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly TOKEN_KEY = 'bixedu_auth_token';
  private readonly USER_KEY = 'bixedu_user_data';
  private readonly CENTRE_KEY = 'bixedu_centre_data';

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getUser<T>(): T | null {
    const data = localStorage.getItem(this.USER_KEY);
    return data ? JSON.parse(data) : null;
  }

  setUser<T>(user: T): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  removeUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  getCentre<T>(): T | null {
    const data = localStorage.getItem(this.CENTRE_KEY);
    return data ? JSON.parse(data) : null;
  }

  setCentre<T>(centre: T): void {
    localStorage.setItem(this.CENTRE_KEY, JSON.stringify(centre));
  }

  removeCentre(): void {
    localStorage.removeItem(this.CENTRE_KEY);
  }

  clear(): void {
    localStorage.clear();
  }
}

