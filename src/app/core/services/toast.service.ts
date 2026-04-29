import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<Toast[]>([]);
  private nextId = 0;

  show(title: string, message: string, type: Toast['type'] = 'info') {
    const id = this.nextId++;
    const newToast: Toast = { id, title, message, type };
    
    this.toasts.update(currentToasts => [...currentToasts, newToast]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      this.remove(id);
    }, 5000);
  }

  remove(id: number) {
    this.toasts.update(currentToasts => currentToasts.filter(t => t.id !== id));
  }
}
