import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { InputComponent } from './components/input/input.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ValidationErrorsComponent } from './components/validation-errors/validation-errors.component';
import { ControlValueAccessorDirective } from './directives/control-value-accessor/control-value-accessor.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { EditReservationModalComponent } from './components/edit-reservation-modal/edit-reservation-modal.component';
import { EditServiceReservationModalComponent } from './components/edit-service-reservation-modal/edit-service-reservation-modal.component';
import { SelectComponent } from './components/select/select.component';
import { ServiceSelectionModalComponent } from '../pages/create-service-reservation/components/service-selection-modal/service-selection-modal.component';

const components = [
  InputComponent,
  ValidationErrorsComponent,
  EditReservationModalComponent,
  EditServiceReservationModalComponent,
  ServiceSelectionModalComponent,
];
const directives = [ControlValueAccessorDirective];

@NgModule({
  declarations: [...components, ...directives],
  imports: [
    CommonModule,
    IonicModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    SelectComponent,
  ],
  exports: [...components, ...directives],
})
export class SharedModule {}
