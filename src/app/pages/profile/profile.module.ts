import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { SharedModule } from '../../shared/shared.module';
import { UserInfoCardComponent } from './components/user-card/user-card.component';
import { GuardAccordionComponent } from './components/guard-card/guard-card.component';
import { RippleModule } from 'primeng/ripple';
import { DocumentFormatPipe } from 'src/app/shared/pipes/document-format.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    SharedModule,
    RippleModule,
    SharedModule,
    DocumentFormatPipe,
  ],
  declarations: [ProfilePage, UserInfoCardComponent, GuardAccordionComponent],
})
export class ProfilePageModule {}
