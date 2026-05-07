import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { format } from '@formkit/tempo';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { User } from 'src/app/core/models/auth.state.interface';
import { Visitor } from 'src/app/core/models/visitor.state';
import { ModalService } from 'src/app/core/services/modal/modal.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { ModalComponent } from 'src/app/pages/visitors/components/modal/modal.component';
import { addReservation } from 'src/app/state/actions/reservation.actions';
import { loadVisitors } from 'src/app/state/actions/visitor.actions';
import {
  selectApartmentId,
  selectUser,
} from 'src/app/state/selectors/auth.selectors';
import { selectVisitors } from 'src/app/state/selectors/visitor.selectors';

@Component({
  selector: 'app-quick-visit-modal',
  templateUrl: './quick-visit-modal.component.html',
  styleUrls: ['./quick-visit-modal.component.scss'],
})
export class QuickVisitModalComponent implements OnInit {
  private modalSvc = inject(ModalService);
  private toastSvc = inject(ToastService);
  private fb: FormBuilder = inject(FormBuilder);
  private modalCtrl = inject(ModalController);
  public form!: FormGroup;
  private store = inject(Store);
  public user = signal<User | null>(null);
  public apartmentId = signal<number | null>(null);
  public visitors = signal<Visitor[]>([]);

  constructor() {
    this.initForm();
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.store.select(selectApartmentId).subscribe((apartmentId) => {
      this.apartmentId.set(apartmentId ?? null);
      this.form.patchValue({ apartment_id: apartmentId });
    });
    this.store.select(selectUser).subscribe((user) => {
      this.user.set(user);
    });
    this.store.select(selectVisitors).subscribe((visitors: Visitor[]) => {
      // if (!visitors.length) {
      //   this.store.dispatch(loadVisitors());
      // }
      this.visitors.set(visitors);
      console.log(visitors);
    });
  }

  initForm() {
    const today = format(new Date(), 'YYYY-MM-DD');
    this.form = this.fb.group({
      apartment_id: [this.apartmentId(), [Validators.required]],
      visitor_id: [null, [Validators.required]],
      visit_date: [today, Validators.required],
      expiration_date: [today],
      with_stay: [false],
      remarks: ['Visita rápida'],
      has_companions: [false],
      has_vehicle: [false],
      car_plate: [''],
    });
  }

  addVisitor() {
    this.modalSvc.presentModal(ModalComponent).then((data) => {
      if (data && data.id) {
        // Seleccionar automáticamente el visitante recién creado
        this.form.patchValue({ visitor_id: data.id });
      }
    });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  onSubmit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();

      if (!this.form.get('visitor_id')?.value) {
        this.toastSvc.error('Por favor selecciona un visitante');
        return;
      }

      this.toastSvc.error('Por favor completa todos los campos requeridos');
      return;
    }
    const {
      apartment_id,
      visitor_id,
      visit_date,
      expiration_date,
      with_stay,
      remarks,
      has_vehicle,
      has_companions,
      car_plate,
    } = this.form.value;

    const dto = {
      apartment_id,
      visitor_id,
      visit_date,
      expiration_date: with_stay ? expiration_date : null,
      with_stay,
      remarks,
      has_vehicle,
      has_companions,
      ...(car_plate && { car_plate }),
      companions: JSON.stringify([]),
    };

    this.modalCtrl.dismiss();
    this.store.dispatch(addReservation({ dto }));
    this.modalCtrl.dismiss({ success: true });
  }
}
