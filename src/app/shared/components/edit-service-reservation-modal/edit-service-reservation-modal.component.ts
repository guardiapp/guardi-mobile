import {
  Component,
  inject,
  Input,
  OnInit,
  signal,
  computed,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { User } from 'src/app/core/models/auth.state.interface';
import { Service } from 'src/app/core/models/services.interface';
import { updateReservation } from 'src/app/state/actions/reservation.actions';
import { selectUser } from 'src/app/state/selectors/auth.selectors';
import { format } from '@formkit/tempo';
import { Reservation } from 'src/app/core/models/reservations.state';
import { ServiceSelectionModalComponent } from 'src/app/pages/create-service-reservation/components/service-selection-modal/service-selection-modal.component';
import { ToastService } from 'src/app/core/services/toast/toast.service';

@Component({
  selector: 'app-edit-service-reservation-modal',
  templateUrl: './edit-service-reservation-modal.component.html',
  styleUrls: ['./edit-service-reservation-modal.component.scss'],
})
export class EditServiceReservationModalComponent implements OnInit {
  @Input() reservation!: Reservation;

  private store = inject(Store);
  private fb: FormBuilder = inject(FormBuilder);
  private modalCtrl = inject(ModalController);
  private toastSvc = inject(ToastService);

  public user = signal<User | undefined>(undefined);
  public form!: FormGroup;
  public selectedService = signal<Service | null>(null);

  public selectedServiceText = computed(() => {
    return (
      this.selectedService()?.description || 'Toca para seleccionar un servicio'
    );
  });

  constructor() {}

  ngOnInit() {
    this.initForm();
    this.loadData();
    this.loadReservationData();
  }

  loadData() {
    this.store.select(selectUser).subscribe((user: any) => {
      this.user.set(user);
    });
  }

  loadReservationData() {
    // Cargar el servicio seleccionado
    if (this.reservation.service) {
      // Crear un objeto compatible con la interfaz Service esperada
      const service: Service = {
        id: this.reservation.service.id,
        description:
          this.reservation.service.description ||
          this.reservation.service.name ||
          '',
        created_at: this.reservation.service.created_at || '',
        updated_at: this.reservation.service.updated_at || null,
      };
      this.selectedService.set(service);
    }

    // Completar el formulario con los datos de la reservación
    this.form.patchValue({
      service_id: this.reservation.service_id,
      remarks: this.reservation.remarks || '',
      apartment_id: this.reservation.apartment_id,
      visit_date: this.reservation.visit_date,
      entry_time: this.reservation.entry_time,
      type: this.reservation.type || 'SERVICE',
    });
  }

  initForm() {
    this.form = this.fb.group({
      service_id: [null, [Validators.required]],
      remarks: [''],
      apartment_id: [null],
      visit_date: [format(new Date(), 'YYYY-MM-DD HH:mm:ss')],
      entry_time: [format(new Date(), 'HH:mm:ss')],
      type: ['SERVICE'],
    });
  }

  async openServiceModal() {
    const modal = await this.modalCtrl.create({
      component: ServiceSelectionModalComponent,
      initialBreakpoint: 0.8,
      breakpoints: [0, 0.5, 0.8, 1],
      showBackdrop: true,
      backdropDismiss: true,
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data?.selectedService) {
      this.selectedService.set(data.selectedService);
      this.form.patchValue({ service_id: data.selectedService.id });
    }
  }

  onSubmit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();

      if (!this.form.get('service_id')?.value) {
        this.toastSvc.error('Por favor selecciona un servicio');
        return;
      }

      if (!this.form.get('remarks')?.value?.trim()) {
        this.toastSvc.error('Por favor agrega comentarios sobre el servicio');
        return;
      }

      this.toastSvc.error('Por favor completa todos los campos requeridos');
      return;
    }

    const formValue = this.form.value;

    // Crear el DTO con valores apropiados para servicio
    const dto = {
      apartment_id: formValue.apartment_id,
      visitor_id: null, // Se mantiene automáticamente en el backend
      service_id: formValue.service_id,
      visit_date: formValue.visit_date,
      expiration_date: null, // Sin expiración para servicios normales
      with_stay: 0, // Sin estadía prolongada
      remarks: formValue.remarks.trim(),
      cancelled: this.reservation.cancelled, // Mantener estado actual
      visited: this.reservation.visited, // Mantener estado actual
      entry_time: formValue.entry_time,
      car_plate: null, // Sin vehículo
      has_vehicle: 0, // Sin vehículo
      has_companions: 0, // Sin acompañantes
      companions: null, // Sin acompañantes
      type: 'SERVICE', // Tipo de servicio
    };

    this.store.dispatch(
      updateReservation({
        reservationId: this.reservation.id,
        dto,
        reservationType: 2, // Tipo para servicios
      })
    );
  }

  close() {
    this.modalCtrl.dismiss();
  }

  // Getters para acceso fácil a los controles del formulario
  get serviceControl() {
    return this.form.get('service_id');
  }

  get remarksControl() {
    return this.form.get('remarks');
  }
}
