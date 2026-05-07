import { createReducer, on } from '@ngrx/store';
import * as UserActions from '../actions/user.actions';
import { User, UserState } from 'src/app/core/models/user.state.intercafe';

export const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

export const userReducer = createReducer(
  initialState,
  on(UserActions.loadUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UserActions.loadUserSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    error: null,
  })),
  on(UserActions.loadUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(UserActions.clearUser, (state) => ({
    ...state,
    user: null,
    loading: false,
    error: null,
  }))
);
