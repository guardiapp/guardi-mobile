import { createReducer, on } from '@ngrx/store';
import {
  login,
  loginSuccess,
  loginFailure,
  logout,
  clearStore,
  updateAccessToken,
  updateRefreshToken,
} from '../actions/auth.actions';
import { AuthState } from 'src/app/core/models/auth.state.interface';

const userData = localStorage.getItem('userData')
  ? JSON.parse(localStorage.getItem('userData') || '{}')
  : {
      token: '',
      refresh_token: '',
      isAuthenticated: false,
      user: null,
      apartment_id: null,
      building: null,
      error: null,
    };

export const initialState: AuthState = {
  token: userData?.token || '',
  refresh_token: userData?.refresh_token || '',
  isAuthenticated: !!userData,
  user: userData.user,
  apartment: userData?.apartment || null,
  error: null,
};

export const authReducer = createReducer(
  initialState,
  on(login, (state) => ({
    ...state,
    error: null,
  })),
  on(loginSuccess, (state, { userData }) => ({
    ...state,
    token: userData.token,
    refresh_token: userData.refresh_token,
    isAuthenticated: true,
    user: userData.user,
    apartment: userData.apartment,
    error: null,
  })),
  on(loginFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(logout, (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
    apartment_id: null,
    building: null,
    error: null,
  })),
  on(clearStore, (state) => ({
    token: null,
    refresh_token: null,
    isAuthenticated: false,
    user: null,
    apartment: null,
    error: null,
  })),
  on(updateAccessToken, (state: AuthState, { access_token }) => ({
    ...state,
    access_token,
  })),
  on(updateRefreshToken, (state: AuthState, { refresh_token }) => ({
    ...state,
    refresh_token,
  }))
);
