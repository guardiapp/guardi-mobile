import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ReservationService } from '../../core/services/reservation/reservation.service';
import {
  loadReservations,
  loadReservationsSuccess,
  loadReservationsFailure,
  addReservation,
  addReservationSuccess,
  addReservationFailure,
  deleteReservation,
  deleteReservationSuccess,
  deleteReservationFailure,
  finalizeVisit,
  updateReservation,
  updateReservationSuccess,
  searchReservations,
  searchReservationsSuccess,
  searchReservationsFailure,
  clearSearchResults,
} from '../actions/reservation.actions';
import { loadVisitors } from '../actions/visitor.actions';
import { LoadingController, ModalController } from '@ionic/angular';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { SuccessModalComponent } from 'src/app/pages/create-reservation/components/success-modal/success-modal.component';

@Injectable()
export class ReservationEffects {
  private loadingCtrl = inject(LoadingController);
  private modalCtrl = inject(ModalController);
  private toastService = inject(ToastService);
  private store = inject(Store);

  constructor(
    private actions$: Actions,
    private reservationService: ReservationService
  ) {}

  loadReservations$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadReservations),
      mergeMap((action) =>
        this.reservationService
          .getAll(action.page, 10, undefined, action.state)
          .pipe(
            map((response) => {
              return loadReservationsSuccess({
                reservations: response.data,
                current_page: action.reload ? 1 : response.current_page,
                next_page_url: response.next_page_url,
              });
            }),
            catchError((error: HttpErrorResponse) => {
              if (error.status === 0) {
                this.toastService.error('Error de conexión');
              } else {
                this.toastService.error(error.message);
              }
              return of(loadReservationsFailure({ error }));
            })
          )
      )
    );
  });

  addReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addReservation),
      mergeMap((action: any) => {
        this.presentLoading('Creando reservación');

        return this.reservationService.createReservation(action.dto).pipe(
          map((response) => {
            this.loadingCtrl.dismiss();
            this.openSuccessModal(response.id);
            this.store.dispatch(loadVisitors());
            return action.reservationType === 2
              ? loadReservations({ page: 1 })
              : addReservationSuccess({ reservation: response });
          }),
          catchError((error: HttpErrorResponse) => {
            this.loadingCtrl.dismiss();
            const finalError = error.error;
            const errorMessage =
              finalError.message === 'Reservation already exists'
                ? 'Ya existe esta reservación'
                : error.error;
            if (error.status === 0) {
              this.toastService.error('Error de conexión');
            } else {
              this.toastService.error(errorMessage);
            }
            return of(addReservationFailure({ error }));
          })
        );
      })
    )
  );

  deleteReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteReservation),
      mergeMap((action) => {
        this.presentLoading('Eliminando reservación');
        return this.reservationService.delete(action.reservationId).pipe(
          map(() => {
            this.loadingCtrl.dismiss();
            this.toastService.success('Visita eliminada');
            this.store.dispatch(loadVisitors());
            return deleteReservationSuccess({
              reservationId: action.reservationId,
            });
          }),
          catchError((error) => {
            this.loadingCtrl.dismiss();

            if (error.status === 0) {
              this.toastService.error('Error de conexión');
            } else {
              this.toastService.error('Error al eliminar la reservación');
            }
            return of(deleteReservationFailure({ error }));
          })
        );
      })
    )
  );

  finalizeVisit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(finalizeVisit),
      mergeMap((action) => {
        // No mostrar loading para finalización ya que se maneja en el modal
        return this.reservationService.delete(action.reservationId).pipe(
          map(() => {
            this.toastService.success('Visita finalizada');
            this.store.dispatch(loadVisitors());
            return deleteReservationSuccess({
              reservationId: action.reservationId,
            });
          }),
          catchError((error) => {
            if (error.status === 0) {
              this.toastService.error('Error de conexión');
            } else {
              this.toastService.error('Error al finalizar la visita');
            }
            return of(deleteReservationFailure({ error }));
          })
        );
      })
    )
  );

  updateReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateReservation),
      mergeMap((action: any) => {
        this.presentLoading('Editando reservación');

        return this.reservationService
          .update(action.reservationId, action.dto)
          .pipe(
            map((response) => {
              this.loadingCtrl.dismiss();
              this.toastService.success('Reservación actualizada');
              this.modalCtrl.dismiss();
              this.store.dispatch(loadReservations({ page: 1 }));
              return action.reservationType === 2
                ? loadReservations({ page: 1 })
                : updateReservationSuccess({ reservation: response });
            }),
            catchError((error: HttpErrorResponse) => {
              this.loadingCtrl.dismiss();
              const finalError = error.error;
              const errorMessage =
                finalError.message === 'Reservation already exists'
                  ? 'Ya existe esta reservación'
                  : error.error;

              if (error.status === 0) {
                this.toastService.error('Error de conexión');
              } else {
                this.toastService.error(errorMessage);
              }
              return of(addReservationFailure({ error }));
            })
          );
      })
    )
  );

  searchReservations$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(searchReservations),
      mergeMap((action) =>
        this.reservationService
          .getAll(action.page || 1, 10, action.visitor_name, action.state)
          .pipe(
            map((response) => {
              return searchReservationsSuccess({
                reservations: response.data,
                current_page: response.current_page,
                next_page_url: response.next_page_url,
                is_search: true,
              });
            }),
            catchError((error: HttpErrorResponse) => {
              if (error.status === 0) {
                this.toastService.error('Error de conexión');
              } else {
                this.toastService.error(error.message);
              }
              return of(searchReservationsFailure({ error }));
            })
          )
      )
    );
  });

  async presentLoading(message: string) {
    const loading = await this.loadingCtrl.create({
      message,
      mode: 'ios',
    });
    await loading.present();
  }

  async openSuccessModal(reservationId: number) {
    const modal = await this.modalCtrl.create({
      component: SuccessModalComponent,
      componentProps: {
        reservationId,
      },
    });
    await modal.present();
  }
}
