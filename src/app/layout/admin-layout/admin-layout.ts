import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { CommonModule } from '@angular/common';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { WebsocketService } from '../../core/services/websocket.service';
import { ToastService } from '../../core/services/toast.service';
import { AuthService } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, Sidebar, CommonModule, ToastComponent],
  template: `
<div class="flex h-screen bg-slate-50 overflow-hidden font-sans">
  <!-- Sidebar Fijo -->
  <app-sidebar></app-sidebar>

  <!-- Contenido Principal con Scroll -->
  <div class="flex-grow ml-64 h-full overflow-y-auto relative">
    <main class="p-8 max-w-7xl mx-auto w-full min-h-screen">
      <router-outlet></router-outlet>
    </main>
  </div>
  
  <!-- Contenedor de Notificaciones -->
  <app-toast></app-toast>
</div>
  `,
  styles: [`
    :host { display: block; height: 100vh; }
  `]
})
export class AdminLayout implements OnInit, OnDestroy {
  websocketService = inject(WebsocketService);
  toastService = inject(ToastService);
  authService = inject(AuthService);
  
  private sub: Subscription | null = null;

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user && user.tallerId) {
      this.websocketService.connect(user.tallerId);
      
      this.sub = this.websocketService.emergencias$.subscribe(datos => {
        this.toastService.show(
          '🚨 ¡Nueva Emergencia Asignada a tu Taller!', 
          `${datos.descripcion || 'Se requiere atención inmediata.'}`, 
          'warning'
        );
      });
    }
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    this.websocketService.disconnect();
  }
}

