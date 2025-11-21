import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AcoesService {
  private baseUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

  getAcoesUsuario(): Observable<any[]> {
  if (typeof window === 'undefined') return new Observable<any[]>(); // evita erro no SSR

  const token = localStorage.getItem('token');
  if (!token) return new Observable<any[]>(); // retorna Observable vazio se não tiver token

  const headers = { Authorization: `Bearer ${token}` };
  return this.http.get<any[]>(`${this.baseUrl}/acoes/minhas`, { headers });
}

}
