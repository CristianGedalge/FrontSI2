import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [JsonPipe],
  template: `
<div class="min-h-screen bg-slate-50 flex flex-col font-sans">
  <nav class="bg-white border-b px-8 py-4 flex justify-between items-center shadow-sm">
    <div class="flex items-center gap-2">
      <div class="bg-primary-500 text-white p-1.5 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17 17.25 21A2.673 2.673 0 0 1 13.917 21l-5.83-5.83M11.42 15.17l2.83-2.83m-2.83 2.83-5.66-5.66m1.415-1.414 1.414-1.414m-1.414 1.414L11.42 15.17Zm4.242-4.242a2.828 2.828 0 1 1-4.001-4.002 2.828 2.828 0 0 1 4.001 4.002Z" />
        </svg>
      </div>
      <h1 class="text-xl font-bold text-slate-800 tracking-tight">Panel TallerIO</h1>
    </div>
    <div class="flex items-center gap-6">
      <div class="text-right">
        <p class="text-sm font-bold text-slate-900 leading-none mb-1">{{ auth.currentUser()?.nombre }}</p>
        <p class="text-xs text-slate-400 leading-none">{{ auth.currentUser()?.correo }}</p>
      </div>
      <button (click)="logout()" class="btn border border-slate-200 text-slate-600 hover:bg-slate-50 py-2 text-sm px-4">
        Cerrar Sesión
      </button>
    </div>
  </nav>
  
  <main class="p-8 max-w-7xl mx-auto w-full">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
      <div class="bg-white p-8 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center gap-4">
        <div class="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center text-2xl">✓</div>
        <div>
          <h3 class="text-slate-400 text-xs font-bold uppercase tracking-wider">Estatus</h3>
          <p class="text-xl font-black text-slate-800">Taller Activo</p>
        </div>
      </div>
      <div class="bg-white p-8 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center gap-4">
        <div class="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center text-2xl">👥</div>
        <div>
          <h3 class="text-slate-400 text-xs font-bold uppercase tracking-wider">Mecánicos</h3>
          <p class="text-xl font-black text-slate-800">0 Registrados</p>
        </div>
      </div>
      <div class="bg-white p-8 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center gap-4">
        <div class="w-12 h-12 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center text-2xl">⚡</div>
        <div>
          <h3 class="text-slate-400 text-xs font-bold uppercase tracking-wider">Servicios</h3>
          <p class="text-xl font-black text-slate-800">0 Solicitudes</p>
        </div>
      </div>
    </div>

    <div class="bg-white p-12 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.02)] border border-slate-100 min-h-[400px] flex flex-col items-center justify-center text-center">
       <div class="max-w-md">
         <div class="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 text-slate-300">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
            </svg>
         </div>
         <h2 class="text-2xl font-bold text-slate-800 mb-4">¡Sesión Iniciada!</h2>
         <p class="text-slate-500 italic mb-8">El panel administrativo está siendo preparado. Abajo puedes ver los metadatos decodificados de tu sesión actual.</p>
         
         <div class="bg-slate-900 rounded-3xl p-6 text-left shadow-2xl overflow-hidden border border-slate-800">
            <div class="flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
              <div class="w-2 h-2 rounded-full bg-red-500"></div>
              <div class="w-2 h-2 rounded-full bg-yellow-500"></div>
              <div class="w-2 h-2 rounded-full bg-green-500"></div>
              <span class="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-2">JWT payload debug</span>
            </div>
            <pre class="text-emerald-400 text-[11px] leading-relaxed font-mono">
{{ auth.currentUser() | json }}
            </pre>
         </div>
       </div>
    </div>
  </main>
</div>
  `,
})
export class AdminDashboard {
  auth = inject(AuthService);
  router = inject(Router);

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
