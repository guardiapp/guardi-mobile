import {
  Component,
  inject,
  signal,
  WritableSignal,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import {
  faHouse,
  faCalendarDays,
  faCalendarCheck,
  faUser,
  faUserGroup,
  faBuilding,
  faHome,
  faBell,
} from '@fortawesome/free-solid-svg-icons';
import { Router, NavigationEnd } from '@angular/router';
import { ModalService } from '../core/services/modal/modal.service';
import { ModalComponent } from '../pages/visitors/components/modal/modal.component';
import { filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { loadVisitors } from '../state/actions/visitor.actions';
import { loadReservations } from '../state/actions/reservation.actions';
import { QuickVisitModalComponent } from '../pages/home/components/quick-visit-modal/quick-visit-modal.component';
import { QrOptionsModalComponent } from '../pages/home/components/qr-options-modal/qr-options-modal.component';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage implements OnInit {
  private actionSheetCtrl = inject(ActionSheetController);
  private modalCtrl = inject(ModalController);
  private router: Router = inject(Router);
  private modalSvc = inject(ModalService);
  private store = inject(Store);

  faHouse = faHouse;
  faCalendarDays = faCalendarDays;
  faCalendarCheck = faCalendarCheck;
  faHome = faHome;
  faUser = faUser;
  faBuilding = faBuilding;
  faUserGroup = faUserGroup;
  faBell = faBell;

  constructor() {}

  ngOnInit(): void {
    this.store.dispatch(loadReservations({ page: 1 }));
    this.store.dispatch(loadVisitors());
  }
}
