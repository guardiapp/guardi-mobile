import { AppState } from './../app.state';
import { UserState } from 'src/app/core/models/user.state.intercafe';
import { createSelector } from '@ngrx/store';

export const selectUserState = (state: AppState) => state.user;

export const selectUser = createSelector(
  selectUserState,
  (state: UserState) => state.user
);

export const selectUserLoading = createSelector(
  selectUserState,
  (state: UserState) => state.loading
);
