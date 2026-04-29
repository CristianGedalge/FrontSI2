import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, Sidebar, CommonModule],
  template: `
<div class="flex h-screen bg-slate-50 overflow-hidden font-sans">
  <!-- Sidebar Fijo -->
  <app-sidebar></app-sidebar>

  <!-- Contenido Principal con Scroll -->
  <div class="flex-grow ml-64 h-full overflow-y-auto">
    <main class="p-8 max-w-7xl mx-auto w-full min-h-screen">
      <router-outlet></router-outlet>
    </main>
  </div>
</div>
  `,
  styles: [`
    :host { display: block; h-screen; }
  `]
})
export class AdminLayout {}
