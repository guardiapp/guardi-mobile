import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateReservationPageRoutingModule } from './create-reservation-routing.module';

import { CreateReservationPage } from './create-reservation.page';
import { SelectComponent } from 'src/app/shared/components/select/select.component';
import { FormComponent } from './components/form/form.component';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateReservationPageRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    SelectComponent,
    DropdownModule,
    CalendarModule,
  ],
  declarations: [CreateReservationPage, FormComponent],
})
export class CreateReservationPageModule {}
