import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';
import { checkToken } from 'src/app/shared/interceptors/token.interceptor';
import { ServiceResponse, Service } from '../../models/services.interface';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  private apiService = inject(ApiService);

  constructor() {}

  /**
   * Obtiene la lista de servicios disponibles con paginación
   * @param page Página a cargar (default: 1)
   * @param perPage Elementos por página (default: 15)
   * @returns Observable con la respuesta paginada de servicios
   */
  getServices(
    page: number = 1,
    perPage: number = 15
  ): Observable<ServiceResponse> {
    return this.apiService.get<ServiceResponse>(
      `services?page=${page}&per_page=${perPage}`,
      {
        context: checkToken(),
      }
    );
  }

  /**
   * Obtiene un servicio por su ID
   * @param id ID del servicio
   * @returns Observable con el servicio
   */
  getServiceById(id: number): Observable<Service> {
    return this.apiService.get<Service>(`services/${id}`, {
      context: checkToken(),
    });
  }
}
