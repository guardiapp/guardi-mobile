/**
 * @file ReservationService
 * @description This service handles all operations related to reservations, including fetching, creating, updating, and deleting reservations.
 * It communicates with the backend API using the `ApiService` and applies token-based authentication via the `checkToken` interceptor.
 */

import { inject, Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { map, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { checkToken } from 'src/app/shared/interceptors/token.interceptor';
import {
  Reservation,
  ReservationResponse,
} from '../../models/reservations.state';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private apiSvc = inject(ApiService);
  private apiUrl = environment.apiUrl;

  constructor() {}

  /**
   * Fetches all reservations from the backend API with optional pagination and search parameters.
   *
   * @param {number} page - The page number to fetch (default is 1).
   * @param {number} per_page - The number of reservations per page (default is 10).
   * @param {string} visitor_name - Optional visitor name to search for.
   * @param {string} state - Optional state filter (VISITED or PENDING).
   * @returns {Observable<ReservationResponse>} An observable containing the list of reservations.
   * The response is transformed to include a `fullname` property for each visitor.
   */
  public getAll(
    page: number = 1,
    per_page: number = 10,
    visitor_name?: string,
    state?: string
  ): Observable<ReservationResponse> {
    const params: any = { per_page: per_page.toString() };
    if (page > 1) {
      params.page = page.toString();
    }
    if (visitor_name && visitor_name.trim()) {
      params.visitor_name = visitor_name.trim();
    }
    if (state && state.trim()) {
      params.state = state.trim();
    }

    return this.apiSvc
      .get<ReservationResponse>('visits', { context: checkToken(), params })
      .pipe(
        map((response) => ({
          ...response,
          data: response.data.map((visit) => {
            // Para reservaciones de servicio, el visitor puede no tener first_name/last_name
            const getFullname = () => {
              if (visit.type === 'SERVICE') {
                return visit.service?.description || 'Servicio solicitado';
              }
              if (visit.visitor?.first_name && visit.visitor?.last_name) {
                return `${visit.visitor.first_name} ${visit.visitor.last_name}`;
              }
              return 'Visitante';
            };

            return {
              ...visit,
              visitor: {
                ...visit.visitor,
                fullname: getFullname(),
              },
            };
          }),
        }))
      );
  }

  /**
   * Fetches a reservation by its ID from the backend API.
   *
   * @param {number} id - The ID of the reservation to fetch.
   * @returns {Observable<any>} An observable containing the reservation details.
   */
  public getById(id: number): Observable<any> {
    return this.apiSvc
      .get<Reservation>(`visits/${id}`, {
        context: checkToken(),
      })
      .pipe(
        map((response) => {
          // Para reservaciones de servicio, el visitor puede no tener first_name/last_name
          const getFullname = () => {
            if (response.type === 'SERVICE') {
              return response.service?.description || 'Servicio solicitado';
            }
            if (response.visitor?.first_name && response.visitor?.last_name) {
              return `${response.visitor.first_name} ${response.visitor.last_name}`;
            }
            return 'Visitante';
          };

          return {
            ...response,
            visitor: {
              ...response.visitor,
              fullname: getFullname(),
            },
          };
        }),
        catchError((error) => {
          const errorMessage = `Http failure response for ${this.apiUrl}visits/${id}: 404 Not Found`;
          if (error.message === errorMessage) {
            return throwError(() => new Error('Visita no encontrada'));
          }
          return throwError(() => error);
        })
      );
  }

  /**
   * Creates a new reservation by sending the provided data to the backend API.
   *
   * @param {any} dto - The data transfer object containing the reservation details.
   * @returns {Observable<any>} An observable containing the response from the API.
   */
  public createReservation(dto: any): Observable<any> {
    return this.apiSvc.post('visits', dto, { context: checkToken() });
  }

  /**
   * Deletes a reservation by its ID.
   *
   * @param {number} id - The ID of the reservation to delete.
   * @returns {Observable<any>} An observable containing the response from the API.
   */
  public delete(id: number): Observable<any> {
    return this.apiSvc.delete(`visits/${id}`, { context: checkToken() });
  }

  /**
   * Updates an existing reservation by its ID with the provided data.
   *
   * @param {any} id - The ID of the reservation to update.
   * @param {any} dto - The data transfer object containing the updated reservation details.
   * @returns {Observable<any>} An observable containing the response from the API.
   */
  public update(id: any, dto: any): Observable<any> {
    return this.apiSvc.put(`visits/${id}`, dto, {
      context: checkToken(),
    });
  }

  public getQr(id: number): Observable<any> {
    return this.apiSvc.get(`visits/${id}/getQrImage`, {
      context: checkToken(),
    });
  }
}
