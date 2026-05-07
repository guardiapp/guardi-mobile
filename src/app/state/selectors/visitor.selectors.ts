import { createFeatureSelector, createSelector } from '@ngrx/store';
import { VisitorState } from './../../core/models/visitor.state';

export const selectVisitorState =
  createFeatureSelector<VisitorState>('visitors');

export const selectVisitors = createSelector(
  selectVisitorState,
  (state: VisitorState) => state.visitors
);

export const selectVisitorById = (visitorId: number) =>
  createSelector(selectVisitorState, (state: VisitorState) =>
    state.visitors.find((visitor) => visitor.id === visitorId)
  );

export const selectVisitorLoading = createSelector(
  selectVisitorState,
  (state: VisitorState) => state.loading
);

export const selectVisitorError = createSelector(
  selectVisitorState,
  (state: VisitorState) => state.error
);

export const selectVisitorsLoading = createSelector(
  selectVisitorState,
  (state: VisitorState) => state.loading
);

// Nuevos selectores para búsqueda
export const selectIsSearchingVisitors = createSelector(
  selectVisitorState,
  (state: VisitorState) => state.is_searching
);

export const selectVisitorSearchResults = createSelector(
  selectVisitorState,
  (state: VisitorState) => state.search_results
);

export const selectIsVisitorSearchMode = createSelector(
  selectVisitorState,
  (state: VisitorState) => state.is_search_mode
);

// Selector que devuelve los visitantes apropiados según el modo
export const selectDisplayVisitors = createSelector(
  selectVisitorState,
  (state: VisitorState) =>
    state.is_search_mode ? state.search_results : state.visitors
);
