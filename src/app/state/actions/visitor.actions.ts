import { createAction, props } from '@ngrx/store';

export const loadVisitors = createAction('[Visitor] Load Visitors');

export const loadVisitorsSuccess = createAction(
  '[Visitor] Load Visitors Success',
  props<{ visitors: any[] }>()
);

export const loadVisitorsFailure = createAction(
  '[Visitor] Load Visitors Failure',
  props<{ error: any }>()
);

export const addVisitor = createAction(
  '[Visitor] Add Visitor',
  props<{ dto: any }>()
);

export const addVisitorSuccess = createAction(
  '[Visitor] Add Visitor Success',
  props<{ visitor: any }>()
);

export const addVisitorFailure = createAction(
  '[Visitor] Add Visitor Failure',
  props<{ error: any }>()
);

export const updateVisitor = createAction(
  '[Visitor] Update Visitor',
  props<{ id: number; dto: any }>()
);

export const updateVisitorSuccess = createAction(
  '[Visitor] Update Visitor Success',
  props<{ visitor: any }>()
);

export const updateVisitorFailure = createAction(
  '[Visitor] Update Visitor Failure',
  props<{ error: any }>()
);

export const deleteVisitor = createAction(
  '[Visitor] Delete Visitor',
  props<{ visitorId: number }>()
);

export const deleteVisitorSuccess = createAction(
  '[Visitor] Delete Visitor Success',
  props<{ visitorId: number }>()
);

export const deleteVisitorFailure = createAction(
  '[Visitor] Delete Visitor Failure',
  props<{ error: any }>()
);

// Nuevas acciones para búsqueda de visitors
export const searchVisitors = createAction(
  '[Visitor] Search Visitors',
  props<{ visitor_name: string }>()
);

export const searchVisitorsSuccess = createAction(
  '[Visitor] Search Visitors Success',
  props<{ visitors: any[] }>()
);

export const searchVisitorsFailure = createAction(
  '[Visitor] Search Visitors Failure',
  props<{ error: any }>()
);

export const clearVisitorSearchResults = createAction(
  '[Visitor] Clear Search Results'
);
