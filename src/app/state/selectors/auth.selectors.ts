import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AuthState } from 'src/app/core/models/auth.state.interface';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (authState: AuthState) => authState.isAuthenticated
);

export const selectUser = createSelector(
  selectAuthState,
  (authState: AuthState) => authState.user
);

export const selectAuthError = createSelector(
  selectAuthState,
  (authState: AuthState) => authState.error
);

export const selectAccessToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.token
);

export const selectApartmentId = createSelector(
  selectAuthState,
  (authState: AuthState) => authState.apartment?.id
);

export const selectResidentId = createSelector(
  selectAuthState,
  (authState: AuthState) => authState.apartment?.resident?.id
);
