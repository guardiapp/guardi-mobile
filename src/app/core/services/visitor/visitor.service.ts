import { VisitorResponse } from './../../models/visitor.state';
import { inject, Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { map, Observable } from 'rxjs';
import { checkToken } from 'src/app/shared/interceptors/token.interceptor';

@Injectable({
  providedIn: 'root',
})
export class VisitorService {
  private apiSvc: ApiService = inject(ApiService);

  constructor() {}

  getVisitors(
    user_resident_id: number,
    name?: string
  ): Observable<VisitorResponse> {
    const params: any = { per_page: '50', user_resident_id };

    if (name && name.trim()) {
      params.name = name.trim();
    }

    return this.apiSvc
      .get<VisitorResponse>('visitors', { context: checkToken(), params })
      .pipe(
        map((response) => {
          return {
            ...response,
            data: response.data.map((item) => ({
              ...item,
              fullname: `${item.first_name} ${item.last_name}`,
            })),
          };
        })
      );
  }

  createVisitor(dto: any) {
    return this.apiSvc.post('visitors', dto, {
      context: checkToken(),
    });
  }

  deleteVisitor(id: number) {
    return this.apiSvc.delete(`visitors/${id}`, {
      context: checkToken(),
    });
  }

  updateVisitor(id: number, dto: any) {
    return this.apiSvc.put(`visitors/${id}`, dto, {
      context: checkToken(),
    });
  }
}
