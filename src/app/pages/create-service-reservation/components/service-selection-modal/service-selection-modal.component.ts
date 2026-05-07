import { Component, inject, OnInit, signal } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ServiceService } from 'src/app/core/services/service/service.service';
import {
  Service,
  ServiceResponse,
} from 'src/app/core/models/services.interface';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { LoadingService } from 'src/app/core/services/loading/loading.service';

@Component({
  selector: 'app-service-selection-modal',
  templateUrl: './service-selection-modal.component.html',
  styleUrls: ['./service-selection-modal.component.scss'],
})
export class ServiceSelectionModalComponent implements OnInit {
  private modalCtrl = inject(ModalController);
  private serviceSvc = inject(ServiceService);
  private toastSvc = inject(ToastService);
  private loadingSvc = inject(LoadingService);

  public services = signal<Service[]>([]);
  public servicesLoading = signal<boolean>(false);
  public servicesCurrentPage = signal<number>(1);
  public servicesHasMorePages = signal<boolean>(true);
  public selectedServiceId: number | null = null;

  // Colores para cada servicio
  private serviceColors: { [key: string]: string } = {
    ridery: '#31d3ae',
    yummy: '#9359da',
    pedidosya: '#f52f41',
    farmatodo: '#418fde',
  };

  constructor() {}

  ngOnInit() {
    this.loadServices();
  }

  loadServices(page: number = 1, loadMore: boolean = false) {
    // Evitar cargas múltiples simultáneas
    if (this.servicesLoading()) {
      return;
    }

    if (!loadMore) {
      this.loadingSvc.present('Cargando servicios...');
      // Reset de datos cuando es carga inicial
      this.services.set([]);
      this.servicesCurrentPage.set(1);
      this.servicesHasMorePages.set(true);
    }

    this.servicesLoading.set(true);

    this.serviceSvc.getServices(page, 15).subscribe({
      next: (response: ServiceResponse) => {
        if (loadMore) {
          // Agregar más servicios a la lista existente
          this.services.update((currentServices) => [
            ...currentServices,
            ...response.data,
          ]);
        } else {
          // Reemplazar la lista completa
          this.services.set(response.data);
        }

        // Actualizar estado de paginación basado en la respuesta de la API
        this.servicesCurrentPage.set(response.current_page);
        this.servicesHasMorePages.set(
          response.next_page_url !== null &&
            response.current_page < response.last_page
        );

        this.servicesLoading.set(false);

        if (!loadMore) {
          this.loadingSvc.dismiss();
        }

        console.log(
          `Página ${response.current_page} de ${response.last_page} cargada. Servicios: ${response.data.length}`
        );
      },
      error: (error) => {
        this.servicesLoading.set(false);
        this.servicesHasMorePages.set(false);

        if (!loadMore) {
          this.loadingSvc.dismiss();
        }

        this.toastSvc.error('Error al cargar los servicios', 3000);
        console.error('Error loading services:', error);
      },
    });
  }

  loadMoreServices() {
    // Verificar si hay más páginas disponibles y no está cargando actualmente
    if (this.servicesHasMorePages() && !this.servicesLoading()) {
      const nextPage = this.servicesCurrentPage() + 1;
      console.log(`Cargando página ${nextPage}...`);
      this.loadServices(nextPage, true);
    } else {
      console.log('No hay más páginas para cargar o ya está cargando');
    }
  }

  selectService(service: Service) {
    this.selectedServiceId = service.id;
    this.modalCtrl.dismiss({ selectedService: service });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  onInfiniteScroll(event: any) {
    if (this.servicesHasMorePages() && !this.servicesLoading()) {
      this.loadMoreServices();

      // Esperar a que termine la carga antes de completar el infinite scroll
      const checkLoadingComplete = () => {
        if (!this.servicesLoading()) {
          event.target.complete();
        } else {
          setTimeout(checkLoadingComplete, 100);
        }
      };

      setTimeout(checkLoadingComplete, 100);
    } else {
      // No hay más páginas o está cargando, completar inmediatamente
      event.target.complete();
      if (!this.servicesHasMorePages()) {
        event.target.disabled = true;
      }
    }
  }

  /**
   * Obtiene el color específico para un servicio basado en su nombre
   * @param serviceName Nombre del servicio
   * @returns Color hexadecimal o color por defecto
   */
  getServiceColor(serviceName: string): string {
    const normalizedName = serviceName.toLowerCase().trim();

    // Buscar coincidencias exactas o parciales
    for (const [key, color] of Object.entries(this.serviceColors)) {
      if (normalizedName.includes(key)) {
        return color;
      }
    }

    // Color por defecto si no encuentra coincidencia
    return '#6B7280'; // Gray-500
  }

  /**
   * Obtiene el estilo CSS para el indicador de color del servicio
   * @param serviceName Nombre del servicio
   * @returns Objeto con estilos CSS
   */
  getServiceColorStyle(serviceName: string): { [key: string]: string } {
    return {
      'background-color': this.getServiceColor(serviceName),
    };
  }
}
