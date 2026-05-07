import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AlertService } from 'src/app/core/services/alert/alert.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { TokenService } from 'src/app/core/services/token/token.service';
import { environment } from 'src/environments/environment';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const alertService = inject(AlertService);
  const tokenService = inject(TokenService);
  // const apiKey = environment.apiSecretKey;
  const store = inject(Store);
  const token = localStorage.getItem('accessToken');
  const refreshToken = tokenService.getRefreshToken();

  const cloneRequest = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
    },
  });
  return next(cloneRequest);
};
