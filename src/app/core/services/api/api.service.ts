import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAuthState } from 'src/app/state/selectors/auth.selectors';
import { environment } from 'src/environments/environment'; // Import environment
import { RequestOptions } from '../../models/api.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private store = inject(Store);
  private http = inject(HttpClient);

  // Use apiUrl from environment
  private readonly apiUrl = environment.apiUrl;

  constructor() {
    // Optionally handle any logic related to auth state if needed
    this.store.select(selectAuthState).subscribe((auth) => {
      // Logic here if needed
    });
  }

  /**
   * GET request
   * @param {string} endPoint end point for the get by Id
   * @param {RequestOptions} options options of the request like headers, body, etc.
   * @returns {Observable<T>}
   */
  public getById<T>(endPoint: string, options?: RequestOptions): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${endPoint}`, options);
  }

  /**
   * GET request
   * @param {string} endPoint end point for the get
   * @param {RequestOptions} options options of the request like headers, body, etc.
   * @returns {Observable<T>}
   */
  public get<T>(endPoint: string, options?: RequestOptions): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${endPoint}`, options);
  }

  /**
   * POST request
   * @param {string} endPoint end point of the api
   * @param {any} dto data to be sent in the body of the request
   * @param {RequestOptions} options options of the request like headers, body, etc.
   * @returns {Observable<T>}
   */
  public post<T>(
    endPoint: string,
    dto: any,
    options?: RequestOptions
  ): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${endPoint}`, dto, options);
  }

  /**
   * PUT request
   * @param {string} endPoint end point of the api
   * @param {RequestOptions} options options of the request like headers, body, etc.
   * @returns {Observable<T>}
   */
  public put<T>(
    endPoint: string,
    body: any,
    options?: RequestOptions
  ): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}${endPoint}`, body, options);
  }

  public patch<T>(
    endPoint: string,
    body: any,
    options?: RequestOptions
  ): Observable<T> {
    return this.http.patch<T>(`${this.apiUrl}${endPoint}`, body, options);
  }

  /**
   * DELETE request
   * @param {string} endPoint end point of the api
   * @param {RequestOptions} options options of the request like headers, body, etc.
   * @returns {Observable<T>}
   */
  public delete<T>(endPoint: string, options?: RequestOptions): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}${endPoint}`, options);
  }
}
