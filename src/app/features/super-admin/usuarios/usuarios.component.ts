import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from '../../../core/services/usuario.service';

@Component({
  selector: 'app-superadmin-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
<div class="space-y-8">
  <div class="flex justify-between items-center">
    <div>
      <h1 class="text-3xl font-black text-slate-800 tracking-tight">Usuarios</h1>
      <p class="text-slate-500 font-medium">Gestión global de cuentas de usuario</p>
    </div>
  </div>

  <!-- TABLE -->
  <div class="bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="bg-slate-50/50 border-b border-slate-100">
          <th class="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Nombre</th>
          <th class="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Correo</th>
          <th class="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Teléfono</th>
          <th class="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Rol</th>
          <th class="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Estado</th>
          <th class="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Acciones</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100">
        <tr *ngFor="let user of usuarios()" class="hover:bg-slate-50/50 transition-colors group">
          <td class="px-8 py-5">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center font-bold">
                {{ user.nombre?.charAt(0) }}
              </div>
              <span class="font-bold text-slate-700">{{ user.nombre }}</span>
            </div>
          </td>
          <td class="px-8 py-5 text-slate-500 text-sm">{{ user.correo }}</td>
          <td class="px-8 py-5 text-slate-500 text-sm">{{ user.telefono || 'N/A' }}</td>
          <td class="px-8 py-5">
            <span class="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase rounded-lg"
                  [ngClass]="{'bg-purple-100 text-purple-600': user.rol === 'superadmin', 'bg-blue-100 text-blue-600': user.rol === 'admin', 'bg-emerald-100 text-emerald-600': user.rol === 'mecanico'}">
              {{ user.rol }}
            </span>
          </td>
          <td class="px-8 py-5">
            <span class="px-3 py-1 text-[10px] font-black uppercase rounded-lg"
                  [ngClass]="user.estado ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'">
              {{ user.estado ? 'Activo' : 'Inactivo' }}
            </span>
          </td>
          <td class="px-8 py-5 text-right">
            <div class="flex justify-end gap-2">
              <button (click)="openModal(user)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition-all shadow-sm" title="Editar Rol">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>
              </button>
              <button (click)="eliminar(user.id)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm" title="Eliminar Usuario">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </div>
          </td>
        </tr>
        <tr *ngIf="usuarios().length === 0">
          <td colspan="6" class="px-8 py-20 text-center text-slate-400 italic">
            No hay usuarios registrados.
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- MODAL EDITAR ROL -->
  <div *ngIf="isModalOpen()" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" (click)="closeModal()"></div>
    <div class="bg-white w-full max-w-md max-h-[90vh] flex flex-col rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden border border-slate-100">
      <div class="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h2 class="text-xl font-bold text-slate-800">Actualizar Rol de Usuario</h2>
        <button (click)="closeModal()" class="text-slate-400 hover:text-slate-600">✕</button>
      </div>

      <form [formGroup]="userForm" (ngSubmit)="guardar()" class="p-8 space-y-5 overflow-y-auto">
        <div>
          <label class="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Rol del Usuario</label>
          <select formControlName="rol" class="form-input-custom">
            <option value="superadmin">SuperAdmin</option>
            <option value="admin">Administrador de Taller</option>
            <option value="mecanico">Mecánico</option>
            <option value="cliente">Cliente</option>
          </select>
        </div>

        <div class="pt-4 flex gap-4">
          <button type="button" (click)="closeModal()" class="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-colors">Cancelar</button>
          <button type="submit" [disabled]="userForm.invalid || loading()" class="flex-1 bg-primary-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary-500/20 disabled:opacity-50">
            {{ loading() ? 'Guardando...' : 'Guardar Cambios' }}
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
export class UsuariosComponent implements OnInit {
  private service = inject(UsuarioService);
  private fb = inject(FormBuilder);

  usuarios = signal<any[]>([]);
  isModalOpen = signal(false);
  loading = signal(false);
  editingId = signal<number | null>(null);

  userForm: FormGroup = this.fb.group({
    rol: ['', Validators.required]
  });

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.service.listar().subscribe({
      next: (res: any) => this.usuarios.set(res),
      error: (err: any) => console.error("Error cargando usuarios:", err)
    });
  }

  openModal(user: any) {
    this.editingId.set(user.id);
    this.userForm.patchValue({ rol: user.rol });
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.editingId.set(null);
  }

  guardar() {
    if (this.userForm.invalid || !this.editingId()) return;
    this.loading.set(true);

    const payload = this.userForm.value;
    
    this.service.actualizar(this.editingId()!, payload).subscribe({
      next: () => {
        this.cargar();
        this.closeModal();
        this.loading.set(false);
      },
      error: (err: any) => {
        alert(err.error?.detail || 'Error al actualizar usuario');
        this.loading.set(false);
      }
    });
  }

  eliminar(id: number) {
    if (confirm('¿Estás seguro de eliminar (desactivar) a este usuario del sistema?')) {
      this.service.eliminar(id).subscribe({
        next: () => this.cargar(),
        error: (err: any) => alert(err.error?.detail || 'Error al eliminar usuario')
      });
    }
  }
}
