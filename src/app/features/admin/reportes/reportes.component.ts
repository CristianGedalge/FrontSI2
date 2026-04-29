import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-reportes',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="space-y-8">
  <div class="flex justify-between items-center">
    <div>
      <h1 class="text-3xl font-black text-slate-800 tracking-tight">Reportes</h1>
      <p class="text-slate-500 font-medium">Estadísticas y análisis de rendimiento</p>
    </div>
  </div>

  <div class="bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-slate-100 p-12 text-center">
    <div class="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    </div>
    <h2 class="text-xl font-bold text-slate-700 mb-2">Próximamente</h2>
    <p class="text-slate-400">El módulo de reportes gráficos y exportación de datos está en construcción.</p>
  </div>
</div>
  `
})
export class ReportesComponent {
}
