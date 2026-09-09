import { Injectable, inject } from '@angular/core';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private toastService = inject(ToastService);

  notify(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info'): void {
    switch (type) {
      case 'success':
        this.toastService.success(message);
        break;
      case 'error':
        this.toastService.error(message);
        break;
      case 'warning':
        this.toastService.warning(message);
        break;
      default:
        this.toastService.show(message, 'primary');
    }
  }
}
