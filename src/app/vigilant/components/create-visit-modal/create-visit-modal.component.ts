import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { format } from '@formkit/tempo';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { SelectResidentModalComponent } from 'src/app/pages/create-reservation/components/select-resident-modal/select-resident-modal.component';
import { Visitor } from 'src/app/core/models/visitor.state';
import { SelectVisitorModalComponent } from './select-visitor-modal/select-visitor-modal.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddCompanionModalComponent } from '../../../shared/components/add-companion-modal/add-companion-modal.component';
import { ModalService } from 'src/app/core/services/modal/modal.service';
import { ReservationService } from 'src/app/core/services/reservation/reservation.service';
import { LoadingService } from 'src/app/core/services/loading/loading.service';
import { SuccessModalComponent } from 'src/app/pages/create-reservation/components/success-modal/success-modal.component';

@Component({
  selector: 'app-create-visit-modal',
  templateUrl: './create-visit-modal.component.html',
  styleUrls: ['./create-visit-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, SharedModule],
})
export class CreateVisitModalComponent {
  private reservationSvc = inject(ReservationService);
  private loader = inject(LoadingService);
  private modalSvc = inject(ModalService);
  private fb = inject(FormBuilder);
  private toastSvc = inject(ToastService);

  public form!: FormGroup;
  public companions = signal<any[]>([]);
  public selectedApartment = signal<any | null>(null);
  public selectedVisitor = signal<Visitor | null>(null);

  constructor() {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      apartment_id: [null, [Validators.required]],
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

  close() {
    this.modalSvc.dismissModal();
  }

  async openSelectResidentModal() {
    const data = await this.modalSvc.presentModal(
      SelectResidentModalComponent,
      null
    );
    if (data && data.apartment) {
      this.selectedApartment.set(data.apartment);
      this.form.patchValue({ apartment_id: data.apartment.id });
    }
  }

  async openSelectVisitorModal() {
    const data = await this.modalSvc.presentModal(SelectVisitorModalComponent, {
      residentId: this.selectedApartment()?.resident?.id,
    });
    if (data && data.visitor) {
      this.selectedVisitor.set(data.visitor);
      this.form.patchValue({ visitor_id: data.visitor.id });
    }
  }

  async openAddCompanionModal(companionToEdit?: any, index?: number) {
    const data = await this.modalSvc.presentModal(
      AddCompanionModalComponent,
      {
        companion: companionToEdit ? { ...companionToEdit } : null,
      },
      { initialBreakpoint: 0.5 }
    );
    if (data) {
      if (companionToEdit !== undefined && index !== undefined) {
        this.updateCompanion(data, index);
      } else {
        this.addCompanion(data);
      }
    }
  }

  addCompanion(companionData: any) {
    this.companions.update((current) => [...current, companionData]);
  }

  updateCompanion(companionData: any, index: number) {
    this.companions.update((current) => {
      const list = [...current];
      if (index >= 0 && index < list.length) {
        list[index] = companionData;
      }
      return list;
    });
  }

  removeCompanion(index: number) {
    this.companions.update((current) => {
      const list = [...current];
      if (index >= 0 && index < list.length) {
        list.splice(index, 1);
      }
      return list;
    });
  }

  onSubmit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();

      const missingFields = [] as string[];
      if (!this.form.get('apartment_id')?.value)
        missingFields.push('Residente');
      if (!this.form.get('visitor_id')?.value) missingFields.push('Visitante');
      if (!this.form.get('visit_date')?.value)
        missingFields.push('Fecha de visita');
      if (
        this.form.get('has_vehicle')?.value &&
        !this.form.get('car_plate')?.value?.trim()
      ) {
        missingFields.push('Placa del vehículo');
      }

      let errorMessage = 'Por favor completa los siguientes campos: ';
      errorMessage += missingFields.join(', ');
      this.toastSvc.error(errorMessage);
      return;
    }

    this.loader.present('Creando visita');
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
      companions: JSON.stringify(this.companions()),
    };

    this.reservationSvc.createReservation(dto).subscribe({
      next: (res) => {
        this.loader.dismiss();
        this.modalSvc.dismissModal();
        this.openSuccessModal(res.id);
      },
      error: (err) => {
        this.loader.dismiss();
        this.toastSvc.error(err.message);
      },
    });
  }

  openSuccessModal(reservationId: number) {
    this.modalSvc.presentModal(SuccessModalComponent, { reservationId });
  }
}
