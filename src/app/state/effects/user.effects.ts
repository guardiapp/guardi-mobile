import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { PersonService } from 'src/app/core/services/person/person.service';
import { of } from 'rxjs';
import {
  loadUser,
  loadUserFailure,
  loadUserSuccess,
} from '../actions/user.actions';

@Injectable()
export class UserEffects {
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUser),
      mergeMap(() =>
        this.personService.getUserInfo().pipe(
          map((user) => loadUserSuccess({ user })),
          catchError((error) => of(loadUserFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private personService: PersonService
  ) {}
}
