import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
<div class="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans">
  
  <div class="absolute top-0 left-0 w-full h-full opacity-40">
    <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[120px]"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]"></div>
  </div>

  <div class="w-full max-w-md px-6 relative z-10 transition-all" [ngClass]="{'scale-95 opacity-50': loading()}">
    
    <div class="flex justify-center mb-10">
      <a routerLink="/" class="flex items-center gap-2 group flex-col">
        <div class="bg-primary-500 text-white p-3 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17 17.25 21A2.673 2.673 0 0 1 13.917 21l-5.83-5.83M11.42 15.17l2.83-2.83m-2.83 2.83-5.66-5.66m1.415-1.414 1.414-1.414m-1.414 1.414L11.42 15.17Zm4.242-4.242a2.828 2.828 0 1 1-4.001-4.002 2.828 2.828 0 0 1 4.001 4.002Z" />
          </svg>
        </div>
        <span class="font-bold text-2xl text-slate-800 tracking-tight mt-3">TallerIO</span>
      </a>
    </div>

    <div class="bg-white/80 backdrop-blur-xl border border-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-slate-900 mb-2">Bienvenido</h2>
        <p class="text-slate-500 text-sm italic">Acceso exclusivo para propietarios</p>
      </div>

      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5">
        <div class="form-group mb-0">
          <label class="block text-slate-700 text-sm font-semibold mb-2 ml-1" for="email">Email Corporativo</label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
            </span>
            <input type="email" id="email" formControlName="correo" class="w-full bg-slate-50 border-slate-200 text-slate-900 pl-12 pr-4 py-3.5 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all placeholder:text-slate-300" placeholder="usuario@taller.io">
          </div>
        </div>

        <div class="form-group mb-0">
          <label class="block text-slate-700 text-sm font-semibold mb-2 ml-1" for="password">Contraseña</label>
          <div class="relative">
             <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </span>
            <input type="password" id="password" formControlName="password" class="w-full bg-slate-50 border-slate-200 text-slate-900 pl-12 pr-4 py-3.5 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all placeholder:text-slate-300" placeholder="••••••••">
          </div>
        </div>

        <div class="flex items-center justify-between text-xs font-medium">
          <label class="flex items-center gap-2 text-slate-500 cursor-pointer">
            <input type="checkbox" class="accent-primary-500 w-4 h-4 rounded border-slate-300">
            Recordarme
          </label>
          <a href="#" class="text-primary-600 hover:text-primary-700 transition-colors">¿Olvidaste tu contraseña?</a>
        </div>

        <button type="submit" [disabled]="loginForm.invalid || loading()" class="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary-500/20 transition-all transform hover:-translate-y-1 active:scale-[0.98] mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
          <span *ngIf="!loading()">Entrar al Panel</span>
          <span *ngIf="loading()">Autenticando...</span>
        </button>
      </form>

      <div class="mt-8 text-center text-sm">
        <p class="text-slate-500">
          ¿Nuevo taller en la red? 
          <a routerLink="/register" class="text-primary-600 font-bold hover:underline ml-1">Crea tu cuenta</a>
        </p>
      </div>
    </div>

    <p class="text-center text-slate-400 text-xs mt-12 mb-6">
      © 2026 TallerIO Enterprise Edition.
    </p>
  </div>
</div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);

  loginForm: FormGroup = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading.set(true);
    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        const user = this.authService.currentUser();
        if (user && user.rol === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          // Si es super-admin u otro, podrías redirigir a otro lado
          this.router.navigate(['/admin/dashboard']); 
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error en login', err);
        alert(err.error?.detail || 'Credenciales incorrectas');
        this.loading.set(false);
      }
    });
  }
}
