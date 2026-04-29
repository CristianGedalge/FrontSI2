import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
<aside class="w-64 bg-slate-900 h-screen fixed left-0 top-0 text-white flex flex-col shadow-2xl z-50">
  <!-- LOGO -->
  <div class="p-8 flex items-center gap-3 border-b border-slate-800/50">
    <div class="bg-primary-500 p-2.5 rounded-2xl text-white shadow-lg shadow-primary-500/20">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17 17.25 21A2.673 2.673 0 0 1 13.917 21l-5.83-5.83M11.42 15.17l2.83-2.83m-2.83 2.83-5.66-5.66m1.415-1.414 1.414-1.414m-1.414 1.414L11.42 15.17Zm4.242-4.242a2.828 2.828 0 1 1-4.001-4.002 2.828 2.828 0 0 1 4.001 4.002Z" />
      </svg>
    </div>
    <span class="font-black text-2xl tracking-tighter italic">TallerIO</span>
  </div>

  <!-- MENU ITEMS -->
  <nav class="flex-grow p-6 space-y-3 mt-4">
    <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-4">Menú Principal</p>
    
    <a routerLink="/admin/dashboard" routerLinkActive="bg-primary-500 text-white shadow-lg shadow-primary-500/20" [routerLinkActiveOptions]="{exact: true}" 
       class="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all group">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 group-hover:scale-110 transition-transform">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6v7.5m16.5-7.5v7.5m-16.5 4.5h16.5M4.5 9h15M5.25 12h13.5m-14.25 3h15m-15.75 3h16.5" />
      </svg>
      <span class="font-bold text-sm">Dashboard</span>
    </a>

    <a *ngIf="auth.currentUser()?.rol === 'admin'" routerLink="/admin/mecanicos" routerLinkActive="bg-primary-500 text-white shadow-lg shadow-primary-500/20"
       class="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all group">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 group-hover:scale-110 transition-transform">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
      <span class="font-bold text-sm">Mecánicos</span>
    </a>

    <a *ngIf="auth.currentUser()?.rol === 'admin'" routerLink="/admin/notificaciones" routerLinkActive="bg-primary-500 text-white shadow-lg shadow-primary-500/20"
       class="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all group relative">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 group-hover:scale-110 transition-transform">
        <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
      </svg>
      <span class="font-bold text-sm">Notificaciones</span>
    </a>

    <a *ngIf="auth.currentUser()?.rol === 'admin'" routerLink="/admin/reportes" routerLinkActive="bg-primary-500 text-white shadow-lg shadow-primary-500/20"
       class="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all group">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 group-hover:scale-110 transition-transform">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
      <span class="font-bold text-sm">Reportes</span>
    </a>

    <a *ngIf="auth.currentUser()?.rol === 'admin'" routerLink="/admin/historial" routerLinkActive="bg-primary-500 text-white shadow-lg shadow-primary-500/20"
       class="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all group">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 group-hover:scale-110 transition-transform">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
      <span class="font-bold text-sm">Historial</span>
    </a>

    <a *ngIf="auth.currentUser()?.rol === 'superadmin'" routerLink="/super-admin/talleres" routerLinkActive="bg-primary-500 text-white shadow-lg shadow-primary-500/20"
       class="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all group">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 group-hover:scale-110 transition-transform">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 7.364l4.5 1.636M12.75 10.75L15 4.5M4.5 5.455V21m0 0h1.5" />
      </svg>
      <span class="font-bold text-sm">Talleres</span>
    </a>

    <a *ngIf="auth.currentUser()?.rol === 'superadmin'" routerLink="/super-admin/tipos-servicio" routerLinkActive="bg-primary-500 text-white shadow-lg shadow-primary-500/20"
       class="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all group">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 group-hover:scale-110 transition-transform">
        <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17L17.25 21A2.673 2.673 0 0113.917 21l-5.83-5.83M11.42 15.17l2.83-2.83m-2.83 2.83-5.66-5.66m1.415-1.414l1.414-1.414m-1.414 1.414L11.42 15.17Zm4.242-4.242a2.828 2.828 0 11-4.001-4.002 2.828 2.828 0 014.001 4.002Z" />
      </svg>
      <span class="font-bold text-sm">Servicios</span>
    </a>

    <a *ngIf="auth.currentUser()?.rol === 'superadmin'" routerLink="/super-admin/usuarios" routerLinkActive="bg-primary-500 text-white shadow-lg shadow-primary-500/20"
       class="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all group">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 group-hover:scale-110 transition-transform">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
      <span class="font-bold text-sm">Usuarios</span>
    </a>
  </nav>

  <!-- USER PROFILE SECTION -->
  <div class="p-6 border-t border-slate-800/50">
    <div class="bg-slate-800/40 p-4 rounded-[1.5rem] flex items-center gap-3 border border-slate-700/30">
      <div class="w-11 h-11 bg-primary-500/10 border border-primary-500/20 text-primary-500 rounded-2xl flex items-center justify-center font-black text-lg">
        {{ auth.currentUser()?.nombre?.charAt(0) }}
      </div>
      <div class="flex-grow overflow-hidden">
        <p class="text-xs font-black truncate leading-tight">{{ auth.currentUser()?.nombre }}</p>
        <p class="text-[10px] text-slate-500 truncate lowercase font-bold">{{ auth.currentUser()?.rol }}</p>
      </div>
    </div>
    
    <button (click)="logout()" class="w-full mt-6 flex items-center justify-center gap-2 group text-xs font-black uppercase tracking-tighter text-slate-500 hover:text-red-400 transition-all py-3 rounded-xl hover:bg-red-500/5">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 group-hover:-translate-x-1 transition-transform">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
      </svg>
      <span>Cerrar Sesión</span>
    </button>
  </div>
</aside>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class Sidebar {
  auth = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
