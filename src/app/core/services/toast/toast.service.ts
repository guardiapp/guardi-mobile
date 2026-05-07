import { inject, Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastController = inject(ToastController);

  constructor() {}

  async success(message: string, duration: number = 2000) {
    const toast = await this.toastController.create({
      mode: 'ios',
      message,
      color: 'success',
      duration,
      position: 'top',
    });
    toast.present();
  }

  async error(message: string, duration: number = 2000) {
    const toast = await this.toastController.create({
      mode: 'ios',
      message,
      duration,
      color: 'danger',
      position: 'top',
    });
    toast.present();
  }

  async info(message: string, duration: number = 2000) {
    const toast = await this.toastController.create({
      mode: 'ios',
      message,
      duration,
      color: 'primary',
      position: 'top',
    });
    toast.present();
  }

  async warining(message: string, duration: number = 2000) {
    const toast = await this.toastController.create({
      mode: 'ios',
      message,
      duration,
      color: 'warning',
      position: 'top',
    });
    toast.present();
  }
}
