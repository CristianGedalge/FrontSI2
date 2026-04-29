import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TallerService } from '../../../core/services/taller.service';

@Component({
  selector: 'app-talleres',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="space-y-8 animate-in fade-in duration-500">
  <div class="flex justify-between items-center">
    <div>
      <h1 class="text-3xl font-black text-slate-800 tracking-tight">Gestión de Talleres</h1>
      <p class="text-slate-500 font-medium">Panel de control global de la red TallerIO</p>
    </div>
    <div class="flex gap-4">
       <div class="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
         <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Talleres</span>
         <span class="text-2xl font-black text-primary-500">{{ talleres().length }}</span>
       </div>
    </div>
  </div>

  <!-- LISTA DE TALLERES (CARDS) -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    <div *ngFor="let taller of talleres()" class="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden">
      <!-- Decoración superior -->
      <div class="h-32 bg-slate-900 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-transparent"></div>
        <div class="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
          {{ taller.estado ? 'Activo' : 'Inactivo' }}
        </div>
      </div>

      <div class="p-8 -mt-16 relative">
        <div class="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-4 border border-slate-50 group-hover:scale-110 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-primary-500">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 7.364l4.5 1.636M12.75 10.75L15 4.5M4.5 5.455V21m0 0h1.5" />
          </svg>
        </div>
        
        <h3 class="text-xl font-bold text-slate-800 mb-1">{{ taller.nombre }}</h3>
        <p class="text-slate-400 text-sm mb-6 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-primary-500">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
          {{ taller.direccion }}
        </p>

        <div class="space-y-3 mb-8">
          <div class="flex items-center justify-between text-xs py-2 border-b border-dashed border-slate-100">
            <span class="text-slate-400 font-bold uppercase tracking-tighter">Teléfono:</span>
            <span class="text-slate-700 font-medium">{{ taller.telefono || 'N/A' }}</span>
          </div>
          <div class="flex items-center justify-between text-xs py-2 border-b border-dashed border-slate-100">
            <span class="text-slate-400 font-bold uppercase tracking-tighter">Admin ID:</span>
            <span class="text-slate-700 font-medium">#{{ taller.admin_id }}</span>
          </div>
        </div>

        <div class="flex gap-3">
          <button class="flex-1 py-3 text-xs font-black uppercase tracking-widest text-slate-500 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
            Detalles
          </button>
          <button (click)="eliminar(taller.id)" class="px-4 py-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- EMPTY STATE -->
  <div *ngIf="talleres().length === 0" class="py-20 text-center">
    <div class="inline-flex items-center justify-center w-24 h-24 bg-slate-100 rounded-[2.5rem] text-slate-300 mb-6">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
      </svg>
    </div>
    <h3 class="text-xl font-bold text-slate-400">No hay talleres registrados aún</h3>
  </div>
</div>
  `,
})
export class TalleresComponent implements OnInit {
  private service = inject(TallerService);
  talleres = signal<any[]>([]);

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.service.listar().subscribe(res => this.talleres.set(res));
  }

  eliminar(id: number) {
    if (confirm('¿Estás seguro de eliminar este taller? Esta acción es irreversible.')) {
      this.service.eliminar(id).subscribe(() => this.cargar());
    }
  }
}
