import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: WebSocket | null = null;
  private pingInterval: any = null;
  public emergencias$ = new Subject<any>();

  connect(tallerId: number) {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return; // Ya está conectado
    }

    const url = `${environment.wsUrl}/ws/${tallerId}`;
    console.log('[WebSocket] Intentando conectar a:', url);
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log(`[WebSocket] Conectado al canal del taller ${tallerId}`);
      // Enviar ping cada 25 segundos para mantener la conexión viva
      this.pingInterval = setInterval(() => {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
          this.socket.send('ping');
        }
      }, 25000);
    };

    this.socket.onmessage = (event) => {
      // Ignorar respuestas de pong
      if (event.data === 'pong') {
        return;
      }
      console.log('[WebSocket] Mensaje recibido del servidor:', event.data);
      try {
        const message = JSON.parse(event.data);
        if (message.evento === 'NUEVA_EMERGENCIA') {
          console.log('[WebSocket] Notificando a los componentes...');
          this.emergencias$.next(message.datos);
        }
      } catch (error) {
        console.error('[WebSocket] Error parseando mensaje', error);
      }
    };

    this.socket.onclose = (event) => {
      console.log(`[WebSocket] Conexión cerrada (code: ${event.code}, reason: ${event.reason})`);
      this.clearPing();
      // Intentar reconectar después de 3 segundos
      setTimeout(() => {
        console.log('[WebSocket] Intentando reconectar...');
        this.socket = null;
        this.connect(tallerId);
      }, 3000);
    };

    this.socket.onerror = (error) => {
      console.error('[WebSocket] Error', error);
    };
  }

  private clearPing() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  disconnect() {
    this.clearPing();
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}
