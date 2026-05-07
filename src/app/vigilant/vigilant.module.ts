import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { VigilantPageRoutingModule } from './vigilant-routing.module';

import { VigilantPage } from './vigilant.page';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { TimeFormatPipe } from '../shared/pipes/time.pipe';
import { DocumentFormatPipe } from '../shared/pipes/document-format.pipe';
import { DateFormatPipe } from '../shared/pipes/date-format.pipe';
import { RippleModule } from 'primeng/ripple';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FontAwesomeModule,
    VigilantPageRoutingModule,
    TimeFormatPipe,
    DocumentFormatPipe,
    DateFormatPipe,
    RippleModule,
  ],
  declarations: [
    VigilantPage,
    BarcodeScanningModalComponent,
    ConfirmModalComponent,
  ],
  exports: [BarcodeScanningModalComponent, ConfirmModalComponent],
})
export class VigilantPageModule {}
