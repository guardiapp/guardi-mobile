import { inject, Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingCtrl: LoadingController = inject(LoadingController);
  constructor() {}

  /**
   * The `present` function asynchronously creates and presents a loading indicator with an optional
   * message.
   * @param {string} [message=Cargando...] - The `message` parameter in the `present` function is a
   * string parameter with a default value of `'Cargando...'`. This parameter is used to specify the
   * message that will be displayed in the loading spinner while it is being presented to the user. If no
   * message is provided when calling the function
   */
  async present(message: string = 'Cargando...') {
    const loading = await this.loadingCtrl.create({
      message,
      mode: 'ios',
    });
    await loading.present();
  }

  /**
   * The `dismiss` function asynchronously dismisses a loading controller.
   */
  async dismiss() {
    await this.loadingCtrl.dismiss();
  }
}
