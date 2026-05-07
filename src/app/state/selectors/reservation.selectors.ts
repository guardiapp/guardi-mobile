import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';

export const selectReservationsState = (state: AppState) => state.reservations;

export const selectLoading = createSelector(
  selectReservationsState,
  (state) => state.loading
);

export const selectLoadingMore = createSelector(
  selectReservationsState,
  (state) => state.loadingMore
);

export const selectReservations = createSelector(
  selectReservationsState,
  (state) => state.reservations
);

// Selector for the current page
export const selectCurrentPage = createSelector(
  selectReservationsState,
  (state) => state.current_page
);

// Selector for the next page URL
export const selectNextPageUrl = createSelector(
  selectReservationsState,
  (state) => state.next_page_url
);

// Nuevos selectores para búsqueda
export const selectIsSearching = createSelector(
  selectReservationsState,
  (state) => state.is_searching
);

export const selectSearchResults = createSelector(
  selectReservationsState,
  (state) => state.search_results
);

export const selectIsSearchMode = createSelector(
  selectReservationsState,
  (state) => state.is_search_mode
);

// Selector que devuelve las reservaciones apropiadas según el modo
export const selectDisplayReservations = createSelector(
  selectReservationsState,
  (state) => (state.is_search_mode ? state.search_results : state.reservations)
);
