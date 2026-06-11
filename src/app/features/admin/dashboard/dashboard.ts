import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SolicitudService } from '../../../core/services/solicitud.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="space-y-8 animate-in fade-in duration-500">
  <!-- Header -->
  <div class="flex justify-between items-end flex-wrap gap-4">
    <div>
      <h1 class="text-3xl font-black text-slate-800 tracking-tight">Dashboard del Taller</h1>
      <p class="text-slate-500 font-medium">Métricas de rendimiento operativo de tu taller</p>
    </div>
    <div class="flex items-center gap-2">
      <label class="text-sm font-bold text-slate-500">Período:</label>
      <select [(ngModel)]="diasSeleccionados" (ngModelChange)="cargarMetricas()" class="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 shadow-sm outline-none">
        <option [value]="7">Últimos 7 días</option>
        <option [value]="30">Últimos 30 días</option>
        <option [value]="90">Últimos 90 días</option>
        <option [value]="365">Último año</option>
      </select>
    </div>
  </div>

  <!-- Loading -->
  <div *ngIf="cargando()" class="flex justify-center py-20">
    <div class="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
  </div>

  <ng-container *ngIf="metricas() && !cargando()">
    <!-- KPI Cards Row -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
        <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Solicitudes</p>
        <p class="text-3xl font-black text-slate-800">{{ metricas()?.total_solicitudes ?? 0 }}</p>
        <p class="text-xs text-slate-400 font-medium mt-1">últimos {{ diasSeleccionados }} días</p>
      </div>
      <div class="bg-white rounded-2xl p-5 border border-emerald-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
        <p class="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1">Finalizadas</p>
        <p class="text-3xl font-black text-emerald-600">{{ metricas()?.finalizadas ?? 0 }}</p>
        <p class="text-xs text-emerald-400 font-medium mt-1">servicios completados</p>
      </div>
      <div class="bg-white rounded-2xl p-5 border border-red-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
        <p class="text-[10px] font-black uppercase tracking-widest text-red-400 mb-1">Canceladas</p>
        <p class="text-3xl font-black text-red-500">{{ metricas()?.canceladas ?? 0 }}</p>
        <p class="text-xs text-red-300 font-medium mt-1">tasa: {{ metricas()?.tasa_cancelacion_pct ?? 0 }}%</p>
      </div>
      <div class="bg-white rounded-2xl p-5 border border-blue-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
        <p class="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-1">Ingresos</p>
        <p class="text-3xl font-black text-blue-600">Bs. {{ metricas()?.ingresos_periodo ?? 0 }}</p>
        <p class="text-xs text-blue-400 font-medium mt-1">solo servicios pagados</p>
      </div>
    </div>

    <!-- Tiempos Promedio -->
    <div class="bg-white rounded-[2rem] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] p-6">
      <h2 class="text-lg font-black text-slate-800 mb-1">⏱ Tiempos Promedio (en minutos)</h2>
      <p class="text-xs text-slate-400 font-medium mb-6">Trazabilidad completa del ciclo de vida de cada emergencia</p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Asignación -->
        <div class="bg-amber-50 rounded-2xl p-5 border border-amber-100">
          <p class="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-2">Tiempo de Asignación</p>
          <p class="text-sm text-amber-700 font-medium mb-3">Desde la alerta hasta que un taller la acepta</p>
          <p class="text-4xl font-black text-amber-600">
            {{ metricas()?.tiempo_prom_asignacion_min !== null ? metricas()?.tiempo_prom_asignacion_min + ' min' : 'N/A' }}
          </p>
          <div class="mt-3 bg-amber-200/40 h-2 rounded-full overflow-hidden">
            <div class="bg-amber-400 h-full rounded-full transition-all" [style.width.%]="getTiempoBar(metricas()?.tiempo_prom_asignacion_min, 60)"></div>
          </div>
        </div>
        <!-- Llegada -->
        <div class="bg-purple-50 rounded-2xl p-5 border border-purple-100">
          <p class="text-[10px] font-black uppercase tracking-widest text-purple-500 mb-2">Tiempo de Llegada</p>
          <p class="text-sm text-purple-700 font-medium mb-3">Desde que sale hasta que llega al cliente</p>
          <p class="text-4xl font-black text-purple-600">
            {{ metricas()?.tiempo_prom_llegada_min !== null ? metricas()?.tiempo_prom_llegada_min + ' min' : 'N/A' }}
          </p>
          <div class="mt-3 bg-purple-200/40 h-2 rounded-full overflow-hidden">
            <div class="bg-purple-400 h-full rounded-full transition-all" [style.width.%]="getTiempoBar(metricas()?.tiempo_prom_llegada_min, 120)"></div>
          </div>
        </div>
        <!-- Servicio -->
        <div class="bg-cyan-50 rounded-2xl p-5 border border-cyan-100">
          <p class="text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-2">Tiempo de Servicio</p>
          <p class="text-sm text-cyan-700 font-medium mb-3">Desde la llegada hasta la finalización</p>
          <p class="text-4xl font-black text-cyan-600">
            {{ metricas()?.tiempo_prom_servicio_min !== null ? metricas()?.tiempo_prom_servicio_min + ' min' : 'N/A' }}
          </p>
          <div class="mt-3 bg-cyan-200/40 h-2 rounded-full overflow-hidden">
            <div class="bg-cyan-400 h-full rounded-full transition-all" [style.width.%]="getTiempoBar(metricas()?.tiempo_prom_servicio_min, 180)"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tipos de Incidente -->
    <div class="bg-white rounded-[2rem] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] p-6">
      <h2 class="text-lg font-black text-slate-800 mb-1">📊 Tipos de Incidente</h2>
      <p class="text-xs text-slate-400 font-medium mb-6">Distribución de solicitudes por categoría de servicio</p>
      <div *ngIf="metricas()?.tipos_incidente?.length === 0" class="text-center py-8 text-slate-400 font-bold">
        Sin datos para este período.
      </div>
      <div class="space-y-3">
        <div *ngFor="let tipo of metricas()?.tipos_incidente" class="flex items-center gap-4">
          <div class="w-32 text-sm font-bold text-slate-600 truncate shrink-0">{{ tipo.nombre }}</div>
          <div class="flex-grow bg-slate-100 rounded-full h-3 overflow-hidden">
            <div class="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-700"
                 [style.width.%]="getTipoBar(tipo.total)"></div>
          </div>
          <div class="w-10 text-right text-sm font-black text-slate-700">{{ tipo.total }}</div>
        </div>
      </div>
    </div>

    <!-- Tasa de Cancelacion -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-white rounded-[2rem] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] p-6">
        <h2 class="text-lg font-black text-slate-800 mb-1">❌ Servicios No Atendidos</h2>
        <p class="text-xs text-slate-400 font-medium mb-6">Emergencias canceladas o rechazadas</p>
        <div class="flex items-center gap-6">
          <div class="relative w-28 h-28 shrink-0">
            <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#f1f5f9" stroke-width="3"/>
              <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#f87171" stroke-width="3"
                      [attr.stroke-dasharray]="(metricas()?.tasa_cancelacion_pct ?? 0) + ', 100'"
                      stroke-linecap="round" class="transition-all duration-1000"/>
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-xl font-black text-red-500">{{ metricas()?.tasa_cancelacion_pct ?? 0 }}%</span>
            </div>
          </div>
          <div>
            <p class="text-4xl font-black text-slate-800">{{ metricas()?.canceladas ?? 0 }}</p>
            <p class="text-sm text-slate-400 font-medium">de {{ metricas()?.total_solicitudes }} totales</p>
            <p class="text-xs text-slate-400 mt-2">Una tasa menor al 10% es excelente.</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-[2rem] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] p-6">
        <h2 class="text-lg font-black text-slate-800 mb-1">✅ En Curso Actualmente</h2>
        <p class="text-xs text-slate-400 font-medium mb-6">Solicitudes activas en este momento</p>
        <div class="flex items-center gap-6">
          <div class="relative flex items-center justify-center w-28 h-28 shrink-0">
            <div class="absolute w-full h-full rounded-full bg-emerald-50 border-4 border-emerald-100"></div>
            <span class="relative text-4xl font-black text-emerald-600">{{ metricas()?.en_curso ?? 0 }}</span>
          </div>
          <div>
            <p class="text-sm text-slate-400 font-bold">Pendientes, Aceptadas,</p>
            <p class="text-sm text-slate-400 font-bold">En Camino y En Sitio.</p>
            <p class="text-xs text-slate-400 mt-2">Estas aparecen en tu vista "En Vivo".</p>
          </div>
        </div>
      </div>
    </div>
  </ng-container>

  <!-- Error / Sin datos -->
  <div *ngIf="!cargando() && !metricas()" class="bg-white rounded-[2rem] border border-red-100 p-12 text-center">
    <p class="text-red-400 font-bold">No se pudieron cargar las métricas. Verifica que el servidor esté activo.</p>
    <button (click)="cargarMetricas()" class="mt-4 text-primary-500 font-black underline">Reintentar</button>
  </div>
</div>
  `
})
export class AdminDashboard implements OnInit {
  private solicitudService = inject(SolicitudService);
  metricas = signal<any | null>(null);
  cargando = signal(true);
  diasSeleccionados = 30;

  ngOnInit() {
    this.cargarMetricas();
  }

  cargarMetricas() {
    this.cargando.set(true);
    this.metricas.set(null);
    this.solicitudService.obtenerMetricas(this.diasSeleccionados).subscribe({
      next: (data) => {
        this.metricas.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error cargando métricas:', err);
        this.cargando.set(false);
      }
    });
  }

  getTiempoBar(valor: number | null | undefined, maximo: number): number {
    if (!valor) return 0;
    return Math.min((valor / maximo) * 100, 100);
  }

  getTipoBar(total: number): number {
    const tipos = this.metricas()?.tipos_incidente ?? [];
    const max = Math.max(...tipos.map((t: any) => t.total), 1);
    return (total / max) * 100;
  }
}
