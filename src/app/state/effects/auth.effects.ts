import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../core/services/auth/auth.service';
import * as AuthActions from '../actions/auth.actions';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { TokenService } from 'src/app/core/services/token/token.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { PushNotifications, Token } from '@capacitor/push-notifications';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private loadingCtrl = inject(LoadingController);

  private tokenService = inject(TokenService);

  constructor() {}

  /* This code snippet defines an effect called `login$` using the `createEffect` function provided by
`@ngrx/effects`. The purpose of this effect is to handle the `login` action dispatched in the
application. */
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap((action: any) => {
        const { email, password } = action;
        this.presentLoading();
        return this.authService.login(email, password).pipe(
          map((userData) => {
            const userType = userData.user.type;
            if (userType !== 'Resident' && userType !== 'Guard') {
              this.loadingCtrl.dismiss();
              this.toastService.error('Tipo de usuario no permitido.');
              return AuthActions.loginFailure({
                error: 'Tipo de usuario no permitido.',
              });
            }

            this.router.navigate(['/tabs/reserve']);
            this.loadingCtrl.dismiss();
            localStorage.setItem('userData', JSON.stringify(userData));
            localStorage.setItem('guard', JSON.stringify(userData.user.guard));
            localStorage.setItem('type', userType);
            this.tokenService.saveToken(userData.token);
            this.tokenService.saveRefreshToken(userData.refresh_token);
            this.registerPushToken(userData.user.id);
            return AuthActions.loginSuccess({ userData });
          }),
          catchError((error) => {
            this.handleLoginError(error);
            return of(AuthActions.loginFailure({ error }));
          })
        );
      })
    )
  );

  /* The `logout$` effect is defined using the `createEffect` function provided by `@ngrx/effects`. This
 effect is triggered when the `logout` action is dispatched in the application. Here is a breakdown
 of what the `logout$` effect is doing: */
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      mergeMap(() => {
        this.presentLoading();
        return this.authService.logout().pipe(
          tap(() => {
            this.tokenService.removeToken();
            this.tokenService.removeRefreshToken();
            localStorage.removeItem('userData');
            this.router.navigate(['/login'], {
              replaceUrl: true,
            });
            this.loadingCtrl.dismiss();
          }),
          switchMap(() => [
            AuthActions.logoutSuccess(),
            AuthActions.clearStore(),
          ]),
          catchError((error) => {
            this.loadingCtrl.dismiss();
            // TODO: Esta condición debe ser removida si el token interceptor ya bora dichos datos
            if (error.status === 400) {
              this.tokenService.removeToken();
              this.tokenService.removeRefreshToken();
              localStorage.removeItem('userData');
              this.router.navigate(['/login'], {
                replaceUrl: true,
              });
            }
            return of(AuthActions.logoutFailure({ error }));
          })
        );
      })
    )
  );

  /* The `presentLoading()` function is an asynchronous function that creates and presents a loading
spinner using the `LoadingController` provided by Ionic. */
  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
      mode: 'ios',
    });
    await loading.present();
  }

  /**
   * Registra el push token para el usuario.
   */
  private registerPushToken(userId: number): void {
    const pushToken = localStorage.getItem('pushToken') || '';

    this.authService.registerPushToken(userId, pushToken).subscribe(
      (res) => {},
      (error) => {}
    );
  }

  /**
   * Centralized error handling for login errors.
   */
  private handleLoginError(error: HttpErrorResponse): void {
    console.error('Login error:', error);
    let errorMessage = 'Ocurrió un error inesperado.';

    if (error.status === 0) {
      errorMessage = 'Error de conexión.';
    } else if (error.error.message === 'Invalid credentials') {
      errorMessage = 'Credenciales inválidas.';
    }
    this.loadingCtrl.dismiss();
    this.toastService.error(errorMessage);
  }
}
