import { AppState } from '../app.state';
import { ActionReducerMap, MetaReducer, Action } from '@ngrx/store';
import { authReducer } from './auth.reducer';
import * as AuthActions from '../actions/auth.actions';
import { reservationReducer } from './reservation.reducer';
import { visitorReducer } from './visitor.reducer';

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  reservations: reservationReducer,
  visitors: visitorReducer,
  // other reducers...
};

export function clearState(reducer: any) {
  return function (state: any, action: Action) {
    if (action.type === AuthActions.clearStore.type) {
      state = undefined;
    }
    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<AppState>[] = [clearState];
