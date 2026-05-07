import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VisitorsPageRoutingModule } from './visitors-routing.module';

import { VisitorsPage } from './visitors.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CardComponent } from './components/card/card.component';
import { ModalComponent } from './components/modal/modal.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SelectComponent } from '../../shared/components/select/select.component';
import { DocumentFormatPipe } from 'src/app/shared/pipes/document-format.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VisitorsPageRoutingModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    SharedModule,
    SelectComponent,
    DocumentFormatPipe,
  ],
  declarations: [VisitorsPage, CardComponent, ModalComponent],
})
export class VisitorsPageModule {}
