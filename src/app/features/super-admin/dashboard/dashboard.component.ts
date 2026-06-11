import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SolicitudService } from '../../../core/services/solicitud.service';

@Component({
  selector: 'app-superadmin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="space-y-8">
  <!-- Header -->
  <div class="flex justify-between items-end flex-wrap gap-4">
    <div>
      <h1 class="text-3xl font-black text-slate-800 tracking-tight">Dashboard Global</h1>
      <p class="text-slate-500 font-medium">Métricas de rendimiento de toda la plataforma</p>
    </div>
    <div class="flex items-center gap-2">
      <label class="text-sm font-bold text-slate-500">Período:</label>
      <select [(ngModel)]="diasSeleccionados" (ngModelChange)="cargarMetricas()" class="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 shadow-sm">
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
      <div class="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
        <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Plataforma</p>
        <p class="text-3xl font-black text-slate-800">{{ metricas()?.total_solicitudes ?? 0 }}</p>
        <p class="text-xs text-slate-400 font-medium mt-1">solicitudes globales</p>
      </div>
      <div class="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm">
        <p class="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1">Éxito Global</p>
        <p class="text-3xl font-black text-emerald-600">{{ metricas()?.finalizadas ?? 0 }}</p>
        <p class="text-xs text-emerald-400 font-medium mt-1">servicios completados</p>
      </div>
      <div class="bg-white rounded-2xl p-5 border border-red-100 shadow-sm">
        <p class="text-[10px] font-black uppercase tracking-widest text-red-400 mb-1">Cancelaciones</p>
        <p class="text-3xl font-black text-red-500">{{ metricas()?.canceladas ?? 0 }}</p>
        <p class="text-xs text-red-300 font-medium mt-1">tasa global: {{ metricas()?.tasa_cancelacion_pct ?? 0 }}%</p>
      </div>
      <div class="bg-white rounded-2xl p-5 border border-blue-100 shadow-sm">
        <p class="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-1">Top Taller</p>
        <p class="text-xl font-black text-blue-600 truncate">{{ metricas()?.top_talleres?.[0]?.taller || 'N/A' }}</p>
        <p class="text-xs text-blue-400 font-medium mt-1">{{ metricas()?.top_talleres?.[0]?.finalizados || 0 }} servicios</p>
      </div>
    </div>

    <!-- Tiempos Promedio Platforma -->
    <div class="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
      <h2 class="text-lg font-black text-slate-800 mb-1">⏱ Tiempos Promedio (Plataforma)</h2>
      <p class="text-xs text-slate-400 font-medium mb-6">Mide la salud general del servicio en todas las ciudades</p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-amber-50 rounded-2xl p-5 border border-amber-100">
          <p class="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-2">Asignación Promedio</p>
          <p class="text-4xl font-black text-amber-600">
            {{ metricas()?.tiempo_prom_asignacion_min !== null ? metricas()?.tiempo_prom_asignacion_min + ' min' : 'N/A' }}
          </p>
        </div>
        <div class="bg-purple-50 rounded-2xl p-5 border border-purple-100">
          <p class="text-[10px] font-black uppercase tracking-widest text-purple-500 mb-2">Llegada Promedio</p>
          <p class="text-4xl font-black text-purple-600">
            {{ metricas()?.tiempo_prom_llegada_min !== null ? metricas()?.tiempo_prom_llegada_min + ' min' : 'N/A' }}
          </p>
        </div>
        <div class="bg-cyan-50 rounded-2xl p-5 border border-cyan-100">
          <p class="text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-2">Servicio Promedio</p>
          <p class="text-4xl font-black text-cyan-600">
            {{ metricas()?.tiempo_prom_servicio_min !== null ? metricas()?.tiempo_prom_servicio_min + ' min' : 'N/A' }}
          </p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- Ranking Talleres -->
      <div class="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
        <h2 class="text-lg font-black text-slate-800 mb-1">🏆 Ranking de Talleres</h2>
        <p class="text-xs text-slate-400 font-medium mb-6">Top 10 talleres con más servicios finalizados</p>
        
        <div *ngIf="metricas()?.top_talleres?.length === 0" class="text-center py-8 text-slate-400 font-bold">
          Sin datos para este período.
        </div>
        <div class="space-y-4">
          <div *ngFor="let taller of metricas()?.top_talleres; let i = index" class="flex items-center gap-4">
            <div class="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-black flex items-center justify-center text-sm shrink-0">
              {{ i + 1 }}
            </div>
            <div class="flex-grow font-bold text-slate-700 truncate">{{ taller.taller }}</div>
            <div class="w-24 bg-emerald-50 text-emerald-600 text-xs font-black px-3 py-1 rounded-full text-center">
              {{ taller.finalizados }} ops
            </div>
          </div>
        </div>
      </div>

      <!-- Tipos de Incidente Globales -->
      <div class="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
        <h2 class="text-lg font-black text-slate-800 mb-1">🌍 Tendencias de Servicios</h2>
        <p class="text-xs text-slate-400 font-medium mb-6">Problemas más frecuentes a nivel global</p>
        
        <div *ngIf="metricas()?.tipos_incidente?.length === 0" class="text-center py-8 text-slate-400 font-bold">
          Sin datos para este período.
        </div>
        <div class="space-y-3">
          <div *ngFor="let tipo of metricas()?.tipos_incidente" class="flex items-center gap-4">
            <div class="w-32 text-sm font-bold text-slate-600 truncate shrink-0">{{ tipo.nombre }}</div>
            <div class="flex-grow bg-slate-100 rounded-full h-3 overflow-hidden">
              <div class="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-700"
                   [style.width.%]="getTipoBar(tipo.total)"></div>
            </div>
            <div class="w-10 text-right text-sm font-black text-slate-700">{{ tipo.total }}</div>
          </div>
        </div>
      </div>
    </div>
  </ng-container>

  <!-- Error / Sin datos -->
  <div *ngIf="!cargando() && !metricas()" class="bg-white rounded-[2rem] border border-red-100 p-12 text-center">
    <p class="text-red-400 font-bold">No se pudieron cargar las métricas globales.</p>
    <button (click)="cargarMetricas()" class="mt-4 text-primary-500 font-black underline">Reintentar</button>
  </div>
</div>
  `
})
export class DashboardComponent implements OnInit {
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
    this.solicitudService.obtenerMetricasGlobales(this.diasSeleccionados).subscribe({
      next: (data) => {
        this.metricas.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error cargando métricas globales:', err);
        this.cargando.set(false);
      }
    });
  }

  getTipoBar(total: number): number {
    const tipos = this.metricas()?.tipos_incidente ?? [];
    const max = Math.max(...tipos.map((t: any) => t.total), 1);
    return (total / max) * 100;
  }
}
