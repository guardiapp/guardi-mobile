import { IonicModule, ModalController } from '@ionic/angular';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadReservations } from 'src/app/state/actions/reservation.actions';
import {
  selectCurrentPage,
  selectNextPageUrl,
} from 'src/app/state/selectors/reservation.selectors';
import { QrService } from 'src/app/core/services/qr/qr.service';
import { LoadingService } from 'src/app/core/services/loading/loading.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { QRCodeModule } from 'angularx-qrcode';
import { SafeUrl } from '@angular/platform-browser';
import { AuthState, User } from 'src/app/core/models/auth.state.interface';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectUser } from 'src/app/state/selectors/auth.selectors';

@Component({
  selector: 'app-success-modal',
  standalone: true,
  imports: [IonicModule, QRCodeModule],
  templateUrl: './success-modal.component.html',
  styleUrls: ['./success-modal.component.scss'],
})
export class SuccessModalComponent implements OnInit {
  @Input() reservationId!: number;
  private modalCtrl = inject(ModalController);
  private loader = inject(LoadingService);
  private qrService = inject(QrService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private store = inject(Store);
  private user = signal<User | null>(null);
  public page: number = 1;
  public nextPageUrl: string | null = '';
  public qrImageUrl: string | null = null;
  public qrData = '';

  public qrCodeDownloadLink: SafeUrl | any = '';

  constructor() {}

  ngOnInit() {
    this.store.select(selectUser).subscribe((res) => {
      console.log('Usuario', res);
      this.user.set(res);
    });
    this.store.select(selectCurrentPage).subscribe((page) => {
      this.page = page;
    });

    this.store.select(selectNextPageUrl).subscribe((nextPageUrl) => {
      this.nextPageUrl = nextPageUrl;
    });
  }

  ionViewWillEnter() {
    this.qrData = `${this.reservationId}`;
    console.log('Reservation ID:', this.qrData);
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
  close() {
    this.page = 1;

    if (this.user()?.type === 'Resident') {
      this.store.dispatch(loadReservations({ page: this.page, reload: true }));
      this.router.navigate(['tabs/reservations']);
      this.modalCtrl.dismiss();
    } else {
      this.router.navigate(['vigilant']);
      this.modalCtrl.dismiss();
    }
  }
}
