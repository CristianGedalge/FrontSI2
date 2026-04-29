import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TipoServicioService } from '../../../core/services/tipo-servicio.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-tipos-servicio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
<div class="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
  <div class="flex justify-between items-center">
    <div>
      <h1 class="text-3xl font-black text-slate-800 tracking-tight">Tipos de Servicio</h1>
      <p class="text-slate-500 font-medium tracking-tight">Define las categorías de servicios disponibles en la plataforma</p>
    </div>
    <button (click)="openModal()" class="btn-primary rounded-2xl px-6 py-3.5 font-bold flex items-center gap-2 shadow-xl shadow-primary-500/20 active:scale-95 transition-all">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      <span>Nuevo Tipo</span>
    </button>
  </div>

  <!-- LISTA DE TIPOS -->
  <div class="bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="bg-slate-50/50 border-b border-slate-100">
          <th class="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Nombre</th>
          <th class="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Descripción</th>
          <th class="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Acciones</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100">
        <tr *ngFor="let tipo of tipos()" class="hover:bg-slate-50/50 transition-colors group">
          <td class="px-8 py-5">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center font-bold shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17L17.25 21A2.673 2.673 0 0113.917 21l-5.83-5.83M11.42 15.17l2.83-2.83m-2.83 2.83-5.66-5.66m1.415-1.414l1.414-1.414m-1.414 1.414L11.42 15.17Zm4.242-4.242a2.828 2.828 0 11-4.001-4.002 2.828 2.828 0 014.001 4.002Z" />
                </svg>
              </div>
              <span class="font-bold text-slate-700">{{ tipo.nombre }}</span>
            </div>
          </td>
          <td class="px-8 py-5 text-slate-500 text-sm max-w-[300px] truncate" title="{{ tipo.descripcion }}">{{ tipo.descripcion || 'Sin descripción detallada.' }}</td>
          <td class="px-8 py-5 text-right">
            <div class="flex justify-end gap-2">
              <button (click)="openModal(tipo)" class="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors border border-slate-100">
                Editar
              </button>
              <button (click)="eliminar(tipo.id)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </div>
          </td>
        </tr>
        <tr *ngIf="tipos().length === 0">
          <td colspan="3" class="px-8 py-20 text-center text-slate-400 italic">
            No hay tipos de servicio registrados.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- MODAL -->
  <div *ngIf="isModalOpen()" class="fixed inset-0 z-[70] flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-md" (click)="closeModal()"></div>
    <div class="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
      <div class="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h2 class="text-xl font-bold text-slate-800">{{ editingId() ? 'Editar Tipo' : 'Nuevo Tipo de Servicio' }}</h2>
        <button (click)="closeModal()" class="text-slate-400 hover:text-slate-600">✕</button>
      </div>

      <form [formGroup]="tipoForm" (ngSubmit)="guardar()" class="p-8 space-y-6">
        <div>
          <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nombre del Servicio</label>
          <input type="text" formControlName="nombre" class="form-input-custom" placeholder="Ej: Mecánica General">
        </div>
        <div>
          <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Descripción</label>
          <textarea formControlName="descripcion" rows="4" class="form-input-custom resize-none" placeholder="Breve descripción de qué incluye este servicio..."></textarea>
        </div>

        <div class="pt-4 flex gap-4">
          <button type="button" (click)="closeModal()" class="flex-1 py-4 text-slate-400 font-bold hover:bg-slate-50 rounded-2xl transition-colors">Cancelar</button>
          <button type="submit" [disabled]="tipoForm.invalid || loading()" class="flex-1 bg-primary-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary-500/20 disabled:opacity-50">
            {{ loading() ? 'Guardando...' : (editingId() ? 'Actualizar' : 'Crear Servicio') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
  `,
  styles: [`
    .form-input-custom {
      @apply w-full bg-slate-50 border-slate-200 text-slate-900 px-5 py-4 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all placeholder:text-slate-300 text-sm;
    }
  `]
})
export class TiposServicioComponent implements OnInit {
  private service = inject(TipoServicioService);
  private fb = inject(FormBuilder);

  tipos = signal<any[]>([]);
  isModalOpen = signal(false);
  loading = signal(false);
  editingId = signal<number | null>(null);

  tipoForm = this.fb.group({
    nombre: ['', [Validators.required]],
    descripcion: ['']
  });

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.service.listar().subscribe(res => this.tipos.set(res));
  }

  openModal(tipo?: any) {
    if (tipo) {
      this.editingId.set(tipo.id);
      this.tipoForm.patchValue({
        nombre: tipo.nombre,
        descripcion: tipo.descripcion
      });
    } else {
      this.editingId.set(null);
      this.tipoForm.reset();
    }
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  guardar() {
    if (this.tipoForm.invalid) return;
    this.loading.set(true);

    const obs = this.editingId() 
      ? this.service.actualizar(this.editingId()!, this.tipoForm.value)
      : this.service.crear(this.tipoForm.value);

    obs.subscribe({
      next: () => {
        this.cargar();
        this.closeModal();
        this.loading.set(false);
      },
      error: (err) => {
        alert(err.error?.detail || 'Error al procesar');
        this.loading.set(false);
      }
    });
  }

  eliminar(id: number) {
    if (confirm('¿Estás seguro de eliminar este tipo de servicio?')) {
      this.service.eliminar(id).subscribe(() => this.cargar());
    }
  }
}
