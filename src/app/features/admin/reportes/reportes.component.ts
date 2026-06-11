import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportesService } from '../../../core/services/reportes.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-admin-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="space-y-8">
  <!-- Header -->
  <div class="flex justify-between items-end flex-wrap gap-4">
    <div>
      <h1 class="text-3xl font-black text-slate-800 tracking-tight">Reportes</h1>
      <p class="text-slate-500 font-medium">Tablas estáticas de métricas de rendimiento y operativa</p>
    </div>
    <div class="flex items-center gap-2">
      <label class="text-sm font-bold text-slate-500">Período:</label>
      <select [(ngModel)]="diasSeleccionados" (ngModelChange)="cargarTodos()" class="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 shadow-sm outline-none focus:border-primary-500">
        <option [value]="7">Últimos 7 días</option>
        <option [value]="30">Últimos 30 días</option>
        <option [value]="90">Últimos 90 días</option>
        <option [value]="365">Último año</option>
      </select>
    </div>
  </div>

  <!-- Tabs Navigation -->
  <div class="flex space-x-2 border-b border-slate-200 pb-px overflow-x-auto">
    <button (click)="activeTab = 'mecanicos'"
      [class]="activeTab === 'mecanicos' ? 'border-primary-500 text-primary-600 bg-primary-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'"
      class="px-5 py-3 border-b-2 font-bold text-sm transition-colors rounded-t-xl whitespace-nowrap">
      <svg class="w-5 h-5 mr-2 inline-block -mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg> Rendimiento Mecánicos
    </button>
    <button (click)="activeTab = 'servicios'"
      [class]="activeTab === 'servicios' ? 'border-primary-500 text-primary-600 bg-primary-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'"
      class="px-5 py-3 border-b-2 font-bold text-sm transition-colors rounded-t-xl whitespace-nowrap">
      <svg class="w-5 h-5 mr-2 inline-block -mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg> Historial de Servicios
    </button>
    <button (click)="activeTab = 'ia'"
      [class]="activeTab === 'ia' ? 'border-primary-500 text-primary-600 bg-primary-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'"
      class="px-5 py-3 border-b-2 font-bold text-sm transition-colors rounded-t-xl whitespace-nowrap">
      <svg class="w-5 h-5 mr-2 inline-block -mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg> Generador IA
    </button>
  </div>

  <!-- Loading -->
  <div *ngIf="cargando()" class="flex justify-center py-20">
    <div class="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
  </div>

  <!-- TAB: Mecanicos -->
  <ng-container *ngIf="activeTab === 'mecanicos' && !cargando()">
    <div class="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden mt-4">
      <div class="p-6 border-b border-slate-100 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 class="text-lg font-black text-slate-800 mb-1">Rendimiento por Mecánico</h2>
          <p class="text-xs text-slate-400 font-medium">Tabla estática de desempeño y ganancias</p>
        </div>
        <div class="flex gap-2">
          <button (click)="exportarMecanicosCSV()" class="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-xl text-sm font-bold transition-colors">
            <svg class="w-4 h-4 mr-1 inline-block -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg> Exportar CSV
          </button>
          <button (click)="exportarMecanicosPDF()" class="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-4 py-2 rounded-xl text-sm font-bold transition-colors">
            <svg class="w-4 h-4 mr-1 inline-block -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg> Exportar PDF
          </button>
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-100">
              <th class="p-4 text-xs font-black uppercase tracking-wider text-slate-500">Mecánico</th>
              <th class="p-4 text-xs font-black uppercase tracking-wider text-slate-500">Asignados</th>
              <th class="p-4 text-xs font-black uppercase tracking-wider text-emerald-500">Finalizados</th>
              <th class="p-4 text-xs font-black uppercase tracking-wider text-red-400">Cancelados</th>
              <th class="p-4 text-xs font-black uppercase tracking-wider text-blue-500 text-right">Ingresos (Bs)</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let m of reporteMecanicos()" class="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
              <td class="p-4 font-bold text-slate-700">{{ m.nombre }}</td>
              <td class="p-4 text-slate-600">{{ m.total_servicios }}</td>
              <td class="p-4 font-bold text-emerald-600">{{ m.finalizados }}</td>
              <td class="p-4 font-bold text-red-500">{{ m.cancelados }}</td>
              <td class="p-4 font-black text-blue-600 text-right">Bs. {{ m.ingresos | number:'1.2-2' }}</td>
            </tr>
            <tr *ngIf="reporteMecanicos().length === 0">
              <td colspan="5" class="p-8 text-center text-slate-400 font-bold">No hay datos para este período.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </ng-container>

  <!-- TAB: Historial Servicios -->
  <ng-container *ngIf="activeTab === 'servicios' && !cargando()">
    <div class="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden mt-4">
      <div class="p-6 border-b border-slate-100 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 class="text-lg font-black text-slate-800 mb-1">Historial Detallado de Servicios</h2>
          <p class="text-xs text-slate-400 font-medium">Registro operativo y contable con fechas de trazabilidad</p>
        </div>
        <div class="flex gap-2">
          <button (click)="exportarServiciosCSV()" class="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-xl text-sm font-bold transition-colors">
            <svg class="w-4 h-4 mr-1 inline-block -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg> Exportar CSV
          </button>
          <button (click)="exportarServiciosPDF()" class="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-4 py-2 rounded-xl text-sm font-bold transition-colors">
            <svg class="w-4 h-4 mr-1 inline-block -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg> Exportar PDF
          </button>
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-100">
              <th class="p-4 text-xs font-black uppercase tracking-wider text-slate-500">ID</th>
              <th class="p-4 text-xs font-black uppercase tracking-wider text-slate-500">Creación</th>
              <th class="p-4 text-xs font-black uppercase tracking-wider text-slate-500">Llegada</th>
              <th class="p-4 text-xs font-black uppercase tracking-wider text-slate-500">Finalizado</th>
              <th class="p-4 text-xs font-black uppercase tracking-wider text-slate-500">Cliente/Vehículo</th>
              <th class="p-4 text-xs font-black uppercase tracking-wider text-slate-500">Falla</th>
              <th class="p-4 text-xs font-black uppercase tracking-wider text-slate-500">Mecánico</th>
              <th class="p-4 text-xs font-black uppercase tracking-wider text-slate-500">Estado</th>
              <th class="p-4 text-xs font-black uppercase tracking-wider text-slate-500 text-right">Cobrado (Bs)</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let s of reporteServicios()" class="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
              <td class="p-4 text-xs font-bold text-slate-400">#{{ s.solicitud_id }}</td>
              <td class="p-4 text-sm text-slate-600 whitespace-nowrap">{{ s.fecha | date:'short' }}</td>
              <td class="p-4 text-sm text-slate-600 whitespace-nowrap">{{ s.fecha_en_sitio ? (s.fecha_en_sitio | date:'shortTime') : '-' }}</td>
              <td class="p-4 text-sm text-slate-600 whitespace-nowrap">{{ s.fecha_finalizado ? (s.fecha_finalizado | date:'shortTime') : '-' }}</td>
              <td class="p-4 text-sm">
                <p class="font-bold text-slate-700">{{ s.cliente }}</p>
                <p class="text-xs text-slate-500">{{ s.vehiculo }}</p>
              </td>
              <td class="p-4 text-sm text-slate-600">{{ s.servicio }}</td>
              <td class="p-4 text-sm text-slate-700">{{ s.mecanico }}</td>
              <td class="p-4">
                <span class="px-2 py-1 text-[10px] font-black uppercase rounded-full"
                      [ngClass]="{
                        'bg-emerald-100 text-emerald-600': s.estado === 'FINALIZADO',
                        'bg-red-100 text-red-500': s.estado === 'CANCELADO',
                        'bg-blue-100 text-blue-600': s.estado !== 'FINALIZADO' && s.estado !== 'CANCELADO'
                      }">
                  {{ s.estado }}
                </span>
              </td>
              <td class="p-4 text-sm font-black text-slate-800 text-right">
                {{ s.precio_final > 0 ? (s.precio_final | number:'1.2-2') : '-' }}
              </td>
            </tr>
            <tr *ngIf="reporteServicios().length === 0">
              <td colspan="9" class="p-8 text-center text-slate-400 font-bold">No hay servicios en este período.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </ng-container>

  <!-- TAB: Reporte IA -->
  <ng-container *ngIf="activeTab === 'ia'">
    <div class="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden mt-4 p-6">
      <h2 class="text-lg font-black text-slate-800 mb-1">Generador de Reportes con Inteligencia Artificial</h2>
      <p class="text-xs text-slate-400 font-medium mb-4">Escribe o dicta lo que quieres saber (Ej. "Quiero ver los vehículos con más servicios y el monto total cobrado")</p>
      
      <div class="relative mb-4">
        <textarea [(ngModel)]="promptIA" rows="3" 
          class="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] pl-5 pr-[6.5rem] py-4 text-sm text-slate-700 focus:outline-none focus:border-primary-500 resize-none shadow-inner" 
          placeholder="Pídele a la IA el reporte que necesitas... (Ej. ¿Qué mecánicos tienen servicios cancelados?)"></textarea>
        
        <div class="absolute bottom-3 right-3 flex items-center gap-2">
            <!-- Botón Micrófono -->
            <button (click)="toggleDictado()" 
              [class.bg-red-100]="escuchando()" [class.text-red-500]="escuchando()" 
              [class.bg-slate-200]="!escuchando()" [class.text-slate-500]="!escuchando()"
              class="flex items-center justify-center rounded-full w-10 h-10 hover:opacity-80 transition-opacity">
              <svg *ngIf="!escuchando()" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
              <svg *ngIf="escuchando()" class="w-5 h-5 animate-pulse text-red-500" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="6"></circle></svg>
            </button>
            
            <!-- Botón Enviar (Flecha) -->
            <button (click)="solicitarReporteIA()" [disabled]="cargandoIA() || !promptIA.trim()" 
              class="flex items-center justify-center bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:bg-slate-300 text-white rounded-full w-10 h-10 transition-colors shadow-sm">
              <svg *ngIf="!cargandoIA()" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
              <div *ngIf="cargandoIA()" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </button>
        </div>
      </div>

      <!-- Error IA -->
      <div *ngIf="errorIA()" class="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-4 text-sm font-bold">
        {{ errorIA() }}
      </div>

      <!-- Resultados IA -->
      <div *ngIf="resultadoIA() !== null" class="mt-8 border-t border-slate-100 pt-6">
        <div class="flex justify-between items-center mb-4 flex-wrap gap-4">
          <h3 class="text-md font-bold text-slate-800">Resultados de tu consulta</h3>
          <div class="flex gap-2">
            <button (click)="exportarIACsv()" class="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
              <svg class="w-4 h-4 mr-1 inline-block -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg> Exportar CSV
            </button>
            <button (click)="exportarIAPdf()" class="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
              <svg class="w-4 h-4 mr-1 inline-block -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg> Exportar PDF
            </button>
          </div>
        </div>
        
        <div class="overflow-x-auto border border-slate-100 rounded-xl">
          <table class="w-full text-left border-collapse" *ngIf="resultadoIA()!.length > 0">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-100">
                <th *ngFor="let col of columnasIA()" class="p-3 text-xs font-black uppercase tracking-wider text-slate-500">{{ col | uppercase }}</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of resultadoIA()" class="border-b border-slate-50 hover:bg-slate-50/50">
                <td *ngFor="let col of columnasIA()" class="p-3 text-sm text-slate-700">{{ row[col] !== null ? row[col] : '-' }}</td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="resultadoIA()!.length === 0" class="p-8 text-center text-slate-400 font-bold">
            La consulta no arrojó ningún resultado (Tabla vacía).
          </div>
        </div>
      </div>
    </div>
  </ng-container>

</div>
  `
})
export class ReportesComponent implements OnInit {
  private reportesService = inject(ReportesService);

  activeTab: 'mecanicos' | 'servicios' | 'ia' = 'mecanicos';
  
  reporteMecanicos = signal<any[]>([]);
  reporteServicios = signal<any[]>([]);
  
  cargando = signal(true);
  diasSeleccionados = 30;

  // Variables IA
  promptIA = '';
  resultadoIA = signal<any[] | null>(null);
  columnasIA = signal<string[]>([]);
  sqlEjecutado = signal<string>('');
  cargandoIA = signal(false);
  errorIA = signal<string | null>(null);
  escuchando = signal(false);
  private recognition: any;

  ngOnInit() {
    this.cargarTodos();
  }

  cargarTodos() {
    this.cargando.set(true);
    
    let callsCompleted = 0;
    const totalCalls = 2;

    const checkDone = () => {
      callsCompleted++;
      if (callsCompleted === totalCalls) {
        this.cargando.set(false);
      }
    };

    this.reportesService.obtenerReporteMecanicos(this.diasSeleccionados).subscribe({
      next: (data) => {
        this.reporteMecanicos.set(data);
        checkDone();
      },
      error: (err) => {
        console.error('Error cargando tabla mecanicos:', err);
        checkDone();
      }
    });

    this.reportesService.obtenerReporteServicios(this.diasSeleccionados).subscribe({
      next: (data) => {
        this.reporteServicios.set(data);
        checkDone();
      },
      error: (err) => {
        console.error('Error cargando tabla servicios:', err);
        checkDone();
      }
    });
  }

  // LOGICA IA
  initSpeechRecognition() {
    if ('webkitSpeechRecognition' in window) {
      const { webkitSpeechRecognition }: any = window as any;
      this.recognition = new webkitSpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'es-ES';

      this.recognition.onstart = () => {
        this.escuchando.set(true);
      };

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.promptIA += (this.promptIA ? ' ' : '') + transcript;
      };

      this.recognition.onerror = (event: any) => {
        console.error('Error de dictado:', event.error);
        this.escuchando.set(false);
      };

      this.recognition.onend = () => {
        this.escuchando.set(false);
      };
    } else {
      alert('Tu navegador no soporta dictado por voz (Usa Chrome o Edge).');
    }
  }

  toggleDictado() {
    if (!this.recognition) {
      this.initSpeechRecognition();
    }
    if (this.escuchando()) {
      this.recognition.stop();
    } else {
      this.recognition.start();
    }
  }

  solicitarReporteIA() {
    if (!this.promptIA.trim()) return;
    this.cargandoIA.set(true);
    this.errorIA.set(null);
    this.resultadoIA.set(null);
    
    this.reportesService.generarReporteIA(this.promptIA).subscribe({
      next: (res) => {
        if (res.exito && res.data) {
          this.resultadoIA.set(res.data);
          this.sqlEjecutado.set(res.sql_ejecutado || '');
          if (res.data.length > 0) {
            this.columnasIA.set(Object.keys(res.data[0]));
          } else {
            this.columnasIA.set([]);
          }
        } else {
          this.errorIA.set(res.error || 'La IA devolvió un error de sintaxis.');
        }
        this.cargandoIA.set(false);
      },
      error: (err) => {
        console.error('Error IA:', err);
        this.errorIA.set('Hubo un error de conexión con la IA de Groq o el Backend.');
        this.cargandoIA.set(false);
      }
    });
  }


  // EXPORTS
  private formatearFecha(isoString: string): string {
    if (!isoString) return '';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString; // si no es fecha válida, devuelve el original
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  private formatearValor(val: any): string {
    if (val === null || val === undefined) return '';
    if (typeof val === 'string' && val.includes('T') && (val.includes('+00:00') || val.includes('Z'))) {
        return this.formatearFecha(val);
    }
    return val.toString();
  }

  private exportarCsv(data: any[], filename: string) {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]);
    const BOM = '\uFEFF'; // Para que Excel lea UTF-8 correctamente
    const csvContent = BOM + [
      headers.map(h => h.toUpperCase().replace(/_/g, ' ')).join(';'), // Usamos ; para Excel
      ...data.map(row => headers.map(header => `"${this.formatearValor(row[header]).replace(/"/g, '""')}"`).join(';'))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }

  private exportarPdf(data: any[], title: string, filename: string) {
    if (!data || data.length === 0) return;
    const doc = new jsPDF('landscape');
    
    // Título Formal
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text(title, 14, 20);
    
    // Subtítulo
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generado el: ${this.formatearFecha(new Date().toISOString())}`, 14, 26);

    const rawHeaders = Object.keys(data[0]);
    const headers = rawHeaders.map(h => h.toUpperCase().replace(/_/g, ' '));
    const body = data.map(row => rawHeaders.map(h => this.formatearValor(row[h]) || '-'));
    
    autoTable(doc, {
      head: [headers],
      body: body,
      startY: 32,
      styles: { 
        fontSize: 7, 
        cellPadding: 2,
        overflow: 'linebreak',
        font: 'helvetica'
      },
      headStyles: { 
        fillColor: [15, 23, 42], // Slate 900
        textColor: 255, 
        fontStyle: 'bold',
        halign: 'center'
      },
      alternateRowStyles: { 
        fillColor: [248, 250, 252] // Slate 50
      },
      columnStyles: {
        0: { cellWidth: 15 }, // ID o Mecánico (para que no ocupe mucho si es ID)
      },
      theme: 'grid'
    });
    
    doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  exportarMecanicosCSV() {
    this.exportarCsv(this.reporteMecanicos(), 'reporte_mecanicos');
  }

  exportarMecanicosPDF() {
    this.exportarPdf(this.reporteMecanicos(), 'Reporte de Rendimiento de Mecánicos', 'reporte_mecanicos');
  }

  exportarServiciosCSV() {
    this.exportarCsv(this.reporteServicios(), 'historial_servicios');
  }

  exportarServiciosPDF() {
    this.exportarPdf(this.reporteServicios(), 'Historial Detallado de Servicios', 'historial_servicios');
  }

  exportarIACsv() {
    if (this.resultadoIA()) this.exportarCsv(this.resultadoIA()!, 'reporte_personalizado_ia');
  }

  exportarIAPdf() {
    if (this.resultadoIA()) this.exportarPdf(this.resultadoIA()!, 'Reporte Personalizado (Generado por IA)', 'reporte_personalizado_ia');
  }
}
