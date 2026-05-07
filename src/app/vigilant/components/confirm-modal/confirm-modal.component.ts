import {
  Component,
  computed,
  inject,
  Input,
  input,
  OnInit,
} from '@angular/core';
import { format } from '@formkit/tempo';
import { Store } from '@ngrx/store';
import { Reservation } from 'src/app/core/models/reservations.state';
import { LoadingService } from 'src/app/core/services/loading/loading.service';
import { ModalService } from 'src/app/core/services/modal/modal.service';
import { ReservationService } from 'src/app/core/services/reservation/reservation.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
})
export class ConfirmModalComponent implements OnInit {
  @Input() reservation!: Reservation;
  currentEntryTime: string = '';
  private lodaer = inject(LoadingService);
  private modalSvc = inject(ModalService);
  private reservationSvc = inject(ReservationService);
  private toastSvc = inject(ToastService);
  public isExit = computed(() => {
    const qrUses = this.reservation?.qr?.qr_uses;
    if (qrUses === undefined || qrUses === null) return false;

    // Si qr_uses es 0: entrada
    // Si qr_uses es impar: salida
    // Si qr_uses es par (y > 0): entrada
    return qrUses > 0 && qrUses % 2 === 1;
  });

  constructor() {}

  ngOnInit() {
    // Establecer la hora actual cuando se carga el modal en el formato que necesita confirm()
    this.currentEntryTime = format(new Date(), 'HH:mm');
  }

  close() {
    this.modalSvc.dismissModal();
  }

  private handleReservationUpdate(
    dto: any,
    successMessage: string,
    errorMessage: string
  ) {
    this.lodaer.present('Cargando...');
    this.reservationSvc.update(this.reservation.id, dto).subscribe(
      (res) => {
        this.lodaer.dismiss();
        this.modalSvc.dismissModal();
        this.toastSvc.info(successMessage, 3000);
      },
      ({ error }) => {
        const errorMsg: string = error?.message || errorMessage;
        console.log('🚀 ~ ConfirmModalComponent ~ err:', JSON.stringify(error));
        this.toastSvc.error(errorMsg, 3000);
        this.lodaer.dismiss();
        this.modalSvc.dismissModal();
      }
    );
  }

  confirm() {
    const dto: any = {
      visited: true,
      cancelled: false,
    };

    console.log('dto -> ', JSON.stringify(dto));

    {
      this.handleReservationUpdate(
        dto,
        'Visita confirmada',
        'Error al confirmar la visita'
      );
    }
  }

  cancel() {
    const dto: any = {
      visited: false,
      cancelled: true,
    };

    this.handleReservationUpdate(
      dto,
      'Visita cancelada',
      'Error al cancelar la visita'
    );
  }
}
