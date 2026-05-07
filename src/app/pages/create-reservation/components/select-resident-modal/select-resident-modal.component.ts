import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ResidentService } from 'src/app/core/services/resident/resident.service';
import {
  Apartment,
  Resident,
  ResidentsResponse,
} from 'src/app/core/models/residents.interface';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { ToastService } from 'src/app/core/services/toast/toast.service';

@Component({
  selector: 'app-select-resident-modal',
  templateUrl: './select-resident-modal.component.html',
  styleUrls: ['./select-resident-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
})
export class SelectResidentModalComponent implements OnInit, OnDestroy {
  private modalCtrl = inject(ModalController);
  private fb = inject(FormBuilder);
  private residentService = inject(ResidentService);

  public searchForm = this.fb.group({
    search: [''],
  });
  public residents = signal<Apartment[]>([]);
  public filteredResidents = signal<Apartment[]>([]);
  private searchSubscription?: Subscription;
  public page = signal(1);
  public nextPageUrl = signal<string | null>(null);
  public perPage = signal(50);
  public isLoading = signal(false);
  private toast = inject(ToastService);

  constructor() {}

  ngOnInit(): void {
    this.loadResidents('');
    const searchControl = this.searchForm.get('search');
    this.searchSubscription = searchControl?.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe({
        next: (term: string | null) => this.loadResidents(term ?? ''),
        error: () => {
          this.isLoading.set(false);
          this.toast.error('Error al cargar los residentes');
        },
      });
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  private loadResidents(search: string) {
    this.isLoading.set(true);
    this.residentService.getAll(this.page(), this.perPage(), search).subscribe({
      next: (res) => {
        this.nextPageUrl.set(res.next_page_url);
        this.residents.set(res.data ?? []);
        this.filteredResidents.set(this.residents());
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.toast.error('Error al cargar los residentes');
      },
    });
  }

  selectResident(apartment: Apartment) {
    this.modalCtrl.dismiss({
      resident: apartment.resident,
      apartment: apartment,
    });
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  onScroll(event: any) {
    const hasMore = this.nextPageUrl() !== null;
    if (!hasMore) {
      if (event?.target) {
        event.target.complete?.();
        event.target.disabled = true;
      }
      return;
    }

    const nextPage = this.page() + 1;
    const search = this.searchForm.get('search')?.value ?? '';

    this.residentService.getAll(nextPage, this.perPage(), search).subscribe({
      next: (res) => {
        this.page.set(res.current_page);
        this.nextPageUrl.set(res.next_page_url);
        this.perPage.set(res.per_page ?? this.perPage());
        this.residents.update((current) => [...current, ...(res.data ?? [])]);
        this.filteredResidents.set(this.residents());

        if (event?.target) {
          event.target.complete?.();
          if (!res.next_page_url) {
            event.target.disabled = true;
          }
        }
      },
      error: () => {
        event?.target?.complete?.();
      },
    });
  }
}
