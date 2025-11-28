import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private baseUrl = 'http://127.0.0.1:8000';

  // guarda o usuário atual
  private currentUserSubject = new BehaviorSubject<any | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // ao iniciar o serviço, tenta restaurar o usuário salvo no localStorage
    if (isPlatformBrowser(this.platformId)) {
      const userJson = localStorage.getItem('user');
      if (userJson) {
        this.currentUserSubject.next(JSON.parse(userJson));
      }
    }
  }

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

  /** Busca o perfil no backend e já salva no serviço + localStorage */
  loadUserProfile(): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) return of(null);

    return this.http.get(`${this.baseUrl}/usuario/me`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap((user: any) => {
        this.currentUserSubject.next(user);
        localStorage.setItem('user', JSON.stringify(user));
      })
    );
  }

  /** Acesso rápido ao usuário atual (sincrono) */
  getCurrentUser(): any | null {
    return this.currentUserSubject.value;
  }

  /** Atualizar perfil mantendo estado */
  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/usuario/atualizar`, data, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap((userAtualizado: any) => {
        this.currentUserSubject.next(userAtualizado);
        localStorage.setItem('user', JSON.stringify(userAtualizado));
      })
    );
  }

  updatePassword(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/usuario/senha`, data, {
      headers: this.getAuthHeaders()
    });
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.currentUserSubject.next(null);
  }
}
