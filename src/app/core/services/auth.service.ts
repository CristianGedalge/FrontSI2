import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;

  // State using Signals
  currentUser = signal<any>(null);

  constructor() {
    this.checkSession();
  }

  registerAdmin(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register-admin`, data).pipe(
      tap((res: any) => {
        if (res.accessToken) {
          this.saveSession(res.accessToken);
        }
      })
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: any) => {
        if (res.access_token) {
          this.saveSession(res.access_token);
        }
      })
    );
  }

  private saveSession(token: string) {
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    this.currentUser.set(decoded);
  }

  private checkSession() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        this.currentUser.set(decoded);
      } catch (e) {
        localStorage.removeItem('token');
      }
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUser.set(null);
  }
}
