import { inject, Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { ResidentsResponse } from '../../models/residents.interface';
import { checkToken } from 'src/app/shared/interceptors/token.interceptor';

@Injectable({
  providedIn: 'root',
})
export class ResidentService {
  private apiService = inject(ApiService);

  constructor() {}

  getAll(page: number, perPage: number, search: string) {
    const params: any = { per_page: perPage, page };
    if (search && search.trim()) {
      params.search = search.trim();
    }

    return this.apiService.get<ResidentsResponse>('apartments', {
      params,
      context: checkToken(),
    });
  }
}
