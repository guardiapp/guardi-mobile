import { Component, inject, OnInit, signal } from '@angular/core';
import { faBuilding } from '@fortawesome/free-regular-svg-icons';
import { AlertController, Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { AuthState, Guard } from 'src/app/core/models/auth.state.interface';
import { ToastService } from 'src/app/core/services/toast/toast.service';

import { logout } from 'src/app/state/actions/auth.actions';
import { selectAuthState } from 'src/app/state/selectors/auth.selectors';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  private store = inject(Store);
  private alertCtrl = inject(AlertController);
  public isloading = signal(false);
  public reservations = signal(0);
  public auth!: AuthState;
  faBuilding = faBuilding;
  public isSubmitting = false;
  public guard = signal<Guard | null>(null);

  ngOnInit() {
    this.loadData();
    this.loadGuardData();
  }

  /**
   * The `loadData` function subscribes to various selectors in the store to retrieve user, building, and
   * reservations data, dispatching actions to load data if necessary.
   */
  loadData() {
    this.store.select(selectAuthState).subscribe((auth) => {
      this.auth = auth;
    });
  }

  /**
   * The `loadGuardData` function loads guard information from localStorage.
   */
  loadGuardData() {
    const guardData = localStorage.getItem('guard');
    if (guardData) {
      const guard = JSON.parse(guardData);
      this.guard.set(guard);
    }
  }

  /**
   * The `logout` function dispatches a `logout` action using the store.
   */
  logout() {
    this.store.dispatch(logout());
  }

  /**
   * The `presentAlert` function in TypeScript presents an iOS-style alert asking the user if they want
   * to log out.
   */
  async presentAlert() {
    this.isSubmitting = true;
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: 'Cerrar sesión',
      message: '¿Desea cerrar su sesión de usuario?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.isSubmitting = false;
            this.logout();
          },
        },
      ],
    });
    this.isSubmitting = false;
    await alert.present();
  }

  /**
   * The handleRefresh function in TypeScript triggers a refresh event and loads new data after a delay
   * of 1500 milliseconds.
   * @param {any} event - The `event` parameter in the `handleRefresh` function is typically an event
   * object that is triggered when a user initiates a refresh action, such as pulling down on a list to
   * refresh its content. This event object contains information about the event that occurred, such as
   * the target element that triggered the
   */
  handleRefresh(event: any) {
    setTimeout(() => event.target.complete(), 1500);
    this.loadData();
    this.loadGuardData();
  }
}
