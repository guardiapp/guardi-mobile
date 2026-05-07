import { ActionReducerMap } from '@ngrx/store';
import { ReservationState } from '../core/models/reservations.state';
import { reservationReducer } from './reducers/reservation.reducer';
import { AuthState } from '../core/models/auth.state.interface';
import { authReducer } from './reducers/auth.reducer';
import { VisitorState } from '../core/models/visitor.state';
import { visitorReducer } from './reducers/visitor.reducer';
import { UserState } from '../core/models/user.state.intercafe';
import { userReducer } from './reducers/user.reducer';

export interface AppState {
  auth: AuthState;
  reservations: ReservationState;
  visitors: VisitorState;
}

export const ROOT_REDUCERS: ActionReducerMap<AppState> = {
  auth: authReducer,
  reservations: reservationReducer,
  visitors: visitorReducer,
};
