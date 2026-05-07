import { createAction, props } from '@ngrx/store';
import { Reservation } from 'src/app/core/models/reservations.state';

// Action to load reservations with pagination parameters
export const loadReservations = createAction(
  '[Reservation] Load Reservations',
  props<{ page: number; reload?: boolean; state?: string }>() // Added props for pagination and state filter
);

// Action triggered when reservations are successfully loaded
export const loadReservationsSuccess = createAction(
  '[Reservation] Load Reservations Success',
  props<{
    reservations: Reservation[];
    current_page: number;
    next_page_url: string | null;
  }>() // Added props for current page and next page URL
);

// Action triggered when loading reservations fails
export const loadReservationsFailure = createAction(
  '[Reservation] Load Reservations Failure',
  props<{ error: any }>()
);

// Action to add a new reservation
export const addReservation = createAction(
  '[Reservation] Add Reservation',
  props<{ dtoList?: any[]; dto?: any; reservationType?: number }>()
);

// Action triggered when a reservation is successfully added
export const addReservationSuccess = createAction(
  '[Reservation] Add Reservation Success',
  props<{ reservation: Reservation }>()
);

// Action triggered when adding a reservation fails
export const addReservationFailure = createAction(
  '[Reservation] Add Reservation Failure',
  props<{ error: any }>()
);

// Action to update an existing reservation
export const updateReservation = createAction(
  '[Reservation] Update Reservation',
  props<{
    reservationId: number;
    dtoList?: any[];
    dto?: any;
    reservationType?: number;
  }>()
);

// Action triggered when a reservation is successfully updated
export const updateReservationSuccess = createAction(
  '[Reservation] Update Reservation Success',
  props<{ reservation: Reservation }>()
);

// Action triggered when updating a reservation fails
export const updateReservationFailure = createAction(
  '[Reservation] Update Reservation Failure',
  props<{ error: any }>()
);

// Action to delete a reservation
export const deleteReservation = createAction(
  '[Reservation] Delete Reservation',
  props<{ reservationId: number }>()
);

// Action to finalize a visit (delete after completion)
export const finalizeVisit = createAction(
  '[Reservation] Finalize Visit',
  props<{ reservationId: number }>()
);

// Action triggered when a reservation is successfully deleted
export const deleteReservationSuccess = createAction(
  '[Reservation] Delete Reservation Success',
  props<{ reservationId: number }>()
);

// Action triggered when deleting a reservation fails
export const deleteReservationFailure = createAction(
  '[Reservation] Delete Reservation Failure',
  props<{ error: any }>()
);

// Action to search reservations by visitor name
export const searchReservations = createAction(
  '[Reservation] Search Reservations',
  props<{ visitor_name: string; page?: number; state?: string }>()
);

// Action triggered when search reservations are successfully loaded
export const searchReservationsSuccess = createAction(
  '[Reservation] Search Reservations Success',
  props<{
    reservations: Reservation[];
    current_page: number;
    next_page_url: string | null;
    is_search: boolean;
  }>()
);

// Action triggered when search reservations fails
export const searchReservationsFailure = createAction(
  '[Reservation] Search Reservations Failure',
  props<{ error: any }>()
);

// Action to clear search results
export const clearSearchResults = createAction(
  '[Reservation] Clear Search Results'
);
