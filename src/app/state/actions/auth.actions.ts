import { createAction, props } from '@ngrx/store';
import { LoginResponse } from 'src/app/core/models/auth.state.interface';

export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ userData: LoginResponse }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: any }>()
);

export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');

export const logoutFailure = createAction(
  '[Auth] Logout Failure',
  props<{ error: any }>()
);

export const clearStore = createAction('[Auth] Clear Store');

export const updateAccessToken = createAction(
  '[Auth] Update Access Token',
  props<{ access_token: string }>()
);

export const updateRefreshToken = createAction(
  '[Auth] Update Refresh Token',
  props<{ refresh_token: string }>()
);
