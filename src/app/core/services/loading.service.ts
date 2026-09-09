import { Injectable, inject } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingController = inject(LoadingController);
  private loadingElement: HTMLIonLoadingElement | null = null;

  async show(message: string = 'Please wait...'): Promise<void> {
    if (this.loadingElement) {
      await this.hide();
    }
    this.loadingElement = await this.loadingController.create({
      message,
      spinner: 'crescent'
    });
    await this.loadingElement.present();
  }

  async hide(): Promise<void> {
    if (this.loadingElement) {
      await this.loadingElement.dismiss();
      this.loadingElement = null;
    }
  }
}
