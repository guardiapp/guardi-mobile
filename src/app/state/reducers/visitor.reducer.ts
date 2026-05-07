import { createReducer, on } from '@ngrx/store';
import { VisitorState } from './../../core/models/visitor.state';
import {
  deleteVisitor,
  loadVisitors,
  loadVisitorsFailure,
  loadVisitorsSuccess,
  searchVisitors,
  searchVisitorsSuccess,
  searchVisitorsFailure,
  clearVisitorSearchResults,
} from '../actions/visitor.actions';

export const initialState: VisitorState = {
  visitors: [],
  loading: false,
  error: null,
  is_searching: false,
  search_results: [],
  is_search_mode: false,
};

export const visitorReducer = createReducer(
  initialState,
  on(loadVisitors, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(loadVisitorsSuccess, (state, { visitors }) => ({
    ...state,
    visitors,
    loading: false,
    error: null,
  })),
  on(loadVisitorsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(deleteVisitor, (state, { visitorId }) => ({
    ...state,
    visitors: state.visitors.filter((visitor) => visitor.id !== visitorId),
    loading: false,
    error: null,
  })),

  // Nuevos reducers para búsqueda
  on(searchVisitors, (state) => ({
    ...state,
    is_searching: true,
    is_search_mode: true,
    error: null,
  })),
  on(searchVisitorsSuccess, (state, { visitors }) => ({
    ...state,
    search_results: visitors,
    is_searching: false,
    is_search_mode: true,
  })),
  on(searchVisitorsFailure, (state, { error }) => ({
    ...state,
    is_searching: false,
    error,
  })),
  on(clearVisitorSearchResults, (state) => ({
    ...state,
    search_results: [],
    is_search_mode: false,
    is_searching: false,
  }))
);
