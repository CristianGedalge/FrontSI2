import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/reportes`;

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  obtenerReporteMecanicos(dias: number = 30): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mecanicos?dias=${dias}`, { headers: this.getHeaders() });
  }

  obtenerReporteServicios(dias: number = 30): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/servicios?dias=${dias}`, { headers: this.getHeaders() });
  }

  generarReporteIA(prompt: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/ia`, { prompt }, { headers: this.getHeaders() });
  }
}
