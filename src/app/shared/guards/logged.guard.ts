import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from 'src/app/core/services/token/token.service';

export const loggedGuard: CanActivateFn = (route, state) => {
  const tokenservice = inject(TokenService);
  const router = inject(Router);
  const isValidToken = tokenservice.isValidRefreshToken();

  if (isValidToken) {
    router.navigate(['/']);
  }
  return true;
};
