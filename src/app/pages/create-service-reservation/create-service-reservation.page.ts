import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { format } from '@formkit/tempo';
import {
  faChevronLeft,
  faCog,
  faCalendarCheck,
} from '@fortawesome/free-solid-svg-icons';
import { User } from 'src/app/core/models/auth.state.interface';
import { Service } from 'src/app/core/models/services.interface';
import { ServiceSelectionModalComponent } from './components/service-selection-modal/service-selection-modal.component';
import { IonContent, ModalController } from '@ionic/angular';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { LoadingService } from 'src/app/core/services/loading/loading.service';
import { addReservation } from 'src/app/state/actions/reservation.actions';
import {
  selectApartmentId,
  selectUser,
} from 'src/app/state/selectors/auth.selectors';

@Component({
  selector: 'app-create-service-reservation',
  templateUrl: './create-service-reservation.page.html',
  styleUrls: ['./create-service-reservation.page.scss'],
})
export class CreateServiceReservationPage {
  @ViewChild(IonContent, { static: false }) content!: IonContent;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private store = inject(Store);
  private toastSvc = inject(ToastService);
  private loadingSvc = inject(LoadingService);
  private modalCtrl = inject(ModalController);

  public form!: FormGroup;
  public user = signal<User | undefined>(undefined);
  public apartmentId = signal<number | null>(null);
  public selectedService = signal<Service | null>(null);

  public selectedServiceText = computed(() => {
    return (
      this.selectedService()?.description || 'Toca para seleccionar un servicio'
    );
  });

  // Iconos de FontAwesome
  faChevronLeft = faChevronLeft;
  faCog = faCog;
  faCalendarCheck = faCalendarCheck;

  // Opciones de tipo de documento
  documentTypes = [
    { name: 'Cédula', id: 1 },
    { name: 'Pasaporte', id: 2 },
  ];

  constructor() {
    this.initForm();
  }

  ionViewWillEnter() {
    this.initForm();

    this.loadData();
    // Resetear scroll al top
    setTimeout(() => {
      if (this.content) {
        this.content.scrollToTop(0);
      }
    }, 100);
    // No cargar servicios automáticamente, solo cuando se abra el modal
  }

  ionViewWillLeave() {
    this.form.reset();
    this.selectedService.set(null);
    this.form.patchValue({
      service_id: null,
      remarks: '',
      apartment_id: null,
      visitor_id: null,
      with_stay: 0,
      visit_date: null,
      expiration_date: null,
      cancelled: 0,
      visited: 0,
      entry_time: null,
      car_plate: null,
    });
  }

  loadData() {
    this.store.select(selectUser).subscribe((user) => {
      this.user.set(user ?? undefined);
    });

    this.store.select(selectApartmentId).subscribe((apartmentId) => {
      this.apartmentId.set(apartmentId ?? null);
      this.form.patchValue({ apartment_id: apartmentId });
    });
  }

  initForm() {
    const now = new Date();
    const visitDateTime = format(now, 'YYYY-MM-DD HH:mm:ss');
    const entryTime = format(now, 'HH:mm:ss');

    this.form = this.fb.group({
      // Campos requeridos del usuario
      service_id: [null, [Validators.required]],
      remarks: [''],

      // Campos con valores por defecto apropiados
      apartment_id: [null], // Se llena desde el store
      visitor_id: [null], // null porque será creado automáticamente
      with_stay: [0], // 0 = sin estadía prolongada
      visit_date: [visitDateTime], // Fecha y hora actual
      expiration_date: [null], // null para servicios normales
      cancelled: [0], // 0 = no cancelado
      visited: [0], // 0 = no visitado aún
      entry_time: [entryTime], // Hora actual
      car_plate: [null], // null = sin vehículo
      has_vehicle: [0], // 0 = sin vehículo
      has_companions: [0], // 0 = sin acompañantes
      companions: [null], // null = sin acompañantes
      type: ['SERVICE'], // Tipo fijo para servicios
    });
  }

  goBack() {
    this.router.navigate(['/tabs/home']);
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
      visitor_id: null, // Se crea automáticamente en el backend
      service_id: formValue.service_id,
      visit_date: formValue.visit_date, // Fecha y hora completa
      expiration_date: null, // Sin expiración para servicios normales
      with_stay: 0, // Sin estadía prolongada
      remarks: formValue.remarks.trim(),
      cancelled: 0, // No cancelado inicialmente
      visited: 0, // No visitado aún
      entry_time: formValue.entry_time, // Hora de entrada
      car_plate: null, // Sin vehículo
      has_vehicle: 0, // Sin vehículo
      has_companions: 0, // Sin acompañantes
      companions: null, // Sin acompañantes
      type: 'SERVICE', // Tipo de servicio
    };

    this.store.dispatch(addReservation({ dto }));
  }

  // Getters para acceso fácil a los controles del formulario
  get serviceControl() {
    return this.form.get('service_id');
  }

  get remarksControl() {
    return this.form.get('remarks');
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
}
