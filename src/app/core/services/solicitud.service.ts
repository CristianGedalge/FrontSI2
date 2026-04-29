import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/solicitudes`;

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  listarPendientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pendientes`, { headers: this.getHeaders() });
  }

  aceptar(solicitudId: number, precioEstimado: number): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/${solicitudId}/aceptar`, 
      { precio_estimado: precioEstimado },
      { headers: this.getHeaders() }
    );
  }

  asignarMecanico(solicitudId: number, mecanicoId: number): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/${solicitudId}/asignar`,
      { mecanico_id: mecanicoId },
      { headers: this.getHeaders() }
    );
  }
}
