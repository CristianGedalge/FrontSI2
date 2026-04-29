import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MecanicoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/mecanicos/`;

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  crear(datos: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, datos, { headers: this.getHeaders() });
  }

  actualizar(id: number, datos: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, datos, { headers: this.getHeaders() });
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
