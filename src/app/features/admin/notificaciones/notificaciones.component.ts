import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SolicitudService } from '../../../core/services/solicitud.service';
import { MecanicoService } from '../../../core/services/mecanico.service';
import { WebsocketService } from '../../../core/services/websocket.service';
import { ToastService } from '../../../core/services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-notificaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="space-y-8">
  <!-- Header -->
  <div class="flex justify-between items-center">
    <div>
      <h1 class="text-3xl font-black text-slate-800 tracking-tight">Emergencias</h1>
      <p class="text-slate-500 font-medium">Gestiona solicitudes de auxilio en tiempo real</p>
    </div>
    <button (click)="cargarSolicitudes()" 
            class="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm px-5 py-3 rounded-2xl transition-all">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
      </svg>
      Refrescar
    </button>
  </div>

  <!-- Empty State -->
  <div *ngIf="solicitudes().length === 0 && !cargando()" 
       class="bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-slate-100 p-12 text-center">
    <div class="w-24 h-24 bg-green-50 text-green-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    </div>
    <h2 class="text-xl font-bold text-slate-700 mb-2">Sin emergencias pendientes</h2>
    <p class="text-slate-400">Cuando se registre una nueva emergencia, aparecerá aquí automáticamente.</p>
  </div>

  <!-- Loading -->
  <div *ngIf="cargando()" class="text-center py-16">
    <div class="w-12 h-12 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
    <p class="text-slate-500 font-medium">Cargando emergencias...</p>
  </div>

  <!-- Cards de Solicitudes -->
  <div *ngFor="let sol of solicitudes()" 
       class="bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden transition-all hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
    
    <!-- Header de la card -->
    <div class="p-6 pb-0 flex justify-between items-start">
      <div class="flex items-center gap-4">
        <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-black"
             [ngClass]="{
               'bg-amber-500': sol.estado === 'PUBLICADO',
               'bg-blue-500': sol.estado === 'ACEPTADO',
               'bg-green-500': sol.estado === 'ASIGNADO'
             }">
          #{{ sol.id }}
        </div>
        <div>
          <h3 class="font-black text-slate-800 text-lg">Emergencia #{{ sol.id }}</h3>
          <p class="text-slate-400 text-sm font-medium">{{ sol.fecha_creacion | date:'dd/MM/yyyy HH:mm' }}</p>
        </div>
      </div>
      <span class="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider"
            [ngClass]="{
              'bg-amber-50 text-amber-600': sol.estado === 'PUBLICADO',
              'bg-blue-50 text-blue-600': sol.estado === 'ACEPTADO',
              'bg-green-50 text-green-600': sol.estado === 'ASIGNADO'
            }">
        {{ sol.estado }}
      </span>
    </div>

    <!-- Body -->
    <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Info -->
      <div class="space-y-3">
        <div class="flex items-center gap-2 text-sm">
          <span class="text-slate-400 font-bold w-24">Descripción:</span>
          <span class="text-slate-700 font-medium">{{ sol.descripcion || '—' }}</span>
        </div>
        <div class="flex items-center gap-2 text-sm">
          <span class="text-slate-400 font-bold w-24">Placa:</span>
          <span class="bg-slate-100 px-3 py-1 rounded-lg font-black text-slate-700">{{ sol.placa_vehiculo || '—' }}</span>
        </div>
        <div class="flex items-center gap-2 text-sm">
          <span class="text-slate-400 font-bold w-24">Servicio:</span>
          <span class="bg-purple-50 text-purple-600 px-3 py-1 rounded-lg font-bold">{{ sol.nombre_servicio || '—' }}</span>
        </div>
        <div class="flex items-center gap-2 text-sm">
          <span class="text-slate-400 font-bold w-24">Ubicación:</span>
          <a [href]="'https://www.google.com/maps?q=' + sol.latitud + ',' + sol.longitud" 
             target="_blank" 
             class="text-blue-500 underline font-medium hover:text-blue-700">
            Ver en Google Maps
          </a>
        </div>
        <div *ngIf="sol.precio_estimado" class="flex items-center gap-2 text-sm">
          <span class="text-slate-400 font-bold w-24">Precio:</span>
          <span class="text-green-600 font-black text-lg">Bs. {{ sol.precio_estimado }}</span>
        </div>
      </div>

      <!-- Fotos -->
      <div *ngIf="sol.urls_fotos && sol.urls_fotos.length > 0" class="flex gap-2 flex-wrap">
        <img *ngFor="let foto of sol.urls_fotos" 
             [src]="foto" 
             class="w-28 h-28 object-cover rounded-xl border border-slate-200 cursor-pointer hover:scale-105 transition-transform"
             (click)="verFoto(foto)">
      </div>
    </div>

    <!-- Acciones -->
    <div class="px-6 pb-6 flex gap-3">
      <!-- Botón ACEPTAR (solo si está PUBLICADO) -->
      <button *ngIf="sol.estado === 'PUBLICADO'" 
              (click)="abrirModalAceptar(sol)"
              class="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
        Aceptar Emergencia
      </button>

      <!-- Botón ASIGNAR MECÁNICO (solo si está ACEPTADO) -->
      <button *ngIf="sol.estado === 'ACEPTADO'"
              (click)="abrirModalAsignar(sol)"
              class="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/20">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
        </svg>
        Asignar Mecánico
      </button>

      <!-- Estado ASIGNADO -->
      <div *ngIf="sol.estado === 'ASIGNADO'" 
           class="flex-1 bg-green-50 text-green-600 font-bold py-3 rounded-2xl flex items-center justify-center gap-2 border-2 border-green-200">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        Mecánico asignado — Push enviado
      </div>
    </div>
  </div>
</div>

<!-- ====== MODAL ACEPTAR ====== -->
<div *ngIf="modalAceptar()" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
  <div class="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl">
    <h2 class="text-xl font-black text-slate-800 mb-2">Aceptar Emergencia</h2>
    <p class="text-slate-500 text-sm mb-6">Ingresa el precio estimado para el servicio.</p>
    
    <label class="block text-sm font-bold text-slate-600 mb-2">Precio estimado (Bs.)</label>
    <input type="number" [(ngModel)]="precioEstimado" placeholder="Ej: 150.00"
           class="w-full border border-slate-200 rounded-xl px-4 py-3 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-6">
    
    <div class="flex gap-3">
      <button (click)="cerrarModales()" 
              class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-2xl transition-all">
        Cancelar
      </button>
      <button (click)="confirmarAceptar()" 
              [disabled]="!precioEstimado || precioEstimado <= 0"
              class="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 text-white font-bold py-3 rounded-2xl transition-all shadow-lg shadow-blue-500/20">
        Confirmar
      </button>
    </div>
  </div>
</div>

<!-- ====== MODAL ASIGNAR MECÁNICO ====== -->
<div *ngIf="modalAsignar()" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
  <div class="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl">
    <h2 class="text-xl font-black text-slate-800 mb-2">Asignar Mecánico</h2>
    <p class="text-slate-500 text-sm mb-6">Selecciona el mecánico que atenderá esta emergencia.</p>
    
    <div *ngIf="mecanicos().length === 0" class="text-center py-4">
      <p class="text-slate-400 font-medium">No hay mecánicos registrados en tu taller.</p>
    </div>

    <div class="space-y-2 max-h-60 overflow-y-auto mb-6">
      <button *ngFor="let mec of mecanicos()" 
              (click)="mecanicoSeleccionado = mec.id"
              class="w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left"
              [ngClass]="mecanicoSeleccionado === mec.id ? 'border-green-500 bg-green-50' : 'border-slate-100 hover:border-slate-300'">
        <div class="w-11 h-11 bg-slate-200 rounded-2xl flex items-center justify-center font-black text-slate-600">
          {{ mec.nombre?.charAt(0) || '?' }}
        </div>
        <div class="flex-grow">
          <p class="font-bold text-slate-800">{{ mec.nombre }}</p>
          <p class="text-xs text-slate-400">{{ mec.telefono || 'Sin teléfono' }}</p>
        </div>
        <div *ngIf="mecanicoSeleccionado === mec.id" class="text-green-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
      </button>
    </div>
    
    <div class="flex gap-3">
      <button (click)="cerrarModales()" 
              class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-2xl transition-all">
        Cancelar
      </button>
      <button (click)="confirmarAsignar()" 
              [disabled]="!mecanicoSeleccionado"
              class="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-slate-300 text-white font-bold py-3 rounded-2xl transition-all shadow-lg shadow-green-500/20">
        Asignar y Notificar
      </button>
    </div>
  </div>
</div>

<!-- ====== MODAL FOTO ====== -->
<div *ngIf="fotoAmpliada()" (click)="fotoAmpliada.set(null)" 
     class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-pointer">
  <img [src]="fotoAmpliada()" class="max-w-[90vw] max-h-[90vh] rounded-2xl shadow-2xl">
</div>
  `
})
export class NotificacionesComponent implements OnInit, OnDestroy {
  solicitudService = inject(SolicitudService);
  mecanicoService = inject(MecanicoService);
  websocketService = inject(WebsocketService);
  toastService = inject(ToastService);

  solicitudes = signal<any[]>([]);
  mecanicos = signal<any[]>([]);
  cargando = signal(false);

  // Modales
  modalAceptar = signal(false);
  modalAsignar = signal(false);
  fotoAmpliada = signal<string | null>(null);

  // Datos de formulario
  precioEstimado: number = 0;
  mecanicoSeleccionado: number | null = null;
  solicitudActiva: any = null;

  private sub: Subscription | null = null;

  ngOnInit() {
    this.cargarSolicitudes();
    this.cargarMecanicos();

    // Auto-refresh cuando llega una nueva emergencia por WebSocket
    this.sub = this.websocketService.emergencias$.subscribe(() => {
      this.cargarSolicitudes();
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  cargarSolicitudes() {
    this.cargando.set(true);
    this.solicitudService.listarPendientes().subscribe({
      next: (data) => {
        this.solicitudes.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error cargando solicitudes:', err);
        this.cargando.set(false);
      }
    });
  }

  cargarMecanicos() {
    this.mecanicoService.listar().subscribe({
      next: (data) => this.mecanicos.set(data),
      error: (err) => console.error('Error cargando mecánicos:', err)
    });
  }

  // --- ACEPTAR ---
  abrirModalAceptar(sol: any) {
    this.solicitudActiva = sol;
    this.precioEstimado = 0;
    this.modalAceptar.set(true);
  }

  confirmarAceptar() {
    if (!this.solicitudActiva || !this.precioEstimado) return;

    this.solicitudService.aceptar(this.solicitudActiva.id, this.precioEstimado).subscribe({
      next: () => {
        this.toastService.show('✅ Emergencia aceptada', 'Se registró el precio estimado correctamente.', 'success');
        this.cerrarModales();
        this.cargarSolicitudes();
      },
      error: (err) => {
        this.toastService.show('❌ Error', err.error?.detail || 'No se pudo aceptar la emergencia.', 'error');
      }
    });
  }

  // --- ASIGNAR ---
  abrirModalAsignar(sol: any) {
    this.solicitudActiva = sol;
    this.mecanicoSeleccionado = null;
    this.modalAsignar.set(true);
  }

  confirmarAsignar() {
    if (!this.solicitudActiva || !this.mecanicoSeleccionado) return;

    this.solicitudService.asignarMecanico(this.solicitudActiva.id, this.mecanicoSeleccionado).subscribe({
      next: () => {
        this.toastService.show('✅ Mecánico asignado', 'Se envió una notificación push al mecánico.', 'success');
        this.cerrarModales();
        this.cargarSolicitudes();
      },
      error: (err) => {
        this.toastService.show('❌ Error', err.error?.detail || 'No se pudo asignar el mecánico.', 'error');
      }
    });
  }

  cerrarModales() {
    this.modalAceptar.set(false);
    this.modalAsignar.set(false);
    this.solicitudActiva = null;
  }

  verFoto(url: string) {
    this.fotoAmpliada.set(url);
  }
}
