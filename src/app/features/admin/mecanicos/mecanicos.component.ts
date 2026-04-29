import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MecanicoService } from '../../../core/services/mecanico.service';
import { TipoServicioService } from '../../../core/services/tipo-servicio.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-mecanicos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
<div class="space-y-8">
  <div class="flex justify-between items-center">
    <div>
      <h1 class="text-3xl font-black text-slate-800 tracking-tight">Mecánicos</h1>
      <p class="text-slate-500 font-medium">Gestiona el equipo técnico de tu taller</p>
    </div>
    <button (click)="openModal()" class="btn-primary px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-primary-500/20 active:scale-95 transition-all">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      <span>Nuevo Mecánico</span>
    </button>
  </div>

  <!-- TABLE -->
  <div class="bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="bg-slate-50/50 border-b border-slate-100">
          <th class="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Nombre</th>
          <th class="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Correo</th>
          <th class="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Teléfono</th>
          <th class="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Especialidad</th>
          <th class="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Acciones</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100">
        <tr *ngFor="let mec of mecanicos()" class="hover:bg-slate-50/50 transition-colors group">
          <td class="px-8 py-5">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center font-bold">
                {{ mec.nombre?.charAt(0) }}
              </div>
              <span class="font-bold text-slate-700">{{ mec.nombre }}</span>
            </div>
          </td>
          <td class="px-8 py-5 text-slate-500 text-sm">{{ mec.correo }}</td>
          <td class="px-8 py-5 text-slate-500 text-sm">{{ mec.telefono || 'N/A' }}</td>
          <td class="px-8 py-5">
            <span class="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-lg">
              Registrado
            </span>
          </td>
          <td class="px-8 py-5 text-right">
            <div class="flex justify-end gap-2">
              <button (click)="openModal(mec)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition-all shadow-sm" title="Editar">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>
              </button>
              <button (click)="eliminar(mec.id)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </div>
          </td>
        </tr>
        <tr *ngIf="mecanicos().length === 0">
          <td colspan="5" class="px-8 py-20 text-center text-slate-400 italic">
            No hay mecánicos registrados en este taller.
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- MODAL -->
  <div *ngIf="isModalOpen()" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" (click)="closeModal()"></div>
    <div class="bg-white w-full max-w-lg max-h-[90vh] flex flex-col rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden border border-slate-100">
      <div class="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h2 class="text-xl font-bold text-slate-800">{{ editingId() ? 'Editar Mecánico' : 'Nuevo Mecánico' }}</h2>
        <button (click)="closeModal()" class="text-slate-400 hover:text-slate-600">✕</button>
      </div>

      <form [formGroup]="mecForm" (ngSubmit)="guardar()" class="p-8 space-y-5 overflow-y-auto">
        <div>
          <label class="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Nombre Completo</label>
          <input type="text" formControlName="nombre" class="form-input-custom" placeholder="Ej: Roberto Gomez">
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Correo Electrónico</label>
          <input type="email" formControlName="correo" class="form-input-custom" placeholder="roberto@taller.io">
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Teléfono</label>
          <input type="text" formControlName="telefono" class="form-input-custom" placeholder="Ej: +591 71234567">
        </div>
        <div *ngIf="!editingId()">
          <label class="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Contraseña Temporal</label>
          <input type="text" formControlName="password" class="form-input-custom" placeholder="Mínimo 6 caracteres">
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-500 uppercase mb-3 ml-1">Especialidades (Tipos de Servicio)</label>
          <div class="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-2xl">
            <label *ngFor="let ts of tiposServicio()" class="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer hover:bg-slate-100 p-2 rounded-xl transition-colors">
              <input type="checkbox" [checked]="selectedEspecialidades().includes(ts.id)" (change)="toggleEspecialidad(ts.id)" class="accent-primary-500 w-4 h-4 rounded border-slate-300">
              {{ ts.nombre }}
            </label>
            <div *ngIf="tiposServicio().length === 0" class="col-span-2 text-xs text-slate-400 italic text-center py-2">
              No hay servicios registrados.
            </div>
          </div>
        </div>

        <div class="pt-4 flex gap-4">
          <button type="button" (click)="closeModal()" class="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-colors">Cancelar</button>
          <button type="submit" [disabled]="mecForm.invalid || loading()" class="flex-1 bg-primary-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary-500/20 disabled:opacity-50">
            {{ loading() ? 'Guardando...' : (editingId() ? 'Guardar Cambios' : 'Crear Mecánico') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
  `,
  styles: [`
    .form-input-custom {
      @apply w-full bg-slate-50 border-slate-200 text-slate-900 px-4 py-3.5 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all placeholder:text-slate-300;
    }
  `]
})
export class MecanicosComponent implements OnInit {
  private service = inject(MecanicoService);
  private tipoService = inject(TipoServicioService);
  private fb = inject(FormBuilder);

  mecanicos = signal<any[]>([]);
  tiposServicio = signal<any[]>([]);
  selectedEspecialidades = signal<number[]>([]);

  isModalOpen = signal(false);
  loading = signal(false);
  editingId = signal<number | null>(null);

  mecForm: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    password: ['123456'],
    telefono: ['']
  });

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.service.listar().subscribe(res => this.mecanicos.set(res));
    this.tipoService.listar().subscribe(res => this.tiposServicio.set(res));
  }

  toggleEspecialidad(id: number) {
    const current = this.selectedEspecialidades();
    if (current.includes(id)) {
      this.selectedEspecialidades.set(current.filter(e => e !== id));
    } else {
      this.selectedEspecialidades.set([...current, id]);
    }
  }

  openModal(mec: any = null) {
    if (mec) {
      this.editingId.set(mec.id);
      this.mecForm.patchValue({
        nombre: mec.nombre,
        correo: mec.correo,
        telefono: mec.telefono,
        password: '' // No se actualiza el password desde aquí
      });
      // Para remover la validador requerida en la edición
      this.mecForm.get('password')?.clearValidators();
      this.mecForm.get('password')?.updateValueAndValidity();

      this.selectedEspecialidades.set(mec.especialidades || []);
    } else {
      this.editingId.set(null);
      this.mecForm.reset({password: '123456'});
      this.mecForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.mecForm.get('password')?.updateValueAndValidity();
      this.selectedEspecialidades.set([]);
    }
    
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  guardar() {
    if (this.mecForm.invalid) return;
    this.loading.set(true);

    const payload = {
      ...this.mecForm.value,
      especialidades: this.selectedEspecialidades()
    };
    
    // Si estamos editando, borramos el password del payload para que el backend lo evite o no dé error
    if (this.editingId()) {
      delete payload.password;
    }

    const id = this.editingId();
    const action$ = id ? this.service.actualizar(id, payload) : this.service.crear(payload);

    action$.subscribe({
      next: () => {
        this.cargar();
        this.closeModal();
        this.loading.set(false);
      },
      error: (err) => {
        alert(err.error?.detail || 'Error al guardar');
        this.loading.set(false);
      }
    });
  }

  eliminar(id: number) {
    if (confirm('¿Estás seguro de eliminar este mecánico?')) {
      this.service.eliminar(id).subscribe(() => this.cargar());
    }
  }
}
