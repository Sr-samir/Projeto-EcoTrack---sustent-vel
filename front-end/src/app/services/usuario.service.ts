import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private baseUrl = 'http://127.0.0.1:8000';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private getAuthHeaders(): HttpHeaders {
    if (!isPlatformBrowser(this.platformId)) {
      return new HttpHeaders({ 'Content-Type': 'application/json' });
    }

    const token = localStorage.getItem('token') || '';

    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }

  getUserProfile(): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) return of(null);

    return this.http.get(`${this.baseUrl}/usuario/me`, {
      headers: this.getAuthHeaders()
    });
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/usuario/atualizar`, data, {
      headers: this.getAuthHeaders()
    });
  }

  updatePassword(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/usuario/senha`, data, {
      headers: this.getAuthHeaders()
    });
  }
}
