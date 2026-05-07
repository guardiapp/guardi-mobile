import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateServiceReservationPage } from './create-service-reservation.page';

const routes: Routes = [
  {
    path: '',
    component: CreateServiceReservationPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateServiceReservationPageRoutingModule {}
