import { Injectable, inject } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastController = inject(ToastController);

  async show(message: string, color: 'success' | 'danger' | 'warning' | 'primary' = 'primary', duration: number = 3000): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration,
      color,
      position: 'top',
      buttons: [{ text: 'OK', role: 'cancel' }]
    });
    await toast.present();
  }

  success(message: string): Promise<void> {
    return this.show(message, 'success');
  }

  error(message: string): Promise<void> {
    return this.show(message, 'danger');
  }

  warning(message: string): Promise<void> {
    return this.show(message, 'warning');
  }
}
