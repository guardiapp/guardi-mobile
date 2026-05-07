import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReservationsPageRoutingModule } from './reservations-routing.module';

import { ReservationsPage } from './reservations.page';
import { CardComponent } from './components/card/card.component';
import { TimeFormatPipe } from 'src/app/shared/pipes/time.pipe';
import { QRCodeModule } from 'angularx-qrcode';
import { HistoryComponent } from './components/history/history.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReservationsPageRoutingModule,
    TimeFormatPipe,
    QRCodeModule,
  ],
  declarations: [ReservationsPage, CardComponent, HistoryComponent],
})
export class ReservationsPageModule {}
