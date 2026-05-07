import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { LensFacing, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import {
  faQrcode,
  faBolt,
  faCalendarCheck,
  faBell,
  faUsers,
  faExclamationTriangle,
  faHome,
  faUserFriends,
} from '@fortawesome/free-solid-svg-icons';
import { QuickVisitModalComponent } from './components/quick-visit-modal/quick-visit-modal.component';
import { QrOptionsModalComponent } from './components/qr-options-modal/qr-options-modal.component';
import { BarcodeScanningModalComponent } from '../../vigilant/barcode-scanning-modal.component';
import { ConfirmModalComponent } from '../../vigilant/components/confirm-modal/confirm-modal.component';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { ReservationService } from 'src/app/core/services/reservation/reservation.service';
import { LoadingService } from 'src/app/core/services/loading/loading.service';
import { ModalService } from 'src/app/core/services/modal/modal.service';
import { Reservation } from 'src/app/core/models/reservations.state';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { AlertService } from 'src/app/core/services/alert/alert.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  private platform = inject(Platform);
  private toastService = inject(ToastService);
  private reservationSvc = inject(ReservationService);
  private loader = inject(LoadingService);
  private modalSvc = inject(ModalService);
  private authService = inject(AuthService);
  private alertService = inject(AlertService);

  public scanResult: any = '';
  public isPanicLoading = signal(false);

  // Iconos de FontAwesome
  faQrcode = faQrcode;
  faBolt = faBolt;
  faCalendarCheck = faCalendarCheck;
  faBell = faBell;
  faUsers = faUsers;
  faExclamationTriangle = faExclamationTriangle;
  faHome = faHome;
  faUserFriends = faUserFriends;

  // Opciones del menú principal
  menuOptions = [
    {
      icon: this.faQrcode,
      title: 'Crear QR',
      subtitle: 'Crea una visita',
      color: 'primary',
      route: '/tabs/create-reservation',
      gradient: 'qr-gradient',
    },
    {
      icon: this.faBolt,
      title: 'Visita Rápida',
      subtitle: 'Acceso inmediato',
      color: 'tertiary',
      route: '/tabs/create-reservation',
      gradient: 'rapid-gradient',
    },
    {
      icon: this.faCalendarCheck,
      title: 'Mis Visitas',
      subtitle: 'Ver reservaciones',
      color: 'success',
      route: '/tabs/reservations',
      gradient: 'visits-gradient',
    },
    {
      icon: this.faUsers,
      title: 'Visitantes',
      subtitle: 'Gestionar visitas',
      color: 'secondary',
      route: '/tabs/visitors',
      gradient: 'visitors-gradient',
    },
    {
      icon: this.faBell,
      title: 'Notificaciones',
      subtitle: 'Ver notificaciones',
      color: 'warning',
      route: '/tabs/notifications',
      gradient: 'notifications-gradient',
    },
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    if (this.platform.is('capacitor')) {
      BarcodeScanner.isSupported().then();
      BarcodeScanner.checkPermissions().then();
    }
  }

  /**
   * The `panicButton` function sends a panic notification to the server.
   */
  async panicAlert() {
    this.isPanicLoading.set(true);

    this.authService.panicAlert().subscribe({
      next: () => {
        this.toastService.success('Alerta de pánico enviada correctamente');
      },
      error: (error) => {
        console.error('Error sending panic notification:', error);
        this.toastService.error('Error al enviar la alerta de pánico');
        this.isPanicLoading.set(false);
      },
      complete: () => {
        this.isPanicLoading.set(false);
      },
    });
  }

  /**
   * The `callGuard` function initiates a phone call to the guard.
   * It uses the native phone dialer on mobile devices or opens a tel: link on web.
   */
  callGuard() {
    // Obtener datos del guardia desde localStorage
    const guardData = localStorage.getItem('guard');

    if (!guardData) {
      this.toastService.error(
        'No hay información del guardia disponible',
        3000
      );
      return;
    }

    const guard = JSON.parse(guardData);

    if (!guard?.phone) {
      this.toastService.error(
        'No hay número de teléfono disponible para el guardia',
        3000
      );
      return;
    }

    const phoneNumber = guard.phone;

    try {
      if (this.platform.is('hybrid')) {
        // En dispositivos móviles, usar el esquema tel: para abrir el marcador
        window.open(`tel:${phoneNumber}`, '_system');
      } else {
        // En web, mostrar un mensaje informativo
        this.toastService.info(
          'En dispositivos móviles, este botón abrirá el marcador telefónico',
          3000
        );
      }
    } catch (error) {
      this.toastService.error('Error al intentar realizar la llamada', 3000);
    }
  }

  confirmPanicAlert() {
    this.alertService.presentAlert({
      header: 'Alerta de Pánico',
      message: '¿Estás seguro de querer enviar una alerta a vigilancia?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Enviar',
          role: 'destructive',
          handler: () => this.panicAlert(),
        },
      ],
    });
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  async openQuickVisitModal() {
    const data = await this.modalSvc.presentModal(
      QuickVisitModalComponent,
      undefined,
      {
        initialBreakpoint: 0.9,
        breakpoints: [0, 0.5, 0.8, 1],
        showBackdrop: true,
        backdropDismiss: true,
      }
    );

    if (data?.success) {
      this.router.navigate(['/tabs/reservations']);
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
    this.reservationSvc.getById(this.scanResult).subscribe(
      (res) => {
        this.loader.dismiss();
        this.openConfirmModal(res);
      },
      (error) => {
        this.loader.dismiss();
        this.toastService.error(error.message, 3000);
      }
    );
  }

  async openConfirmModal(reservation: Reservation) {
    this.modalSvc.presentModal(ConfirmModalComponent, { reservation });
  }

  onOptionClick(option: any) {
    if (option.title === 'Visita Rápida') {
      this.openQuickVisitModal();
    } else if (option.title === 'Crear QR') {
      this.openQrOptionsModal();
    } else {
      this.navigateTo(option.route);
    }
  }

  async openQrOptionsModal() {
    const data = await this.modalSvc.presentModal(
      QrOptionsModalComponent,
      undefined,
      {
        initialBreakpoint: 0.9,
        breakpoints: [0, 0.5, 0.8, 1],
        showBackdrop: true,
        backdropDismiss: true,
      }
    );

    if (data?.selectedOption) {
      console.log('Opción seleccionada:', data.selectedOption);
    }
  }
}
