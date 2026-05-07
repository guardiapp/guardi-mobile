import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { HomePageRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';
import { QuickVisitModalComponent } from './components/quick-visit-modal/quick-visit-modal.component';
import { QrOptionsModalComponent } from './components/qr-options-modal/qr-options-modal.component';
import { VigilantPageModule } from '../../vigilant/vigilant.module';
import { RippleModule } from 'primeng/ripple';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    HomePageRoutingModule,
    FontAwesomeModule,
    RippleModule,
    VigilantPageModule,
  ],
  declarations: [HomePage, QuickVisitModalComponent, QrOptionsModalComponent],
})
export class HomePageModule {}
