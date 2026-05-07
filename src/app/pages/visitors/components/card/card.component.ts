import { Component, inject, Input, OnInit } from '@angular/core';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { Visitor } from 'src/app/core/models/visitor.state';
import { AlertService } from 'src/app/core/services/alert/alert.service';
import { ModalService } from 'src/app/core/services/modal/modal.service';
import { deleteVisitor } from 'src/app/state/actions/visitor.actions';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  private alertservice = inject(AlertService);
  private store = inject(Store);
  private modalService = inject(ModalService);

  @Input() visitor!: Visitor;

  faUser = faUser;

  constructor() {}

  ngOnInit() {}

  async deleteVisitor() {
    this.alertservice.presentAlert({
      mode: 'ios',
      header: 'Eliminar visitante',
      message: `¿Desea eliminar a ${this.visitor.first_name}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Eliminar',
          handler: () => {
            // Call the deleteReservation action
            this.store.dispatch(deleteVisitor({ visitorId: this.visitor.id }));
          },
        },
      ],
    });
  }

  updateVisitor() {
    this.visitor;
    this.modalService.presentModal(ModalComponent, { visitor: this.visitor });
  }
}
