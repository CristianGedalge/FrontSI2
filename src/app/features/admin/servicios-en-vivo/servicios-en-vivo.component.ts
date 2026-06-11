import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitudService } from '../../../core/services/solicitud.service';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';
import * as L from 'leaflet';

@Component({
  selector: 'app-admin-servicios-en-vivo',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="space-y-8">
  <!-- Header -->
  <div class="flex justify-between items-end">
    <div>
      <h1 class="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
        Servicios en Vivo
        <span class="relative flex h-4 w-4">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
        </span>
      </h1>
      <p class="text-slate-500 font-medium">Emergencias activas que aún no han sido finalizadas o canceladas</p>
    </div>
    
    <button (click)="cargarEnVivo()" class="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl font-bold shadow-sm hover:bg-slate-50 flex items-center gap-2 transition-all active:scale-95">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
      Actualizar
    </button>
  </div>

  <!-- Table Card -->
  <div class="bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50/50 border-b border-slate-100">
            <th class="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">ID</th>
            <th class="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">Fecha</th>
            <th class="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">Servicio</th>
            <th class="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">Vehículo</th>
            <th class="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">Precio Est.</th>
            <th class="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">Estado</th>
            <th class="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr *ngFor="let sol of servicios()" class="hover:bg-slate-50/50 transition-colors group">
            <td class="px-6 py-4 font-bold text-slate-400 text-sm">#{{ sol.id }}</td>
            <td class="px-6 py-4">
              <p class="text-slate-700 font-bold text-sm">{{ sol.fecha_creacion | date:'dd/MM/yyyy' }}</p>
              <p class="text-slate-400 text-xs font-medium">{{ sol.fecha_creacion | date:'HH:mm' }}</p>
            </td>
            <td class="px-6 py-4">
              <span class="bg-purple-50 text-purple-600 px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap">
                {{ sol.nombre_servicio || 'General' }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex flex-col gap-1">
                <span class="bg-slate-100 px-2 py-1 rounded text-xs font-black text-slate-600 uppercase self-start">{{ sol.placa_vehiculo }}</span>
                <span class="text-[10px] text-slate-400 font-bold tracking-tight">{{ sol.vehiculo_marca }} {{ sol.vehiculo_modelo }}</span>
              </div>
            </td>
            <td class="px-6 py-4 font-black text-slate-700 text-sm">
              {{ sol.precio_estimado ? 'Bs. ' + sol.precio_estimado : 'Por definir' }}
            </td>
            <td class="px-6 py-4 flex flex-col gap-2 items-start">
              <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap"
                    [ngClass]="{
                      'bg-amber-50 text-amber-600': sol.estado === 'PUBLICADO' || sol.estado === 'PENDIENTE',
                      'bg-blue-50 text-blue-600': sol.estado === 'ACEPTADO',
                      'bg-green-50 text-green-600': sol.estado === 'ASIGNADO',
                      'bg-purple-50 text-purple-600': sol.estado === 'EN_CAMINO',
                      'bg-cyan-50 text-cyan-600': sol.estado === 'EN_SITIO'
                    }">
                {{ sol.estado }}
              </span>
              <span *ngIf="sol.estado_pago" class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap shadow-sm"
                    [ngClass]="{
                      'bg-amber-100 text-amber-700 border border-amber-200': sol.estado_pago === 'PENDIENTE'
                    }">
                Pago: {{ sol.estado_pago }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex justify-end items-center gap-1">
                <button (click)="verDetalles(sol)" class="text-slate-400 hover:text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-all" title="Ver detalles y Mapa">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>

          <!-- Empty State -->
          <tr *ngIf="servicios().length === 0">
            <td colspan="7" class="px-6 py-20 text-center">
              <div class="flex flex-col items-center gap-3">
                <div class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p class="text-slate-400 font-bold">¡Genial! No hay emergencias activas en este momento</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Modal Detalle con Mapa -->
  <div *ngIf="solicitudSeleccionada()" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-opacity">
    <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all flex flex-col max-h-[90vh]">
      <!-- Header Modal -->
      <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h3 class="text-lg font-black text-slate-800 flex items-center gap-2">
          <span class="relative flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          Rastreo en Vivo - Servicio #{{ solicitudSeleccionada()?.id }}
        </h3>
        <button (click)="cerrarDetalles()" class="text-slate-400 hover:text-slate-600 transition-colors bg-white rounded-full p-1 shadow-sm border border-slate-200">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Body Modal -->
      <div class="p-6 space-y-4 overflow-y-auto">
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clip-rule="evenodd" /></svg>
            </div>
            <div>
              <p class="text-[10px] uppercase font-black tracking-wider text-slate-400 mb-0.5">Cliente</p>
              <p class="font-bold text-slate-700 text-sm truncate" [title]="solicitudSeleccionada()?.cliente_nombre || 'No disponible'">
                {{ solicitudSeleccionada()?.cliente_nombre || 'Desconocido' }}
              </p>
            </div>
          </div>
          <div class="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 1 1 6 0h3a3 3 0 1 1 6 0h.375c1.036 0 1.875-.84 1.875-1.875V15H13.5z" /></svg>
            </div>
            <div>
              <p class="text-[10px] uppercase font-black tracking-wider text-slate-400 mb-0.5">Mecánico</p>
              <p class="font-bold text-slate-700 text-sm truncate" [title]="solicitudSeleccionada()?.nombre_mecanico || 'No disponible'">
                {{ solicitudSeleccionada()?.nombre_mecanico || 'Sin asignar' }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
          <p class="text-[10px] uppercase font-black tracking-wider text-blue-400 mb-2">Descripción del problema</p>
          <p class="text-sm text-slate-600 leading-relaxed font-medium">
            {{ solicitudSeleccionada()?.descripcion || 'Sin descripción proporcionada.' }}
          </p>
        </div>

        <!-- Detalles extendidos (Fechas y Vehículo) -->
        <div class="grid grid-cols-2 gap-4">
          <!-- Fechas -->
          <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
            <p class="text-[10px] uppercase font-black tracking-wider text-slate-400">Trazabilidad del Servicio</p>
            <div class="space-y-2">
              <div class="flex justify-between items-center border-b border-slate-100 pb-1">
                <span class="text-xs font-medium text-slate-500">Creación</span>
                <span class="text-xs font-bold text-slate-700">{{ (solicitudSeleccionada()?.fecha_creacion | date:'short') || '-' }}</span>
              </div>
              <div class="flex justify-between items-center border-b border-slate-100 pb-1">
                <span class="text-xs font-medium text-slate-500">Aceptado</span>
                <span class="text-xs font-bold text-slate-700">{{ (solicitudSeleccionada()?.fecha_aceptado | date:'shortTime') || '-' }}</span>
              </div>
              <div class="flex justify-between items-center border-b border-slate-100 pb-1">
                <span class="text-xs font-medium text-slate-500">En Camino</span>
                <span class="text-xs font-bold text-slate-700">{{ (solicitudSeleccionada()?.fecha_en_camino | date:'shortTime') || '-' }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-xs font-medium text-slate-500">En Sitio</span>
                <span class="text-xs font-bold text-slate-700">{{ (solicitudSeleccionada()?.fecha_en_sitio | date:'shortTime') || '-' }}</span>
              </div>
            </div>
          </div>

          <!-- Vehículo y Mecánico Info -->
          <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
            <p class="text-[10px] uppercase font-black tracking-wider text-slate-400">Datos del Vehículo</p>
            <div class="space-y-2">
              <div class="flex justify-between items-center border-b border-slate-100 pb-1">
                <span class="text-xs font-medium text-slate-500">Marca/Modelo</span>
                <span class="text-xs font-bold text-slate-700">{{ solicitudSeleccionada()?.vehiculo_marca }} {{ solicitudSeleccionada()?.vehiculo_modelo }}</span>
              </div>
              <div class="flex justify-between items-center border-b border-slate-100 pb-1">
                <span class="text-xs font-medium text-slate-500">Placa</span>
                <span class="text-xs font-bold text-slate-700">{{ solicitudSeleccionada()?.placa_vehiculo || '-' }}</span>
              </div>
              <div class="flex justify-between items-center border-b border-slate-100 pb-1">
                <span class="text-xs font-medium text-slate-500">Año / Color</span>
                <span class="text-xs font-bold text-slate-700">{{ solicitudSeleccionada()?.vehiculo_anio || '-' }} / {{ solicitudSeleccionada()?.vehiculo_color || '-' }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-xs font-medium text-slate-500">Servicio Req.</span>
                <span class="text-xs font-bold text-slate-700">{{ solicitudSeleccionada()?.nombre_servicio || '-' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Contenedor del Mapa en Vivo -->
        <div class="relative w-full h-[300px] rounded-2xl overflow-hidden border-2 border-slate-200 shadow-inner bg-slate-100 z-0 group">
          <div id="admin-live-map" class="w-full h-full"></div>
          
          <!-- Indicador de estado WS -->
          <div *ngIf="wsStatus() === 'connecting'" class="absolute inset-0 bg-slate-900/10 backdrop-blur-sm flex items-center justify-center z-[1000]">
            <span class="bg-white px-4 py-2 rounded-full text-xs font-bold text-slate-600 shadow-lg flex items-center gap-3">
              <svg class="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Conectando a satélite...
            </span>
          </div>
          <div *ngIf="wsStatus() === 'connected'" class="absolute top-3 right-3 z-[1000]">
            <span class="bg-green-500/90 backdrop-blur text-white px-3 py-1.5 rounded-full text-[10px] font-black shadow-md flex items-center gap-2 border border-green-400">
              <span class="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              EN VIVO
            </span>
          </div>
          <div *ngIf="wsStatus() === 'error'" class="absolute top-3 right-3 z-[1000]">
            <span class="bg-red-500/90 backdrop-blur text-white px-3 py-1.5 rounded-full text-[10px] font-black shadow-md flex items-center gap-2 border border-red-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              Sin señal GPS
            </span>
          </div>

          <!-- Botón centrar -->
          <button (click)="centrarMapa()" *ngIf="wsStatus() === 'connected'" class="absolute bottom-4 right-4 z-[1000] bg-white p-2 rounded-xl shadow-lg border border-slate-200 text-slate-600 hover:text-blue-500 hover:bg-blue-50 transition-colors opacity-0 group-hover:opacity-100">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
  `
})
export class ServiciosEnVivoComponent implements OnInit, OnDestroy {
  private solicitudService = inject(SolicitudService);
  private authService = inject(AuthService);
  
  servicios = signal<any[]>([]);
  solicitudSeleccionada = signal<any | null>(null);
  wsStatus = signal<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  
  private map: L.Map | null = null;
  private ws: WebSocket | null = null;
  private mechanicMarker: L.Marker | null = null;
  private clientMarker: L.Marker | null = null;
  private routeLine: L.Polyline | null = null;
  private refreshInterval: any;
  private pingInterval: any;

  ngOnInit() {
    this.cargarEnVivo();
    this.refreshInterval = setInterval(() => {
      if (!this.solicitudSeleccionada()) {
        this.cargarEnVivo();
      }
    }, 30000);
  }

  ngOnDestroy() {
    clearInterval(this.refreshInterval);
    this.cerrarDetalles();
  }

  cargarEnVivo() {
    this.solicitudService.listarEnVivo().subscribe({
      next: (data) => this.servicios.set(data),
      error: (err) => console.error('Error cargando servicios en vivo:', err)
    });
  }

  verDetalles(sol: any) {
    this.solicitudSeleccionada.set(sol);
    // Timeout para dar tiempo a que el DOM renderice el div del mapa
    setTimeout(() => this.initLiveTracking(sol), 300);
  }

  cerrarDetalles() {
    this.solicitudSeleccionada.set(null);
    this.cleanupTracking();
  }

  centrarMapa() {
    if (this.map) {
      if (this.clientMarker && this.mechanicMarker) {
        const bounds = L.latLngBounds([this.clientMarker.getLatLng(), this.mechanicMarker.getLatLng()]);
        this.map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
      } else if (this.clientMarker) {
        this.map.panTo(this.clientMarker.getLatLng());
      }
    }
  }

  private cleanupTracking() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    if (this.routeLine) {
      this.routeLine.remove();
      this.routeLine = null;
    }
    this.mechanicMarker = null;
    this.clientMarker = null;
    this.wsStatus.set('disconnected');
  }

  private initLiveTracking(sol: any) {
    this.cleanupTracking(); // Limpiar previo si existiera
    
    const lat = Number(sol.latitud);
    const lng = Number(sol.longitud);

    // 1. Inicializar Mapa de Leaflet
    // Usamos el tema "Voyager" de CartoDB para un look moderno y limpio
    this.map = L.map('admin-live-map', {
      zoomControl: false // Ocultar para UI más limpia
    }).setView([lat, lng], 15);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(this.map);

    // Añadir control de zoom abajo a la izquierda
    L.control.zoom({ position: 'bottomleft' }).addTo(this.map);

    // Marcador del Cliente (Punto Rojo con pulso)
    const clientIcon = L.divIcon({
      className: 'bg-transparent',
      html: `<div class="relative flex h-8 w-8 items-center justify-center">
               <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60"></span>
               <div class="relative inline-flex h-4 w-4 rounded-full bg-red-500 border-2 border-white shadow-md"></div>
             </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    this.clientMarker = L.marker([lat, lng], { icon: clientIcon }).addTo(this.map);
    this.clientMarker.bindPopup('<b class="text-red-500">📍 Incidente</b><br>Ubicación del cliente').openPopup();

    // 2. Conectar WebSocket
    const user = this.authService.currentUser();
    const tallerId = user?.tallerId;
    if (!tallerId) return;

    this.wsStatus.set('connecting');
    
    // Construir WS URL de manera segura basada en HTTP URL
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const apiUrlWithoutProtocol = environment.apiUrl.replace(/^https?:\/\//, '');
    const wsUrl = `${wsProtocol}//${apiUrlWithoutProtocol}/ws/${tallerId}`;
    
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      this.wsStatus.set('connected');
      console.log('✅ WS Conectado para rastreo en vivo como Admin');
    };

    this.ws.onmessage = (event) => {
      if (event.data === 'pong') return;
      try {
        const msg = JSON.parse(event.data);
        console.log('📡 [WS Admin] Mensaje recibido:', msg); // Debug para que veas si llega el GPS
        
        // Validar que la posición pertenece al cliente actual usando Number para evitar problemas de string vs int
        if (msg.evento === 'UBICACION_MECANICO' && Number(msg.datos.cliente_id) === Number(sol.cliente_id)) {
          const mLat = Number(msg.datos.lat);
          const mLng = Number(msg.datos.lng);
          console.log(`✅ [WS Admin] Actualizando marcador de mecánico en Lat: ${mLat}, Lng: ${mLng}`);
          this.updateMechanicPosition(mLat, mLng);
        }
      } catch (e) {
        console.error('Error parseando WS', e);
      }
    };

    this.ws.onerror = () => {
      this.wsStatus.set('error');
    };

    this.ws.onclose = () => {
      this.wsStatus.set('disconnected');
    };

    // Keep-alive ping
    this.pingInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send('ping');
      }
    }, 20000);
  }

  private updateMechanicPosition(lat: number, lng: number) {
    if (!this.map) return;

    if (!this.mechanicMarker) {
      // Crear marcador del mecánico (Verde - Coche)
      const mechanicIcon = L.divIcon({
        className: 'bg-transparent',
        html: `<div class="bg-green-500 p-2.5 rounded-full border-2 border-white shadow-[0_4px_12px_rgba(34,197,94,0.4)] flex items-center justify-center transform transition-all hover:scale-110">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="w-5 h-5">
                   <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 1 1 6 0h3a3 3 0 1 1 6 0h.375c1.036 0 1.875-.84 1.875-1.875V15H13.5z" />
                 </svg>
               </div>`,
        iconSize: [42, 42],
        iconAnchor: [21, 21]
      });
      this.mechanicMarker = L.marker([lat, lng], { icon: mechanicIcon }).addTo(this.map);
      this.mechanicMarker.bindPopup('<b class="text-green-600">🚗 Mecánico</b><br>Ubicación actual').openPopup();
      
      this.centrarMapa(); // Centrar en ambos inicialmente
    } else {
      // Mover marcador existente suavemente
      this.mechanicMarker.setLatLng([lat, lng]);
    }

    // Actualizar la ruta (línea punteada) entre el cliente y el mecánico
    if (this.clientMarker) {
      const start = this.clientMarker.getLatLng();
      const end = this.mechanicMarker.getLatLng();
      
      if (!this.routeLine) {
        this.routeLine = L.polyline([start, end], {
          color: '#3b82f6',
          weight: 4,
          dashArray: '10, 15',
          opacity: 0.8
        }).addTo(this.map);
      } else {
        this.routeLine.setLatLngs([start, end]);
      }
    }
  }
}
