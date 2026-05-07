import { createReducer, on } from '@ngrx/store';
import {
  addReservationSuccess,
  deleteReservation,
  loadReservations,
  loadReservationsFailure,
  loadReservationsSuccess,
  updateReservationSuccess,
  searchReservations,
  searchReservationsSuccess,
  searchReservationsFailure,
  clearSearchResults,
} from '../actions/reservation.actions';
import { ReservationState } from 'src/app/core/models/reservations.state';

export const initialState: ReservationState = {
  reservations: [],
  loading: false,
  loadingMore: false,
  error: null,
  current_page: 1,
  next_page_url: null,
  is_searching: false,
  search_results: [],
  is_search_mode: false,
};

export const reservationReducer = createReducer(
  initialState,
  on(loadReservations, (state, { page, reload }) => ({
    ...state,
    loading: true,
    loadingMore: reload
      ? false
      : state.current_page + 1 > 1 && state.next_page_url
      ? true
      : false, // True when current_page is greater than one
    error: null,
  })),
  on(
    loadReservationsSuccess,
    (state, { reservations, current_page, next_page_url }) => ({
      ...state,
      reservations:
        current_page > 1
          ? [...state.reservations, ...reservations] // Append new reservations if not the first page
          : [...reservations], // Replace reservations if it's the first page
      loading: false,
      loadingMore: false, // Reset loadingMore after success
      current_page, // Update current page
      next_page_url, // Update next page URL
    })
  ),
  on(loadReservationsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    loadingMore: false, // Reset loadingMore on failure
    error,
  })),

  // Search actions
  on(searchReservations, (state) => ({
    ...state,
    is_searching: true,
    is_search_mode: true,
    error: null,
  })),
  on(
    searchReservationsSuccess,
    (state, { reservations, current_page, next_page_url }) => ({
      ...state,
      search_results: reservations,
      is_searching: false,
      is_search_mode: true,
      current_page,
      next_page_url,
    })
  ),
  on(searchReservationsFailure, (state, { error }) => ({
    ...state,
    is_searching: false,
    error,
  })),
  on(clearSearchResults, (state) => ({
    ...state,
    search_results: [],
    is_search_mode: false,
    is_searching: false,
  })),

  on(addReservationSuccess, (state, { reservation }) => ({
    ...state,
    reservations: [...state.reservations, reservation],
  })),
  on(deleteReservation, (state, { reservationId }) => ({
    ...state,
    reservations: state.reservations.filter(
      (reservation) => reservation.id !== reservationId
    ),
  })),
  on(updateReservationSuccess, (state, { reservation }) => ({
    ...state,
    reservations: state.reservations.map((res) =>
      res.id === reservation.id ? reservation : res
    ),
  }))
);
