import { Injectable } from '@angular/core';
import { ModalController, ModalOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(private modalController: ModalController) {}

  async presentModal(
    component: any,
    componentProps?: any,
    options?: Omit<ModalOptions, 'component' | 'componentProps'>
  ) {
    const modal = await this.modalController.create({
      component,
      componentProps,
      ...(options || {}),
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (data) {
      return data;
    }
  }

  async dismissModal(data?: any, role?: string, id?: string): Promise<boolean> {
    return this.modalController.dismiss(data, role, id);
  }
}
