import { createAction, props } from '@ngrx/store';
import { User, UserData } from 'src/app/core/models/user.state.intercafe';

export const loadUser = createAction('[User] Load User');

export const loadUserSuccess = createAction(
  '[User] Load Users Success',
  props<{ user: UserData }>()
);

export const loadUserFailure = createAction(
  '[User] Load Users Failure',
  props<{ error: any }>()
);

export const clearUser = createAction(
  '[User] Clear User',
  props<{ error: any }>()
);
