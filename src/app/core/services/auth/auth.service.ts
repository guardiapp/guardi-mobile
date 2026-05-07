import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LoginResponse } from '../../models/auth.state.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import { selectAuthState } from 'src/app/state/selectors/auth.selectors';
import { TokenService } from '../token/token.service';
import { checkToken } from 'src/app/shared/interceptors/token.interceptor';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenService = inject(TokenService);
  private http = inject(HttpClient);
  private store = inject(Store);
  private apiUrl = environment.apiUrl;
  public token = signal('');
  public refresh = signal('');

  constructor() {
    this.store.select(selectAuthState).subscribe((auth) => {
      this.token.set(auth.token || '');
      this.refresh.set(auth.refresh_token || '');
    });
  }

  login(email: string, password: string): Observable<any> {
    const loginData = { password, email };
    return this.http.post<LoginResponse>(`${this.apiUrl}auth/login`, loginData);
  }

  logout(): Observable<any> {
    return this.http.post(
      `${this.apiUrl}auth/logout`,
      {},
      { context: checkToken() }
    );
  }

  getAuthToken() {
    return localStorage.getItem('token') || '';
  }

  refreshToken(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}auth/refresh-token`, {}).pipe(
      tap((response) => {
        this.tokenService.saveToken(response.token);
        // this.tokenService.saveRefreshToken(response.refresh_token);
      })
    );
  }

  registerPushToken(userId: number, firebase_token: string): Observable<any> {
    const data = {
      user_id: userId,
      firebase_token,
    };
    return this.http.put(`${this.apiUrl}users/set-firebase-token`, data, {
      context: checkToken(),
    });
  }

  panicAlert() {
    return this.http.post(
      `${this.apiUrl}notifications/panic`,
      {},
      {
        context: checkToken(),
      }
    );
  }
}
