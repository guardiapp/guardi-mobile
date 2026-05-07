import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Reservation } from 'src/app/core/models/reservations.state';

import {
  loadReservations,
  searchReservations,
  clearSearchResults,
} from 'src/app/state/actions/reservation.actions';
import {
  selectLoading,
  selectLoadingMore,
  selectCurrentPage,
  selectNextPageUrl,
  selectIsSearching,
  selectDisplayReservations,
  selectIsSearchMode,
} from 'src/app/state/selectors/reservation.selectors';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.page.html',
  styleUrls: ['./reservations.page.scss'],
})
export class ReservationsPage implements OnInit {
  private store = inject(Store);
  public isLoading$: Observable<boolean> = new Observable();
  public isSearching$: Observable<boolean> = new Observable();
  private router = inject(Router);
  reservations = signal<Reservation[]>([]);
  reservationsTemp = signal<Reservation[]>([]);
  public search = signal('');
  public visitTypeFilter = signal<'all' | 'unique' | 'recurring'>('all');
  public stateFilter = signal<'all' | 'VISITED' | 'PENDING'>('all');
  public page = signal(1);
  public nextPageUrl = signal<string | null>(null);
  public isloadingMore$: Observable<boolean> = new Observable();
  public isSearchMode$: Observable<boolean> = new Observable();
  private searchSubject = new Subject<string>();

  skeletonItems = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
  ];

  constructor() {
    // Configurar debounce para la búsqueda
    this.searchSubject
      .pipe(
        debounceTime(400), // Esperar 500ms después de que el usuario deje de escribir
        distinctUntilChanged() // Solo hacer búsqueda si el valor cambió
      )
      .subscribe((searchTerm) => {
        if (searchTerm.trim()) {
          this.store.dispatch(
            searchReservations({
              visitor_name: searchTerm,
              state: this.getStateParam(),
            })
          );
        } else {
          this.store.dispatch(clearSearchResults());
          this.applyFilters();
        }
      });
  }

  ngOnInit(): void {
    this.store.dispatch(
      loadReservations({
        page: this.page(),
        reload: true,
        state: this.getStateParam(),
      })
    );

    // Subscribe to display reservations (search results or normal reservations)
    this.store.select(selectDisplayReservations).subscribe((reservations) => {
      this.reservations.set(reservations);
      this.applyFilters();
    });

    this.isLoading$ = this.store.select(selectLoading);
    this.isSearching$ = this.store.select(selectIsSearching);
    this.isloadingMore$ = this.store.select(selectLoadingMore);
    this.isSearchMode$ = this.store.select(selectIsSearchMode);

    this.store.select(selectCurrentPage).subscribe((page) => {
      this.page.set(page);
    });

    this.store.select(selectNextPageUrl).subscribe((nextPageUrl) => {
      this.nextPageUrl.set(nextPageUrl);
    });
  }

  handleRefresh(event: any) {
    setTimeout(() => event.target.complete(), 1500);
    this.page.set(1);

    // Limpiar búsqueda si está activa
    if (this.search().trim()) {
      this.search.set('');
      this.store.dispatch(clearSearchResults());
    }

    this.store.dispatch(
      loadReservations({
        page: this.page(),
        reload: true,
        state: this.getStateParam(),
      })
    );
  }

  onScroll(event: any): void {
    if (this.nextPageUrl()) {
      // Load the next page if available
      this.page.set(
        parseInt(this.nextPageUrl()![this.nextPageUrl()!.length - 1])
      );

      // Si estamos en modo búsqueda, cargar más resultados de búsqueda
      if (this.search().trim()) {
        this.store.dispatch(
          searchReservations({
            visitor_name: this.search(),
            page: this.page(),
            state: this.getStateParam(),
          })
        );
      } else {
        this.store.dispatch(
          loadReservations({
            page: this.page(),
            state: this.getStateParam(),
          })
        );
      }
    }

    setTimeout(() => {
      event.target.complete();
    }, 1500);
  }

  orderSearch(event: any) {
    // Usar el subject para hacer debounce de la búsqueda
    const searchTerm = event.target.value ?? '';
    this.search.set(searchTerm);
    this.searchSubject.next(searchTerm);
  }

  applyFilters() {
    let filteredReservations = this.reservations();

    // Solo aplicar filtro por tipo de visita (la búsqueda por nombre ahora es asíncrona)
    if (this.visitTypeFilter() !== 'all') {
      filteredReservations = filteredReservations.filter(
        (item: Reservation) => {
          if (this.visitTypeFilter() === 'unique') {
            return !item.with_stay; // with_stay = 0 para visitas únicas
          } else if (this.visitTypeFilter() === 'recurring') {
            return !!item.with_stay; // with_stay = 1 para visitas recurrentes
          }
          return true;
        }
      );
    }

    this.reservationsTemp.set(filteredReservations);
  }

  onVisitTypeFilterChange(filterType: 'all' | 'unique' | 'recurring') {
    this.visitTypeFilter.set(filterType);

    const previousStateFilter = this.stateFilter();
    this.stateFilter.set('all');

    if (previousStateFilter !== 'all') {
      this.page.set(1);

      if (this.search().trim()) {
        this.search.set('');
        this.store.dispatch(clearSearchResults());
      }

      this.store.dispatch(
        loadReservations({
          page: this.page(),
          reload: true,
          state: this.getStateParam(),
        })
      );
    } else {
      this.applyFilters();
    }
  }

  onVisitTypeSegmentChange(event: any) {
    this.onVisitTypeFilterChange(event.detail.value);
  }

  onStateFilterChange(filterType: 'all' | 'VISITED' | 'PENDING') {
    this.stateFilter.set(filterType);
    this.page.set(1);

    // Limpiar búsqueda si está activa
    if (this.search().trim()) {
      this.search.set('');
      this.store.dispatch(clearSearchResults());
    }

    this.store.dispatch(
      loadReservations({
        page: this.page(),
        reload: true,
        state: this.getStateParam(),
      })
    );
  }

  onStateSegmentChange(event: any) {
    this.onStateFilterChange(event.detail.value);
  }

  getCurrentFilter(): string {
    // Si hay un filtro de estado activo (no 'all'), devolver ese
    if (this.stateFilter() !== 'all') {
      return this.stateFilter();
    }
    // Si no, devolver el filtro de tipo de visita
    return this.visitTypeFilter();
  }

  onCombinedSegmentChange(event: any) {
    const value = event.detail.value;

    if (value === 'VISITED' || value === 'PENDING') {
      this.visitTypeFilter.set('all');
      this.onStateFilterChange(value);
    } else {
      this.onVisitTypeFilterChange(value);
    }
  }

  private getStateParam(): string | undefined {
    return this.stateFilter() === 'all' ? undefined : this.stateFilter();
  }

  onReserve() {
    this.router.navigate(['/tabs/create-reservation']);
  }
}
