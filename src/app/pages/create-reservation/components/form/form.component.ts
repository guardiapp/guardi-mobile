import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { format } from '@formkit/tempo';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { AddCompanionModalComponent } from '../../../../shared/components/add-companion-modal/add-companion-modal.component';
import { SelectResidentModalComponent } from '../select-resident-modal/select-resident-modal.component';
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
import { Apartment, Resident } from 'src/app/core/models/residents.interface';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  private modalSvc = inject(ModalService);
  private toastSvc = inject(ToastService);
  private fb: FormBuilder = inject(FormBuilder);
  private modalCtrl = inject(ModalController);
  private route = inject(ActivatedRoute);
  public form!: FormGroup;
  private store = inject(Store);
  public user = signal<User | null>(null);
  public apartmentId = signal<number | null>(null);
  public visitors = signal<Visitor[]>([]);
  public companions = signal<any[]>([]);
  public isVigilantMode = signal<boolean>(false);
  public selectedApartment = signal<Apartment | null>(null);

  constructor() {
    this.initForm();
  }

  ngOnInit() {
    this.loadData();
  }

  get hasCompanionsField() {
    return this.form.get('has_companions');
  }

  get hasVehicleField() {
    return this.form.get('has_vehicle');
  }

  ionViewDidLeave() {
    this.form.reset();
    this.companions.set([]);
    this.visitors.set([]);
    this.user.set(null);
    this.apartmentId.set(null);
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
      if (!visitors.length) {
        this.store.dispatch(loadVisitors());
      }
      this.visitors.set(visitors);
    });
  }

  initForm() {
    this.form = this.fb.group({
      apartment_id: [this.apartmentId(), [Validators.required]],
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
      initialBreakpoint: 0.5,
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

  addVisitor() {
    this.modalSvc.presentModal(ModalComponent).then((data) => {
      if (data && data.id) {
        // Seleccionar automáticamente el visitante recién creado
        this.form.patchValue({ visitor_id: data.id });
      }
    });
  }

  async openSelectResidentModal() {
    const modal = await this.modalCtrl.create({
      component: SelectResidentModalComponent,
      componentProps: {},
      initialBreakpoint: 0.5,
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data && data.resident) {
      this.selectedApartment.set(data.apartment);
      this.apartmentId.set(data.apartment.id);
      this.form.patchValue({ apartment_id: data.apartment.id });
    }
  }

  onSubmit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();

      // Identificar campos requeridos faltantes
      const missingFields = [];

      if (!this.form.get('visitor_id')?.value) {
        missingFields.push('Visitante');
      }

      if (!this.form.get('visit_date')?.value) {
        missingFields.push('Fecha de visita');
      }

      // Validar residente en modo vigilant
      if (this.isVigilantMode() && !this.selectedApartment()) {
        missingFields.push('Residente');
      }

      if (
        this.form.get('has_vehicle')?.value &&
        !this.form.get('car_plate')?.value?.trim()
      ) {
        missingFields.push('Placa del vehículo');
      }

      // Mostrar mensaje de error personalizado
      let errorMessage = 'Por favor completa los siguientes campos: ';
      if (missingFields.length > 0) {
        errorMessage += missingFields.join(', ');
      } else {
        errorMessage = 'Por favor completa todos los campos requeridos';
      }

      this.toastSvc.error(errorMessage);
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
      ...(car_plate && { car_plate }),
      companions: JSON.stringify(this.companions()),
    });

    const dto = createDto();
    this.store.dispatch(addReservation({ dto }));
  }
}
