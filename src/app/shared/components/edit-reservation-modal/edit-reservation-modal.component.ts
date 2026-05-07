import { Visitor } from './../../../core/models/visitor.state';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { ModalController } from '@ionic/angular';
import { AddCompanionModalComponent } from 'src/app/shared/components/add-companion-modal/add-companion-modal.component';
import { Store } from '@ngrx/store';
import { User } from 'src/app/core/models/auth.state.interface';
import { updateReservation } from 'src/app/state/actions/reservation.actions';
import { loadVisitors } from 'src/app/state/actions/visitor.actions';
import { selectUser } from 'src/app/state/selectors/auth.selectors';
import { selectVisitors } from 'src/app/state/selectors/visitor.selectors';
import * as dayjs from 'dayjs';

import { format, parse } from '@formkit/tempo';
import { ModalService } from 'src/app/core/services/modal/modal.service';
import { ModalComponent } from 'src/app/pages/visitors/components/modal/modal.component';
import { Reservation } from 'src/app/core/models/reservations.state';

@Component({
  selector: 'app-edit-reservation-modal',
  templateUrl: './edit-reservation-modal.component.html',
  styleUrls: ['./edit-reservation-modal.component.scss'],
})
export class EditReservationModalComponent implements OnInit {
  @Input() reservation!: Reservation;
  private modalSvc = inject(ModalService);
  private store = inject(Store);
  private fb: FormBuilder = inject(FormBuilder);
  private modalCtrl = inject(ModalController);
  public user = signal<User | undefined>(undefined);
  public buildingId = signal<number | null>(null);
  public form!: FormGroup;
  public faChevronLeft = faChevronLeft;
  public reservationType: number = 1;
  public type = '';
  public visitors = signal<Visitor[]>([]);
  public companions = signal<any[]>([]);
  public hasTypeCatalogs: boolean = false;
  public typeCatalogs = signal([]);

  documentTypes = [
    {
      name: 'Cédula',
      id: 1,
    },
    {
      name: 'Pasaporte',
      id: 2,
    },
  ];

  reservationTypes = [
    {
      name: 'Normal',
      id: 1,
    },
    {
      name: 'Temporal',
      id: 2,
    },
  ];

  constructor() {}

  ngOnInit() {
    this.initForm(); // Initialize form before patching
    this.store.select(selectUser).subscribe((user: any) => {
      this.user.set(user);
    });

    this.store.select(selectVisitors).subscribe((res: Visitor[]) => {
      if (!res.length) {
        this.store.dispatch(loadVisitors());
      }
      this.visitors.set(res);
    });

    this.form.patchValue({
      apartment_id: this.reservation.apartment_id,
      visitor_id: this.reservation.visitor_id,
      visit_date: format(new Date(this.reservation.visit_date), 'YYYY-MM-DD'),
      expiration_date: this.reservation.expiration_date
        ? format(new Date(this.reservation.expiration_date), 'YYYY-MM-DD')
        : null,
      with_stay: !!this.reservation.with_stay,
      remarks: this.reservation.remarks,
      has_companions: !!this.reservation.has_companions,
      has_vehicle: !!this.reservation.has_vehicle,
      car_plate: this.reservation.car_plate || '',
    });
    if (
      this.reservation.companions &&
      JSON.parse(this.reservation.companions).length > 0
    ) {
      this.companions.set(JSON.parse(this.reservation.companions));
    }
  }

  get hasCompanionsField() {
    return this.form.get('has_companions');
  }

  get hasVehicleField() {
    return this.form.get('has_vehicle');
  }

  ionViewWillLeave() {
    this.form.patchValue({});
  }

  addVisitor() {
    this.modalSvc.presentModal(ModalComponent).then((data) => {
      if (data && data.id) {
        // Seleccionar automáticamente el visitante recién creado
        this.form.patchValue({ visitor_id: data.id });
      }
    });
  }

  initForm() {
    this.form = this.fb.group({
      apartment_id: ['', [Validators.required]],
      visitor_id: [null, [Validators.required]],
      visit_date: [format(new Date(), 'YYYY-MM-DD'), Validators.required],
      expiration_date: [format(new Date(), 'YYYY-MM-DD')],
      with_stay: [false],
      remarks: [''],
      has_companions: [false],
      has_vehicle: [false],
      car_plate: [''],
    });
  }

  async openAddCompanionModal(companionToEdit?: any, index?: number) {
    const modal = await this.modalCtrl.create({
      mode: 'ios',
      component: AddCompanionModalComponent,
      componentProps: {
        companion: companionToEdit ? { ...companionToEdit } : null,
      },
      initialBreakpoint: 0.5, // Or adjust as needed
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      if (companionToEdit !== undefined && index !== undefined) {
        this.updateCompanion(data, index);
      } else {
        this.addCompanion(data);
      }
    }
  }

  addCompanion(companionData: any) {
    this.companions.update((currentCompanions) => [
      ...currentCompanions,
      companionData,
    ]);
  }

  updateCompanion(companionData: any, index: number) {
    this.companions.update((currentCompanions) => {
      const newCompanions = [...currentCompanions];
      if (index >= 0 && index < newCompanions.length) {
        newCompanions[index] = companionData;
      }
      return newCompanions;
    });
  }

  removeCompanion(index: number) {
    this.companions.update((currentCompanions) => {
      const newCompanions = [...currentCompanions];
      if (index >= 0 && index < newCompanions.length) {
        newCompanions.splice(index, 1);
      }
      return newCompanions;
    });
  }

  onSubmit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
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

    const createDto = () => ({
      apartment_id,
      visitor_id,
      visit_date,
      expiration_date: with_stay ? expiration_date : null,
      with_stay,
      remarks,
      has_vehicle,
      has_companions,
      ...(car_plate && has_vehicle && { car_plate }), // only include car_plate if has_vehicle is true
      companions: JSON.stringify(this.companions()), // only include companions if has_companions is true
    });

    const dto = createDto();
    this.store.dispatch(
      updateReservation({ reservationId: this.reservation.id, dto })
    );
  }

  close() {
    this.modalSvc.dismissModal();
  }
}
