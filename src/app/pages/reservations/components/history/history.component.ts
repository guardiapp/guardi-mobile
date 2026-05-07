import { Component, inject, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Scanned } from 'src/app/core/models/reservations.state';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent {
  private modalCtrl = inject(ModalController);
  @Input() scannedHistory: Scanned[] = [];

  close() {
    this.modalCtrl.dismiss();
  }
}
