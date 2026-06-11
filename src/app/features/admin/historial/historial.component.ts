import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitudService } from '../../../core/services/solicitud.service';
import { jsPDF } from 'jspdf';

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
            <td class="px-6 py-4 flex flex-col gap-2 items-start">
              <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap"
                    [ngClass]="{
                      'bg-amber-50 text-amber-600': sol.estado === 'PUBLICADO' || sol.estado === 'PENDIENTE',
                      'bg-blue-50 text-blue-600': sol.estado === 'ACEPTADO',
                      'bg-green-50 text-green-600': sol.estado === 'ASIGNADO',
                      'bg-purple-50 text-purple-600': sol.estado === 'EN_CAMINO',
                      'bg-cyan-50 text-cyan-600': sol.estado === 'EN_SITIO',
                      'bg-emerald-50 text-emerald-600': sol.estado === 'FINALIZADO' || sol.estado === 'COMPLETADO'
                    }">
                {{ sol.estado }}
              </span>
              <span *ngIf="sol.estado_pago" class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap shadow-sm"
                    [ngClass]="{
                      'bg-green-100 text-green-700 border border-green-200': sol.estado_pago === 'COMPLETADO',
                      'bg-amber-100 text-amber-700 border border-amber-200': sol.estado_pago === 'PENDIENTE',
                      'bg-red-100 text-red-700 border border-red-200': sol.estado_pago === 'FALLIDO'
                    }">
                Pago: {{ sol.estado_pago }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex justify-end items-center gap-1">
                <button (click)="verDetalles(sol)" class="text-slate-400 hover:text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-all" title="Ver detalles">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                </button>
                <button (click)="descargarPDF(sol)" class="text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 p-2 rounded-lg transition-all" title="Descargar PDF">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                </button>
              </div>
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

  <!-- Modal Detalle -->
  <div *ngIf="solicitudSeleccionada()" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
    <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
      <!-- Header Modal -->
      <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h3 class="text-lg font-black text-slate-800">Detalles de Emergencia #{{ solicitudSeleccionada()?.id }}</h3>
        <button (click)="cerrarDetalles()" class="text-slate-400 hover:text-slate-600 transition-colors bg-white rounded-full p-1 shadow-sm border border-slate-200">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Body Modal -->
      <div class="p-6 space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-slate-50 p-3 rounded-2xl">
            <p class="text-[10px] uppercase font-black tracking-wider text-slate-400 mb-1">Cliente</p>
            <p class="font-bold text-slate-700 text-sm truncate" [title]="solicitudSeleccionada()?.cliente_nombre || 'No disponible'">
              {{ solicitudSeleccionada()?.cliente_nombre || 'Desconocido' }}
            </p>
          </div>
          <div class="bg-slate-50 p-3 rounded-2xl">
            <p class="text-[10px] uppercase font-black tracking-wider text-slate-400 mb-1">Mecánico</p>
            <p class="font-bold text-slate-700 text-sm truncate" [title]="solicitudSeleccionada()?.nombre_mecanico || 'No disponible'">
              {{ solicitudSeleccionada()?.nombre_mecanico || 'Sin asignar' }}
            </p>
          </div>
        </div>

        <div class="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
          <p class="text-[10px] uppercase font-black tracking-wider text-blue-400 mb-2">Descripción del problema</p>
          <p class="text-sm text-slate-600 leading-relaxed font-medium">
            {{ solicitudSeleccionada()?.descripcion || 'Sin descripción proporcionada.' }}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100">
            <p class="text-[10px] uppercase font-black tracking-wider text-emerald-500 mb-1">Precio Estimado</p>
            <p class="font-black text-emerald-700 text-lg">
              {{ solicitudSeleccionada()?.precio_estimado ? 'Bs. ' + solicitudSeleccionada()?.precio_estimado : '—' }}
            </p>
          </div>
          <div class="bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100">
            <p class="text-[10px] uppercase font-black tracking-wider text-emerald-500 mb-1">Precio Final / Cobrado</p>
            <p class="font-black text-emerald-700 text-lg">
              {{ solicitudSeleccionada()?.precio_final ? 'Bs. ' + solicitudSeleccionada()?.precio_final : '—' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  `
})
export class HistorialComponent implements OnInit {
  private solicitudService = inject(SolicitudService);
  historial = signal<any[]>([]);
  solicitudSeleccionada = signal<any | null>(null);

  ngOnInit() {
    this.cargarHistorial();
  }

  cargarHistorial() {
    this.solicitudService.listarHistorial().subscribe({
      next: (data) => this.historial.set(data),
      error: (err) => console.error('Error cargando historial:', err)
    });
  }

  verDetalles(sol: any) {
    this.solicitudSeleccionada.set(sol);
  }

  cerrarDetalles() {
    this.solicitudSeleccionada.set(null);
  }

  descargarPDF(sol: any) {
    const doc = new jsPDF();

    // Logo / Header
    doc.setFontSize(22);
    doc.setTextColor(33, 150, 243);
    doc.text('TALLER VIRTUAL', 105, 20, { align: 'center' });

    doc.setFontSize(16);
    doc.setTextColor(50, 50, 50);
    doc.text('Ticket de Servicio de Emergencia', 105, 30, { align: 'center' });

    // Details Box
    doc.setDrawColor(200);
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(20, 40, 170, 100, 5, 5, 'FD');

    // Details Content
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    
    // Column 1
    doc.text('ID Solicitud:', 25, 55);
    doc.text('Fecha:', 25, 70);
    doc.text('Servicio:', 25, 85);
    doc.text('Vehículo:', 25, 100);
    doc.text('Detalles:', 25, 115);
    doc.text('Estado:', 25, 130);
    
    // Column 1 Values
    doc.setTextColor(0, 0, 0);
    doc.text(`#${sol.id}`, 70, 55);
    doc.text(`${new Date(sol.fecha_creacion).toLocaleString()}`, 70, 70);
    doc.text(`${sol.nombre_servicio || 'General'}`, 70, 85);
    doc.text(`${sol.placa_vehiculo || 'Sin Placa'}`, 70, 100);
    
    // Auto-formato de detalles del vehiculo
    const detallesVehiculo = [sol.vehiculo_marca, sol.vehiculo_modelo, sol.vehiculo_anio, sol.vehiculo_color]
      .filter(v => v)
      .join(' - ') || 'No especificado';
      
    doc.setFontSize(10);
    doc.text(`${detallesVehiculo}`, 70, 115);
    doc.setFontSize(12);
    
    doc.text(`${sol.estado}`, 70, 130);

    // Column 2
    doc.setTextColor(100, 100, 100);
    doc.text('Cliente:', 110, 55);
    doc.text('Mecánico:', 110, 70);
    doc.text('Precio Est.:', 110, 85);
    doc.text('Precio Final:', 110, 100);
    doc.text('Pago:', 110, 115);

    // Column 2 Values
    doc.setTextColor(0, 0, 0);
    doc.text(`${sol.cliente_nombre || 'Desconocido'}`, 140, 55);
    doc.text(`${sol.nombre_mecanico || 'Sin asignar'}`, 140, 70);
    doc.text(`${sol.precio_estimado ? 'Bs. ' + sol.precio_estimado : '---'}`, 140, 85);
    doc.text(`${sol.precio_final ? 'Bs. ' + sol.precio_final : '---'}`, 140, 100);
    doc.text(`${sol.estado_pago || '---'}`, 140, 115);

    // Footer Description
    doc.setFontSize(14);
    doc.setTextColor(50, 50, 50);
    doc.text('Descripción del Problema:', 20, 150);
    
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    const splitDesc = doc.splitTextToSize(sol.descripcion || 'Sin descripción.', 170);
    doc.text(splitDesc, 20, 160);

    // Download
    doc.save(`Ticket_Servicio_${sol.id}.pdf`);
  }
}
