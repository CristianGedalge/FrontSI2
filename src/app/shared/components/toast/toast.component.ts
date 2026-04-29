import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <div *ngFor="let toast of toastService.toasts()" 
           class="min-w-[300px] p-4 rounded-lg shadow-lg border-l-4 pointer-events-auto transition-all duration-300 animate-slide-up"
           [ngClass]="{
             'bg-white border-blue-500 text-slate-800': toast.type === 'info',
             'bg-green-50 border-green-500 text-green-800': toast.type === 'success',
             'bg-red-50 border-red-500 text-red-800': toast.type === 'error',
             'bg-yellow-50 border-yellow-500 text-yellow-800': toast.type === 'warning'
           }">
        <div class="flex justify-between items-start gap-4">
          <div>
            <h4 class="font-bold text-sm">{{ toast.title }}</h4>
            <p class="text-sm mt-1 text-slate-600">{{ toast.message }}</p>
          </div>
          <button (click)="toastService.remove(toast.id)" class="text-slate-400 hover:text-slate-600 focus:outline-none">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slideUp {
      from { transform: translateY(100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .animate-slide-up {
      animation: slideUp 0.3s ease-out forwards;
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}
