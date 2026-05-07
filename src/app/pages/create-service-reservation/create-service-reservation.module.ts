import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { CreateServiceReservationPageRoutingModule } from './create-service-reservation-routing.module';
import { CreateServiceReservationPage } from './create-service-reservation.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CreateServiceReservationPageRoutingModule,
    FontAwesomeModule,
    SharedModule,
  ],
  declarations: [CreateServiceReservationPage],
})
export class CreateServiceReservationPageModule {}
