import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: WebSocket | null = null;
  public emergencias$ = new Subject<any>();

  connect(tallerId: number) {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return; // Ya está conectado
    }

    const url = `${environment.wsUrl}/ws/${tallerId}`;
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log(`[WebSocket] Conectado al canal del taller ${tallerId}`);
    };

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.evento === 'NUEVA_EMERGENCIA') {
          this.emergencias$.next(message.datos);
        }
      } catch (error) {
        console.error('[WebSocket] Error parseando mensaje', error);
      }
    };

    this.socket.onclose = () => {
      console.log('[WebSocket] Conexión cerrada');
    };

    this.socket.onerror = (error) => {
      console.error('[WebSocket] Error', error);
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}
