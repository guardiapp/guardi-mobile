import { Component, inject, OnInit, signal } from '@angular/core';
import { faBuilding, faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Visitor } from 'src/app/core/models/visitor.state';
import { ModalService } from 'src/app/core/services/modal/modal.service';
import {
  loadVisitors,
  searchVisitors,
  clearVisitorSearchResults,
} from 'src/app/state/actions/visitor.actions';
import {
  selectDisplayVisitors,
  selectVisitorsLoading,
  selectIsSearchingVisitors,
  selectIsVisitorSearchMode,
} from 'src/app/state/selectors/visitor.selectors';
import { ModalComponent } from './components/modal/modal.component';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-visitors',
  templateUrl: './visitors.page.html',
  styleUrls: ['./visitors.page.scss'],
})
export class VisitorsPage implements OnInit {
  private modalSvc: ModalService = inject(ModalService);
  private store = inject(Store);
  faBuilding = faBuilding;
  faCalendarDays = faCalendarDays;
  public visitors = signal<Visitor[]>([]);
  public visitorsTemp = signal<Visitor[]>([]);
  public isLoading$: Observable<boolean> = new Observable();
  public isSearching$: Observable<boolean> = new Observable();
  public isSearchMode$: Observable<boolean> = new Observable();
  public search = '';
  public faUsers = faUsers;
  private searchSubject = new Subject<string>();

  skeletonItems = [
    {
      id: 1,
    },
    {
      id: 2,
    },

    {
      id: 3,
    },

    {
      id: 4,
    },

    {
      id: 5,
    },

    {
      id: 6,
    },
  ];

  constructor() {
    // Configurar debounce para la búsqueda
    this.searchSubject
      .pipe(
        debounceTime(400), // Esperar 400ms después de que el usuario deje de escribir
        distinctUntilChanged() // Solo hacer búsqueda si el valor cambió
      )
      .subscribe((searchTerm) => {
        if (searchTerm.trim()) {
          this.store.dispatch(searchVisitors({ visitor_name: searchTerm }));
        } else {
          this.store.dispatch(clearVisitorSearchResults());
        }
      });
  }

  /**
   * The ngOnInit function calls the loadData method to initialize data when the component is
   * initialized.
   */
  ngOnInit() {
    this.store.dispatch(loadVisitors());
    this.loadData();
  }

  /**
   * The `loadData` function in TypeScript subscribes to the `selectDisplayVisitors` and `selectVisitorsLoading`
   * selectors, and organizes visitors into temporal categories.
   */
  loadData() {
    // Subscribe to display visitors (search results or normal visitors)
    this.store.select(selectDisplayVisitors).subscribe((visitors) => {
      this.visitors.set(visitors);
      this.visitorsTemp.set(visitors);
    });

    this.isLoading$ = this.store.select(selectVisitorsLoading);
    this.isSearching$ = this.store.select(selectIsSearchingVisitors);
    this.isSearchMode$ = this.store.select(selectIsVisitorSearchMode);
  }

  /**
   * The `onSearch` function triggers the search using the searchSubject with debounce.
   */
  onSearch() {
    // Usar el subject para hacer debounce de la búsqueda
    this.searchSubject.next(this.search);
  }

  /**
   * The `onScroll` function dynamically loads more data when scrolling (not used for search anymore).
   * @param {any} event - The `event` parameter in the `onScroll` function represents
   * the event triggered by the scrolling action.
   */
  onScroll(event: any): void {
    // Para el scroll infinito, solo completar el evento ya que ahora usamos la búsqueda asíncrona
    setTimeout(() => {
      event.target.complete();
    }, 1500);
  }

  /**
   * The `createVisitor` function opens a modal window displaying the `ModalComponent`.
   */
  createVisitor() {
    this.modalSvc.presentModal(ModalComponent);
  }

  /**
   * The `handleRefresh` function dispatches an action to load visitors and completes a refresh event
   * after a delay of 1500 milliseconds.
   * @param {any} event - The `event` parameter in the `handleRefresh` function is typically an event
   * object that is passed when a user triggers a refresh action, such as pulling down on a list to
   * refresh its content. In this case, it is used to complete the refresh action after a delay of 1500
   * milliseconds
   */
  handleRefresh(event: any) {
    setTimeout(() => event.target.complete(), 1500);

    // Limpiar búsqueda si está activa
    if (this.search.trim()) {
      this.search = '';
      this.store.dispatch(clearVisitorSearchResults());
    }

    this.store.dispatch(loadVisitors());
  }
}
