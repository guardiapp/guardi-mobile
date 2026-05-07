import { SafeUrl } from '@angular/platform-browser';
import { ReservationService } from './../../../../core/services/reservation/reservation.service';
import { Component, inject, input, Input, OnInit, signal } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Reservation } from 'src/app/core/models/reservations.state';
import { AlertService } from 'src/app/core/services/alert/alert.service';
import { LoadingService } from 'src/app/core/services/loading/loading.service';
import { QrService } from 'src/app/core/services/qr/qr.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { EditReservationModalComponent } from 'src/app/shared/components/edit-reservation-modal/edit-reservation-modal.component';
import { EditServiceReservationModalComponent } from 'src/app/shared/components/edit-service-reservation-modal/edit-service-reservation-modal.component';
import { deleteReservation } from 'src/app/state/actions/reservation.actions';
import { HistoryComponent } from '../history/history.component';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() reservation!: Reservation;
  private alertService = inject(AlertService);
  private store: Store = inject(Store);
  private modalCtrl = inject(ModalController);
  private qrService = inject(QrService);
  public iconUrl: string = '';
  private loader = inject(LoadingService);
  private toast = inject(ToastService);
  public qrData = '';
  public qrCodeDownloadLink: SafeUrl | any = '';

  constructor() {}

  ngOnInit() {
    this.qrData = `${this.reservation.id}`;
  }

  async onEdit() {
    // Verificar si la reservación es de tipo SERVICE
    if (this.reservation.type === 'SERVICE') {
      // Usar el modal específico para servicios
      const modal = await this.modalCtrl.create({
        component: EditServiceReservationModalComponent,
        componentProps: {
          reservation: this.reservation,
        },
      });

      await modal.present();
    } else {
      // Para reservaciones de tipo PERSONAL, usar el modal existente
      const modal = await this.modalCtrl.create({
        component: EditReservationModalComponent,
        componentProps: {
          reservation: this.reservation,
        },
      });

      await modal.present();
    }
  }

  deleteReservation() {
    this.alertService.presentAlert({
      mode: 'ios',
      header: 'Eliminar reservación',
      message: '¿Está seguro que desea eliminar la reservación?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.store.dispatch(
              deleteReservation({ reservationId: this.reservation.id })
            );
          },
        },
      ],
    });
  }

  onChangeURL(url: SafeUrl | any) {
    this.qrCodeDownloadLink = url;
  }

  public async shareQr() {
    try {
      this.loader.present('Generando QR...');
      await this.qrService.shareQRImage(
        this.qrCodeDownloadLink.changingThisBreaksApplicationSecurity,
        'qr_visita.png'
      );
      this.loader.dismiss();
    } catch (error: any) {
      this.loader.dismiss();
      if (error.message === 'Share canceled') return;
      this.toast.error(error.message, 3000);
    }
  }

  showHistory() {
    console.log(this.reservation.qr.scanned);
    if (this.reservation.qr.scanned.length) {
      this.modalCtrl
        .create({
          component: HistoryComponent,
          componentProps: {
            scannedHistory: this.reservation.qr.scanned,
          },
        })
        .then((modal) => modal.present());
    } else {
      this.toast.info(
        'No hay historial de escaneos para esta reservación.',
        3000
      );
    }
  }
}
