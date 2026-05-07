import { inject, Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { checkToken } from 'src/app/shared/interceptors/token.interceptor';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  private apiService = inject(ApiService);

  constructor() {}

  getUserInfo() {
    const { user } = JSON.parse(localStorage.getItem('userData') || 'null');
    return this.apiService
      .get<any[]>('person/', {
        context: checkToken(),
      })
      .pipe(
        map((response: any[]) =>
          response.find((u) => u.user.id === user.userId)
        )
      );
  }
}
