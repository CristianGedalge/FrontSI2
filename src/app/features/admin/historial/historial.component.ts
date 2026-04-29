import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitudService } from '../../../core/services/solicitud.service';

@Component({
  selector: 'app-admin-historial',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="space-y-8">
  <!-- Header -->
  <div>
    <h1 class="text-3xl font-black text-slate-800 tracking-tight">Historial de Servicios</h1>
    <p class="text-slate-500 font-medium">Registro completo de todas las emergencias atendidas por tu taller</p>
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
            <th class="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">Precio</th>
            <th class="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">Estado</th>
            <th class="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr *ngFor="let sol of historial()" class="hover:bg-slate-50/50 transition-colors group">
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
              <div class="flex items-center gap-2">
                <span class="bg-slate-100 px-2 py-1 rounded text-xs font-black text-slate-600 uppercase">{{ sol.placa_vehiculo }}</span>
              </div>
            </td>
            <td class="px-6 py-4 font-black text-slate-700 text-sm">
              {{ sol.precio_estimado ? 'Bs. ' + sol.precio_estimado : '—' }}
            </td>
            <td class="px-6 py-4">
              <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap"
                    [ngClass]="{
                      'bg-amber-50 text-amber-600': sol.estado === 'PUBLICADO',
                      'bg-blue-50 text-blue-600': sol.estado === 'ACEPTADO',
                      'bg-green-50 text-green-600': sol.estado === 'ASIGNADO',
                      'bg-purple-50 text-purple-600': sol.estado === 'EN_CAMINO',
                      'bg-cyan-50 text-cyan-600': sol.estado === 'EN_SITIO',
                      'bg-slate-100 text-slate-500': sol.estado === 'COMPLETADO'
                    }">
                {{ sol.estado }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <button class="text-slate-300 hover:text-blue-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12.a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </button>
            </td>
          </tr>

          <!-- Empty State -->
          <tr *ngIf="historial().length === 0">
            <td colspan="7" class="px-6 py-20 text-center">
              <div class="flex flex-col items-center gap-3">
                <div class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                  </svg>
                </div>
                <p class="text-slate-400 font-bold">No hay registros en el historial</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
  `
})
export class HistorialComponent implements OnInit {
  private solicitudService = inject(SolicitudService);
  historial = signal<any[]>([]);

  ngOnInit() {
    this.cargarHistorial();
  }

  cargarHistorial() {
    this.solicitudService.listarHistorial().subscribe({
      next: (data) => this.historial.set(data),
      error: (err) => console.error('Error cargando historial:', err)
    });
  }
}
