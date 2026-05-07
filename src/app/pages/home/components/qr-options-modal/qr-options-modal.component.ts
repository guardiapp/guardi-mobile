import { Component, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import {
  faUserFriends,
  faCog,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-qr-options-modal',
  templateUrl: './qr-options-modal.component.html',
  styleUrls: ['./qr-options-modal.component.scss'],
})
export class QrOptionsModalComponent {
  private modalCtrl = inject(ModalController);
  private router = inject(Router);

  // Iconos de FontAwesome
  faUserFriends = faUserFriends;
  faCog = faCog;
  faChevronRight = faChevronRight;

  // Opciones para crear QR
  qrOptions = [
    {
      id: 'visitor',
      icon: this.faUserFriends,
      title: 'Visita Personal',
      subtitle: 'Amigos o familiares',
      color: 'primary',
      route: '/tabs/create-reservation',
      gradient: 'visitor-gradient',
    },
    {
      id: 'service',
      icon: this.faCog,
      title: 'Servicios',
      subtitle: 'Mantenimiento, entregas, etc.',
      color: 'tertiary',
      route: '/tabs/create-service-reservation',
      gradient: 'service-gradient',
    },
  ];

  constructor() {}

  dismiss() {
    this.modalCtrl.dismiss();
  }

  onOptionSelect(option: any) {
    this.modalCtrl.dismiss({ selectedOption: option });
    this.router.navigate([option.route]);
  }
}
