import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-notificaciones',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="space-y-8">
  <div class="flex justify-between items-center">
    <div>
      <h1 class="text-3xl font-black text-slate-800 tracking-tight">Notificaciones</h1>
      <p class="text-slate-500 font-medium">Alertas y avisos del taller en tiempo real</p>
    </div>
  </div>

  <div class="bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-slate-100 p-12 text-center">
    <div class="w-24 h-24 bg-blue-50 text-blue-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10">
        <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
      </svg>
    </div>
    <h2 class="text-xl font-bold text-slate-700 mb-2">Bandeja Vacía</h2>
    <p class="text-slate-400">Actualmente no tienes notificaciones pendientes. Aquí aparecerán las alertas importantes.</p>
  </div>
</div>
  `
})
export class NotificacionesComponent {
}
