import { Component, inject, OnInit } from '@angular/core';
import { Reservation } from 'src/app/core/models/reservations.state';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';
import { map } from 'rxjs';
import { BarcodeScanningModalComponent } from '../../barcode-scanning-modal.component';
import { CreateVisitModalComponent } from '../../components/create-visit-modal/create-visit-modal.component';
import { BarcodeScanner, LensFacing } from '@capacitor-mlkit/barcode-scanning';
import { faQrcode, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { AlertController, Platform } from '@ionic/angular';
import { ModalService } from 'src/app/core/services/modal/modal.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { ReservationService } from 'src/app/core/services/reservation/reservation.service';
import { LoadingService } from 'src/app/core/services/loading/loading.service';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { logout } from 'src/app/state/actions/auth.actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  private modalSvc = inject(ModalService);
  private platform = inject(Platform);
  private toastService = inject(ToastService);
  private reservationSvc = inject(ReservationService);
  private loader = inject(LoadingService);
  private store = inject(Store);
  private alertCtrl = inject(AlertController);
  private router = inject(Router);
  public isSubmitting = false;
  public scanResult: any = '';

  // Iconos de FontAwesome
  faQrcode = faQrcode;
  faUserPlus = faUserPlus;

  // Opciones del menú para vigilante
  menuOptions = [
    {
      icon: this.faQrcode,
      title: 'Escanear QR',
      subtitle: 'Verificar visita',
      color: 'primary',
      action: 'scan',
      gradient: 'scan-gradient',
    },
    {
      icon: this.faUserPlus,
      title: 'Crear Visita',
      subtitle: 'Registrar visitante',
      color: 'success',
      action: 'create',
      gradient: 'create-gradient',
    },
  ];

  constructor() {}

  ngOnInit() {
    if (this.platform.is('capacitor')) {
      BarcodeScanner.isSupported().then();
      BarcodeScanner.checkPermissions().then();
    }

    // Precarga del componente del modal para evitar latencia en la primera apertura
    import('../../components/create-visit-modal/create-visit-modal.component');
  }

  onOptionClick(option: any) {
    if (option.action === 'scan') {
      this.startScan();
    } else if (option.action === 'create') {
      this.openCreateVisitModal();
    }
  }

  async startScan() {
    const data = await this.modalSvc.presentModal(
      BarcodeScanningModalComponent,
      { formats: [], lensFacing: LensFacing.Back },
      { cssClass: 'barcode-scanning-modal', showBackdrop: false }
    );

    if (data) {
      console.log('Scan result:', data);
      this.scanResult = JSON.parse(data.barcode);
      this.getReservation();
    }
  }

  getReservation() {
    this.loader.present('Cargando...');
    this.reservationSvc
      .getById(this.scanResult)
      .pipe(
        map((res: Reservation) => ({
          ...res,
          companions: JSON.parse(res.companions),
        }))
      )
      .subscribe(
        (res) => {
          this.loader.dismiss();
          this.openConfirmationModal(res);
        },
        (error) => {
          this.loader.dismiss();
          this.toastService.error(error.message, 3000);
        }
      );
  }

  async openConfirmationModal(reservation: Reservation) {
    this.modalSvc.presentModal(ConfirmModalComponent, { reservation });
  }

  async openCreateVisitModal() {
    await this.modalSvc.presentModal(CreateVisitModalComponent);
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
  async handleLogout() {
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
}
